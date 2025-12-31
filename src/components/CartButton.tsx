import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";

const CartButton = () => {
  const { itemCount } = useCart();

  return (
    <Link
      to="/cart"
      className="relative p-2 hover:bg-foreground/10 rounded-full transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent-red text-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
