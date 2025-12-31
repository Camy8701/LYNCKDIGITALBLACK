import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 px-5 md:px-20 py-12 md:py-20 flex flex-col items-center justify-center">
          <ShoppingBag className="w-24 h-24 text-foreground/20 mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 font-sans">
            Your cart is empty
          </h1>
          <p className="text-lg text-foreground/60 mb-8 font-serif text-center max-w-md">
            Looks like you haven't added any digital products to your cart yet. Start exploring our collection!
          </p>
          <Link to="/">
            <Button variant="filled" className="text-base py-4 px-8">
              Continue Shopping
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase mb-12 font-sans tracking-tight">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-accent-orange/10 rounded-3xl p-6 md:p-8 flex gap-6"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {item.categoryName && (
                        <span className="text-xs font-bold uppercase text-foreground/60 mb-2 block font-sans tracking-wider">
                          {item.categoryName}
                        </span>
                      )}
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-2xl md:text-3xl font-extrabold mb-2 block hover:text-foreground/70 transition-colors font-sans"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-3">
                        <span className="text-xl md:text-2xl font-extrabold font-sans">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-base text-foreground/50 line-through font-sans">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-bold min-w-[2rem] text-center font-sans">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-foreground/60 hover:text-accent-red transition-colors flex items-center gap-2 text-sm font-bold uppercase"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden md:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-vibrant-lavender rounded-3xl p-6 md:p-8 sticky top-24">
                <h2 className="text-2xl font-extrabold uppercase mb-6 font-sans">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg font-serif">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-bold font-sans">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg text-foreground/60 font-serif">
                    <span>Tax</span>
                    <span className="font-sans">Calculated at checkout</span>
                  </div>
                  <div className="border-t-2 border-foreground/10 pt-4 flex justify-between text-2xl font-extrabold font-sans">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="block mb-4">
                  <Button variant="filled" className="w-full text-base py-4">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link to="/">
                  <Button variant="transparent" className="w-full text-sm py-3">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
