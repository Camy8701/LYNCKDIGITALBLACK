import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { Product } from "@/types/product";

interface FeaturedProductProps {
  product: Product;
}

const FeaturedProduct = ({ product }: FeaturedProductProps) => {
  const colorClass = product.category?.color_class || "bg-vibrant-purple";
  const discount = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="block">
      <article
        className={cn("card-hover rounded-3xl overflow-hidden", colorClass)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Text Content - Left */}
          <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
            {product.category && (
              <span className="text-xs font-bold uppercase text-foreground/70 mb-3 font-sans tracking-wider">
                {product.category.name}
              </span>
            )}
            <h2 className="text-4xl leading-[0.9] md:text-6xl mb-4 font-sans font-extrabold tracking-tighter">
              {product.name}
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 mb-4 font-serif">
              {product.short_description}
            </p>
            
            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-extrabold font-sans">${product.price}</span>
              {product.original_price && (
                <>
                  <span className="text-xl text-foreground/50 line-through font-sans">
                    ${product.original_price}
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
                src={product.image_url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 grayscale"
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
  );
};

export default FeaturedProduct;
