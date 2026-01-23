import { Link } from "react-router-dom";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/Button";
import AddToCartButton from "@/components/AddToCartButton";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const WishlistView = () => {
  const { data: wishlistItems = [], isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { addItem } = useCart();

  const handleRemove = async (productId: string) => {
    await removeFromWishlist.mutateAsync(productId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-foreground"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="data-panel text-center py-12">
        <Heart className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
        <h3 className="text-2xl md:text-3xl font-extrabold uppercase mb-4 font-sans text-white">
          Your wishlist is empty
        </h3>
        <p className="text-base md:text-lg text-muted-foreground mb-8 font-serif max-w-md mx-auto">
          Start adding products you love to your wishlist and easily track them here!
        </p>
        <Link to="/">
          <Button variant="filled" className="text-base py-4 px-8">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <span className="section-label">Saved</span>
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase font-sans text-white mt-4">
          My Wishlist <span className="text-[#ccff00]">({wishlistItems.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => {
          const product = item.product;
          if (!product) return null;

          const discount = product.original_price
            ? Math.round((1 - product.price / product.original_price) * 100)
            : 0;

          return (
            <article
              key={item.id}
              className="stat-card overflow-hidden flex flex-col h-full relative"
            >
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(product.id)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#0a0a0a]/90 hover:bg-red-500 text-white flex items-center justify-center transition-colors border border-[#333]"
                aria-label="Remove from wishlist"
                disabled={removeFromWishlist.isPending}
              >
                {removeFromWishlist.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>

              {/* Image */}
              <Link to={`/product/${product.slug}`} className="block -m-6 mb-0">
                <div className="aspect-square overflow-hidden relative">
                  {discount > 0 && (
                    <span className="absolute top-4 left-4 bg-[#e64a19] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      SALE
                    </span>
                  )}
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="pt-6 flex flex-col flex-1">
                {product.category && (
                  <span className="text-xs font-bold uppercase text-[#ccff00] mb-2 font-sans tracking-wider">
                    {product.category.name}
                  </span>
                )}
                <Link to={`/product/${product.slug}`}>
                  <h3 className="text-xl md:text-2xl leading-tight mb-3 font-sans font-extrabold tracking-tighter text-white hover:text-[#e64a19] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm leading-relaxed text-muted-foreground mb-4 flex-1 line-clamp-2 font-serif">
                  {product.short_description}
                </p>

                {/* Wishlist Notes */}
                {item.notes && (
                  <div className="mb-4 p-3 bg-[#0a0a0a]/50 border border-[#222] rounded-xl">
                    <p className="text-xs font-serif italic text-muted-foreground">
                      Note: {item.notes}
                    </p>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-extrabold font-sans text-[#e64a19]">${product.price}</span>
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through font-sans">
                      ${product.original_price}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <AddToCartButton
                    product={product}
                    variant="filled"
                    className="text-xs py-2 px-5 flex-1"
                  />
                  <Link to={`/product/${product.slug}`} className="flex-1">
                    <Button variant="transparent" className="w-full text-xs py-2 px-5">
                      VIEW
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistView;
