import { ShoppingCart } from "lucide-react";
import { useState } from "react";

const CartButton = () => {
  const [itemCount] = useState(0); // Will be connected to cart state later

  return (
    <button
      className="relative p-2 hover:bg-foreground/10 rounded-full transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent-red text-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;
