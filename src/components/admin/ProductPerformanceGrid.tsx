import { Edit, BarChart3 } from "lucide-react";
import { useProductPerformance } from "@/hooks/useAdminAnalytics";

const ProductPerformanceGrid = () => {
  const { data: products, isLoading } = useProductPerformance();

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
                  // TODO: Implement edit modal
                  alert('Edit product modal - to be implemented');
                }}
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
              <button
                className="flex-1 text-xs py-2 px-3 rounded-full bg-foreground text-background hover:bg-foreground/80 transition-colors font-bold uppercase flex items-center justify-center gap-1"
                onClick={() => {
                  // TODO: Implement view sales
                  alert(`View sales for ${product.name} - to be implemented`);
                }}
              >
                <BarChart3 className="w-3 h-3" />
                Sales
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductPerformanceGrid;
