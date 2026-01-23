import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import Button from "./Button";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const fallbackImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <Link to={`/product/${product.slug}`} className="block group">
      <article className="bg-[#0a0a0a] border border-[#262626] rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-[#404040]">
        {/* Image */}
        <div className="aspect-square overflow-hidden relative bg-[#0a0a0a]">
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-[#e64a19] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
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
          <img
            src={product.image_url || fallbackImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
          />
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 flex flex-col flex-1">
          {product.category && (
            <span className="text-xs font-bold uppercase text-[#ccff00] mb-2 font-sans tracking-wider">
              {product.category.name}
            </span>
          )}
          <h2 className="text-xl md:text-2xl leading-tight mb-3 font-sans font-extrabold tracking-tight text-white group-hover:text-[#e64a19] transition-colors">
            {product.name}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground mb-4 flex-1 line-clamp-2 font-serif">
            {product.short_description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-extrabold font-sans text-[#e64a19]">${product.price}</span>
            {product.original_price && (
              <span className="text-lg text-muted-foreground line-through font-sans">
                ${product.original_price}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="filled" className="text-xs py-2 px-5 flex-1">
              VIEW PRODUCT
            </Button>
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="p-3 rounded-full bg-[#333] hover:bg-[#e64a19] text-white transition-colors border border-[#444]"
                aria-label="Quick view"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
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
