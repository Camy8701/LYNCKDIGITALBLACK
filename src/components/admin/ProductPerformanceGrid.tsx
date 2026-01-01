import { useState } from "react";
import { Edit, BarChart3, X } from "lucide-react";
import { useProductPerformance } from "@/hooks/useAdminAnalytics";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductPerformanceGridProps {
  onEditProduct: (product: Product) => void;
}

const ProductPerformanceGrid = ({ onEditProduct }: ProductPerformanceGridProps) => {
  const { data: products, isLoading } = useProductPerformance();
  const [selectedProductForSales, setSelectedProductForSales] = useState<string | null>(null);

  // Fetch sales for selected product
  const { data: productSales } = useQuery({
    queryKey: ['product-sales', selectedProductForSales],
    queryFn: async () => {
      if (!selectedProductForSales) return null;

      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          unit_price,
          subtotal,
          order:orders (
            id,
            order_number,
            total,
            status,
            created_at,
            user:profiles (
              full_name,
              email:users (email)
            )
          )
        `)
        .eq('product_id', selectedProductForSales)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedProductForSales
  });

  const selectedProduct = products?.find(p => p.id === selectedProductForSales);

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4">
          PRODUCT PERFORMANCE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-4 border-2 border-foreground/10 animate-pulse">
              <div className="h-16 bg-foreground/10 rounded-xl mb-3"></div>
              <div className="h-8 bg-foreground/10 rounded mb-2"></div>
              <div className="h-10 bg-foreground/10 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4">
          PRODUCT PERFORMANCE
        </h2>
        <div className="bg-card rounded-2xl p-8 text-center border-2 border-foreground/10">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
          <h3 className="text-xl font-bold font-sans mb-2">No Sales Data Yet</h3>
          <p className="text-foreground/60 font-serif">
            Product performance data will appear here once you have sales
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-extrabold uppercase font-sans mb-4">
        PRODUCT PERFORMANCE
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-2xl p-4 border-2 border-foreground/10 hover:border-foreground/30 transition-all"
          >
            {/* Product Header */}
            <div className="flex gap-3 mb-3">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop';
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-vibrant-purple flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-8 h-8 text-foreground/60" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold font-sans text-sm truncate">{product.name}</h3>
                <p className="text-xs text-foreground/60 truncate">
                  {product.category || 'Uncategorized'}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-background/50 rounded-xl p-3">
                <div className="text-2xl font-extrabold font-sans text-vibrant-mint">
                  {product.unitsSoldWeek}
                </div>
                <div className="text-xs text-foreground/60 uppercase font-bold">
                  Sold This Week
                </div>
              </div>
              <div className="bg-background/50 rounded-xl p-3">
                <div className="text-2xl font-extrabold font-sans text-vibrant-purple">
                  ${product.revenueWeek.toFixed(0)}
                </div>
                <div className="text-xs text-foreground/60 uppercase font-bold">
                  Week Revenue
                </div>
              </div>
            </div>

            {/* Total Stats */}
            <div className="bg-vibrant-yellow/20 rounded-xl p-3 mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-foreground/60 uppercase font-bold">All-Time</div>
                  <div className="text-sm font-extrabold font-sans">
                    {product.unitsSoldTotal} units • ${product.revenueTotal.toFixed(0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Rate Placeholder */}
            <div className="bg-foreground/5 rounded-xl p-3 mb-3">
              <div className="text-xs text-foreground/60 uppercase font-bold mb-1">
                Conversion Rate
              </div>
              <div className="text-xs text-foreground/40 font-serif">
                Connect Google Analytics to track
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                className="flex-1 text-xs py-2 px-3 rounded-full border-2 border-foreground hover:bg-foreground hover:text-background transition-colors font-bold uppercase flex items-center justify-center gap-1"
                onClick={() => {
                  // Convert performance product to full Product type
                  const fullProduct: Product = {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    short_description: product.short_description || null,
                    description: product.description || null,
                    price: product.price,
                    original_price: product.original_price || null,
                    category_id: product.category_id || null,
                    image_url: product.image_url || null,
                    file_url: product.file_url || null,
                    is_featured: product.is_featured || false,
                    is_active: product.is_active !== undefined ? product.is_active : true,
                    created_at: product.created_at || new Date().toISOString(),
                    category: product.category ? {
                      id: product.category_id || '',
                      name: product.category,
                      slug: product.category.toLowerCase().replace(/\s+/g, '-'),
                      description: null,
                      color_class: 'bg-vibrant-purple',
                      created_at: new Date().toISOString()
                    } : null
                  };
                  onEditProduct(fullProduct);
                }}
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
              <button
                className="flex-1 text-xs py-2 px-3 rounded-full bg-foreground text-background hover:bg-foreground/80 transition-colors font-bold uppercase flex items-center justify-center gap-1"
                onClick={() => setSelectedProductForSales(product.id)}
              >
                <BarChart3 className="w-3 h-3" />
                Sales
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Modal */}
      {selectedProductForSales && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b-2 border-foreground/10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold uppercase font-sans">
                  SALES: {selectedProduct?.name}
                </h3>
                <p className="text-sm text-foreground/60 font-serif mt-1">
                  {productSales?.length || 0} total sales
                </p>
              </div>
              <button
                onClick={() => setSelectedProductForSales(null)}
                className="w-10 h-10 rounded-full border-2 border-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sales List */}
            <div className="flex-1 overflow-y-auto p-6">
              {!productSales || productSales.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
                  <p className="text-foreground/60 font-serif">No sales yet for this product</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {productSales.map((sale: any) => {
                    const order = sale.order;
                    const userProfile = order?.user;
                    const customerName = userProfile?.full_name || 'Unknown';
                    const customerEmail = userProfile?.email?.email || 'No email';

                    return (
                      <div
                        key={sale.id}
                        className="bg-card rounded-xl p-4 border border-foreground/10"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold font-sans text-sm">
                                {customerName}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                                  order?.status === 'completed'
                                    ? 'bg-vibrant-mint/30 text-green-800'
                                    : order?.status === 'pending'
                                    ? 'bg-vibrant-yellow/30 text-yellow-800'
                                    : 'bg-vibrant-coral/30 text-red-800'
                                }`}
                              >
                                {order?.status || 'unknown'}
                              </span>
                            </div>
                            <p className="text-xs text-foreground/60">
                              {customerEmail}
                            </p>
                            <p className="text-xs text-foreground/60 mt-1">
                              Order #{order?.order_number} •{' '}
                              {new Date(order?.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-extrabold font-sans text-vibrant-mint">
                              ${sale.subtotal.toFixed(2)}
                            </div>
                            <div className="text-xs text-foreground/60">
                              Qty: {sale.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductPerformanceGrid;
