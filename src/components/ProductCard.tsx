import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Button from "./Button";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const colorClass = product.category?.color_class || "bg-vibrant-purple";
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const fallbackImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <Link to={`/product/${product.slug}`} className="block">
      <article
        className={cn(
          "card-hover rounded-3xl overflow-hidden flex flex-col h-full",
          colorClass
        )}
      >
        {/* Image */}
        <div className="aspect-square overflow-hidden p-4 md:p-5 relative">
          {discount > 0 && (
            <span className="absolute top-6 left-6 bg-accent-red text-foreground text-xs font-bold px-3 py-1 rounded-full z-10">
              SALE
            </span>
          )}
          <WishlistButton
            productId={product.id}
            className="absolute top-4 right-4 z-20"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <img
              src={product.image_url || fallbackImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500"
              onError={handleImageError}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 flex flex-col flex-1">
          {product.category && (
            <span className="text-xs font-bold uppercase text-foreground/70 mb-2 font-sans tracking-wider">
              {product.category.name}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl leading-[0.9] mb-3 font-sans font-extrabold tracking-tighter">
            {product.name}
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-foreground/80 mb-4 flex-1 line-clamp-2 font-serif">
            {product.short_description}
          </p>
          
          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-extrabold font-sans">${product.price}</span>
            {product.original_price && (
              <span className="text-lg text-foreground/50 line-through font-sans">
                ${product.original_price}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="filled" className="text-xs py-2 px-5 flex-1">
              VIEW PRODUCT
            </Button>
            <AddToCartButton
              product={product}
              variant="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
