import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { Product } from "@/types/product";
import { useHeroProducts } from "@/hooks/useHeroProducts";
import { useProducts } from "@/hooks/useProducts";

const HeroCarousel = () => {
  const { data: heroProducts = [] } = useHeroProducts();
  const { data: allProducts = [] } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use hero products if configured, otherwise fall back to featured products
  const displayProducts = heroProducts.length > 0 
    ? heroProducts.map(hp => hp.product)
    : allProducts.filter(p => p.is_featured).slice(0, 3);

  useEffect(() => {
    if (displayProducts.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [displayProducts.length]);

  if (displayProducts.length === 0) {
    return null;
  }

  const currentProduct = displayProducts[currentIndex];
  const colorClass = currentProduct?.category?.color_class || "bg-vibrant-purple";
  const discount = currentProduct?.original_price
    ? Math.round((1 - currentProduct.price / currentProduct.original_price) * 100)
    : 0;

  const fallbackImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Products Container with Animation */}
      <div className="relative">
        <Link to={`/product/${currentProduct?.slug}`} className="block">
          <article
            className={cn(
              "rounded-3xl overflow-hidden transition-all duration-700 ease-in-out",
              colorClass
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Text Content - Left */}
              <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1 animate-fade-in">
                {currentProduct?.category && (
                  <span className="text-xs font-bold uppercase text-foreground/70 mb-3 font-sans tracking-wider">
                    {currentProduct.category.name}
                  </span>
                )}
                <h2 className="text-4xl leading-[0.9] md:text-6xl mb-4 font-sans font-extrabold tracking-tighter">
                  {currentProduct?.name}
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4 font-serif">
                  {currentProduct?.short_description}
                </p>
                
                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-extrabold font-sans">${currentProduct?.price}</span>
                  {currentProduct?.original_price && (
                    <>
                      <span className="text-xl text-foreground/50 line-through font-sans">
                        ${currentProduct.original_price}
                      </span>
                      <span className="bg-accent-red text-foreground text-xs font-bold px-3 py-1 rounded-full">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                
                <Button variant="filled" className="text-sm py-3 px-6 self-start">
                  VIEW PRODUCT
                </Button>
              </div>

              {/* Image - Right */}
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden p-4 md:p-6 order-1 md:order-2">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img
                    key={currentProduct?.id}
                    src={currentProduct?.image_url || fallbackImage}
                    alt={currentProduct?.name}
                    className="w-full h-full object-cover transition-transform duration-500 grayscale animate-scale-in"
                    onError={handleImageError}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 mix-blend-multiply opacity-60",
                      colorClass
                    )}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </article>
        </Link>
      </div>

      {/* Indicators */}
      {displayProducts.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {displayProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-foreground w-8" 
                  : "bg-foreground/30 hover:bg-foreground/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scrolling Ticker */}
      {displayProducts.length > 1 && (
        <div className="mt-6 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...displayProducts, ...displayProducts, ...displayProducts].map((product, index) => (
              <span
                key={`${product.id}-${index}`}
                className="mx-8 text-sm font-bold uppercase tracking-wider text-foreground/40"
              >
                {product.name} • ${product.price}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
