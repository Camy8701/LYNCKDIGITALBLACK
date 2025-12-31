import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import Button from './Button';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'filled' | 'icon';
  quantity?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const AddToCartButton = ({
  product,
  variant = 'filled',
  quantity = 1,
  className,
  onClick
}: AddToCartButtonProps) => {
  const { addItem, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onClick?.(e);

    setIsAdding(true);

    // Simulate async operation (instant in reality)
    setTimeout(() => {
      addItem(product, quantity);
      setIsAdding(false);
      setJustAdded(true);

      // Reset success state after 2s
      setTimeout(() => setJustAdded(false), 2000);
    }, 100);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isAdding}
        className={cn(
          'p-2 rounded-full transition-colors',
          isInCart(product.id)
            ? 'bg-foreground text-background'
            : 'bg-background/20 hover:bg-background/40',
          className
        )}
        aria-label="Add to cart"
      >
        {justAdded ? (
          <Check className="w-5 h-5" />
        ) : (
          <ShoppingCart className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <Button
      variant="filled"
      showArrow={false}
      onClick={handleClick}
      disabled={isAdding}
      className={className}
    >
      {isAdding ? 'ADDING...' : justAdded ? 'ADDED!' : 'ADD TO CART'}
      <ShoppingCart className="w-4 h-4 ml-2" />
    </Button>
  );
};

export default AddToCartButton;
