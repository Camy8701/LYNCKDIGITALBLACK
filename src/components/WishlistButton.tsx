import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsInWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const WishlistButton = ({ productId, className, onClick }: WishlistButtonProps) => {
  const { user } = useAuth();
  const { data: isInWishlist = false, isLoading } = useIsInWishlist(productId);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Call parent onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Check if user is logged in
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    // Toggle wishlist
    try {
      if (isInWishlist) {
        await removeFromWishlist.mutateAsync(productId);
      } else {
        await addToWishlist.mutateAsync({ productId });
      }
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Wishlist toggle error:', error);
    }
  };

  const isPending = addToWishlist.isPending || removeFromWishlist.isPending;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isPending}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
        "bg-background/90 hover:bg-background border-2 border-foreground",
        "hover:scale-110 active:scale-95",
        isAnimating && "animate-pulse",
        className
      )}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isPending ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground"></div>
      ) : (
        <Heart
          className={cn(
            "w-5 h-5 transition-all duration-200",
            isInWishlist
              ? "fill-accent-red text-accent-red"
              : "fill-none text-foreground hover:text-accent-red"
          )}
        />
      )}
    </button>
  );
};

export default WishlistButton;
