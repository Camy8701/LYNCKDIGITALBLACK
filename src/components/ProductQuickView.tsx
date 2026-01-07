import { X, ShoppingCart, FileText, BookOpen, HardDrive } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Button from "./Button";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";
import { Product } from "@/types/product";
import { Link } from "react-router-dom";

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductQuickView = ({ product, open, onOpenChange }: ProductQuickViewProps) => {
  if (!product) return null;

  const colorClass = product.card_color || product.category?.color_class || "bg-vibrant-purple";
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const fallbackImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-0 bg-transparent">
        <div className={cn("rounded-3xl overflow-hidden", colorClass)}>
          <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-background/80 backdrop-blur-sm p-2 hover:bg-background transition-colors">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="aspect-square p-6 relative">
              {discount > 0 && (
                <span className="absolute top-8 left-8 bg-accent-red text-foreground text-xs font-bold px-3 py-1 rounded-full z-10">
                  {discount}% OFF
                </span>
              )}
              <WishlistButton
                productId={product.id}
                className="absolute top-6 right-6 z-20"
              />
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <img
                  src={product.image_url || fallbackImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = fallbackImage; }}
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              {product.category && (
                <span className="text-xs font-bold uppercase text-foreground/70 mb-2 font-sans tracking-wider">
                  {product.category.name}
                </span>
              )}
              
              <h2 className="text-3xl md:text-4xl leading-[0.95] mb-4 font-sans font-extrabold tracking-tighter">
                {product.name}
              </h2>
              
              <p className="text-sm md:text-base leading-relaxed text-foreground/80 mb-6 font-serif">
                {product.short_description || product.description}
              </p>

              {/* Product Stats */}
              {(product.page_count || product.word_count || product.file_size) && (
                <div className="flex flex-wrap gap-4 mb-6">
                  {product.page_count && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>{product.page_count} pages</span>
                    </div>
                  )}
                  {product.word_count && (
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4" />
                      <span>{product.word_count.toLocaleString()} words</span>
                    </div>
                  )}
                  {product.file_size && (
                    <div className="flex items-center gap-2 text-sm">
                      <HardDrive className="w-4 h-4" />
                      <span>{product.file_size}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-extrabold font-sans">${product.price}</span>
                {product.original_price && (
                  <span className="text-xl text-foreground/50 line-through font-sans">
                    ${product.original_price}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <AddToCartButton
                  product={product}
                  variant="filled"
                  className="w-full justify-center"
                />
                <Link to={`/product/${product.slug}`} onClick={() => onOpenChange(false)}>
                  <Button variant="transparent" className="w-full text-xs">
                    VIEW FULL DETAILS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
