import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, CartItem, CartStorage } from '@/types/product';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'lynck-cart';
const CART_VERSION = 1;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const cart: CartStorage = JSON.parse(stored);
        setItems(cart.items || []);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    try {
      const cart: CartStorage = {
        items,
        lastUpdated: new Date().toISOString(),
        version: CART_VERSION
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart:', error);
      toast.error('Cart could not be saved');
    }
  }, [items]);

  // Derived state (memoized for performance)
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [items]
  );

  // Add item (optimistic update)
  const addItem = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);

      if (existingItem) {
        // Update quantity
        toast.info(`Updated ${product.name} quantity`, {
          description: `New quantity: ${existingItem.quantity + quantity}`
        });
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        toast.success(`${product.name} added to cart`, {
          description: `Quantity: ${quantity}`,
          duration: 2000
        });
        const newItem: CartItem = {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          originalPrice: product.original_price,
          imageUrl: product.image_url,
          categoryName: product.category?.name || null,
          quantity,
          addedAt: new Date().toISOString()
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => {
      const item = prevItems.find(i => i.productId === productId);
      if (item) {
        toast.success(`${item.name} removed from cart`);
      }
      return prevItems.filter(item => item.productId !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const getItem = (productId: string) => {
    return items.find(item => item.productId === productId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
