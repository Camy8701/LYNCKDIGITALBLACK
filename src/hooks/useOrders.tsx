import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Order,
  OrderItem,
  OrderWithItems,
  CreateOrderInput,
  CreateOrderResponse,
  DownloadUrlResponse
} from '@/types/dashboard';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useCart } from './useCart';

// =====================================================
// QUERY HOOKS
// =====================================================

/**
 * Fetch all orders for the current user
 */
export function useOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async (): Promise<OrderWithItems[]> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });
}

/**
 * Fetch a single order by ID
 */
export function useOrder(orderId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async (): Promise<OrderWithItems | null> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!orderId
  });
}

/**
 * Fetch order items for a specific order
 */
export function useOrderItems(orderId: string) {
  return useQuery({
    queryKey: ['order-items', orderId],
    queryFn: async (): Promise<OrderItem[]> => {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!orderId
  });
}

// =====================================================
// MUTATION HOOKS
// =====================================================

/**
 * Create a new order from cart items
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { clearCart } = useCart();

  return useMutation({
    mutationFn: async (input: CreateOrderInput): Promise<CreateOrderResponse> => {
      if (!user) throw new Error('User not authenticated');

      // Step 1: Generate order number
      const { data: orderNumberData, error: orderNumberError } = await supabase
        .rpc('generate_order_number');

      if (orderNumberError) throw orderNumberError;
      const orderNumber = orderNumberData as string;

      // Step 2: Calculate totals
      let subtotal = 0;
      const enrichedItems = [];

      for (const item of input.items) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', item.product_id)
          .single();

        if (productError) throw productError;
        if (!product) throw new Error(`Product ${item.product_id} not found`);

        const itemSubtotal = product.price * item.quantity;
        subtotal += itemSubtotal;

        enrichedItems.push({
          product_id: product.id,
          product_name: product.name,
          product_slug: product.slug,
          product_description: product.short_description,
          product_image_url: product.image_url,
          unit_price: product.price,
          quantity: item.quantity,
          subtotal: itemSubtotal,
          download_url: product.file_url || null,
          download_count: 0,
          max_downloads: 5,
          download_expires_at: null
        });
      }

      const tax = 0; // TODO: Implement tax calculation
      const total = subtotal + tax;

      // Step 3: Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: input.payment_method === 'placeholder' ? 'completed' : 'pending',
          payment_method: input.payment_method,
          subtotal,
          tax,
          total,
          currency: 'USD',
          billing_address: input.billing_address,
          customer_notes: input.customer_notes,
          completed_at: input.payment_method === 'placeholder' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (orderError) throw orderError;
      if (!order) throw new Error('Failed to create order');

      // Step 4: Create order items
      const orderItemsToInsert = enrichedItems.map(item => ({
        ...item,
        order_id: order.id
      }));

      const { data: orderItems, error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert)
        .select();

      if (orderItemsError) throw orderItemsError;

      return {
        order: order as Order,
        order_items: orderItems as OrderItem[]
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      clearCart();
      toast.success(`Order ${data.order.order_number} created successfully!`);
    },
    onError: (error: Error) => {
      console.error('Create order error:', error);
      toast.error(`Failed to create order: ${error.message}`);
    }
  });
}

/**
 * Download a product from an order item
 */
export function useDownloadProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (orderItemId: string): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      // Step 1: Validate download access using database function
      const { data: downloadInfo, error: downloadError } = await supabase
        .rpc('get_download_url', {
          p_order_item_id: orderItemId,
          p_user_id: user.id
        })
        .single();

      if (downloadError) throw downloadError;

      const downloadData = downloadInfo as unknown as DownloadUrlResponse;

      if (!downloadData.can_download) {
        throw new Error(downloadData.error_message || 'Download not available');
      }

      if (!downloadData.download_url) {
        throw new Error('Download URL not found');
      }

      // Step 2: Increment download count
      const { error: updateError } = await supabase
        .from('order_items')
        .update({
          download_count: supabase.sql`download_count + 1`
        })
        .eq('id', orderItemId);

      if (updateError) throw updateError;

      // Step 3: Get product file from storage
      const { data: orderItem } = await supabase
        .from('order_items')
        .select('product_id, download_url')
        .eq('id', orderItemId)
        .single();

      if (!orderItem?.download_url) {
        throw new Error('Product file not found');
      }

      // Step 4: Generate signed URL from Supabase Storage
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('product-files')
        .createSignedUrl(orderItem.download_url, 3600); // 1 hour expiration

      if (signedUrlError) throw signedUrlError;
      if (!signedUrlData?.signedUrl) throw new Error('Failed to generate download URL');

      // Step 5: Log the download
      await supabase.from('download_logs').insert({
        order_item_id: orderItemId,
        user_id: user.id,
        product_id: orderItem.product_id,
        success: true
      });

      return signedUrlData.signedUrl;
    },
    onSuccess: (signedUrl, orderItemId) => {
      // Invalidate queries to refresh download counts
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-items'] });

      // Trigger browser download
      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = ''; // Browser will use filename from Content-Disposition header
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started!');
    },
    onError: (error: Error) => {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download product');
    }
  });
}

/**
 * Update order status (admin only)
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
      const updates: Partial<Order> = { status };

      // Set completed_at when order is completed
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error: Error) => {
      console.error('Update order status error:', error);
      toast.error(`Failed to update order status: ${error.message}`);
    }
  });
}
