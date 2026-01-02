import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create client with user's auth token for RLS
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { orderItemId } = await req.json();
    if (!orderItemId) {
      return new Response(
        JSON.stringify({ error: "Order item ID required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for database operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verify ownership and get order item details
    const { data: orderItem, error: orderItemError } = await supabaseAdmin
      .from("order_items")
      .select(`
        id,
        download_url,
        download_count,
        max_downloads,
        download_expires_at,
        product_id,
        order:orders!inner(
          id,
          user_id,
          status
        )
      `)
      .eq("id", orderItemId)
      .single();

    if (orderItemError || !orderItem) {
      console.error("Order item fetch error:", orderItemError);
      return new Response(
        JSON.stringify({ error: "Order item not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user owns this order
    // The inner join returns an object, not an array
    const order = orderItem.order as unknown as { id: string; user_id: string; status: string };
    if (!order || order.user_id !== user.id) {
      console.error("User does not own this order");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check order is completed
    if (order.status !== "completed") {
      return new Response(
        JSON.stringify({ error: "Order not completed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check download limits
    if (orderItem.download_count >= orderItem.max_downloads) {
      return new Response(
        JSON.stringify({ error: "Download limit exceeded" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiration
    if (orderItem.download_expires_at && new Date(orderItem.download_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Download link expired" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the file path from download_url or product
    let filePath = orderItem.download_url;
    
    if (!filePath && orderItem.product_id) {
      // Fallback: get file_url from product
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("file_url")
        .eq("id", orderItem.product_id)
        .single();
      
      filePath = product?.file_url;
    }

    if (!filePath) {
      return new Response(
        JSON.stringify({ error: "No download file available" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract path from full URL if needed
    // Format: https://xxx.supabase.co/storage/v1/object/public/product-files/path/to/file.zip
    // Or just: path/to/file.zip
    let storagePath = filePath;
    if (filePath.includes("/storage/v1/object/")) {
      const match = filePath.match(/\/product-files\/(.+)$/);
      if (match) {
        storagePath = match[1];
      }
    }

    // Generate signed URL (1 hour expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin
      .storage
      .from("product-files")
      .createSignedUrl(storagePath, 3600);

    if (signedUrlError || !signedUrlData) {
      console.error("Failed to create signed URL:", signedUrlError);
      
      // Log failed download
      await supabaseAdmin.from("download_logs").insert({
        order_item_id: orderItemId,
        user_id: user.id,
        product_id: orderItem.product_id,
        success: false,
        error_message: signedUrlError?.message || "Failed to create signed URL"
      });

      return new Response(
        JSON.stringify({ error: "Failed to generate download link" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Increment download count
    await supabaseAdmin
      .from("order_items")
      .update({ download_count: orderItem.download_count + 1 })
      .eq("id", orderItemId);

    // Log successful download
    await supabaseAdmin.from("download_logs").insert({
      order_item_id: orderItemId,
      user_id: user.id,
      product_id: orderItem.product_id,
      success: true
    });

    console.log("Download authorized for order item:", orderItemId);

    return new Response(
      JSON.stringify({ signedUrl: signedUrlData.signedUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Download error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
