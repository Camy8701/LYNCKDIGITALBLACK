import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, Lock, CheckCircle, Loader2 } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Check for successful payment
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  if (sessionId && orderId) {
    // Payment was successful
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 px-5 md:px-20 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="stat-card-lime">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-20 h-20 text-[#ccff00]" />
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-6 font-sans tracking-tight text-white">
                Payment Successful!
              </h1>

              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-8 font-serif max-w-2xl mx-auto">
                Thank you for your purchase! Your order has been confirmed and your digital products are ready for download.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard?tab=orders">
                  <Button variant="filled" className="text-base py-4 px-8">
                    View My Orders
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="transparent" className="text-base py-4 px-8">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      navigate("/auth");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: items.map(item => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
          success_url: `${window.location.origin}/checkout`,
          cancel_url: `${window.location.origin}/cart`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Clear cart before redirecting to Stripe
        clearCart();
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
      console.error("Checkout error:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 px-5 md:px-20 py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="stat-card">
              <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-6 font-sans tracking-tight text-white">
                Your Cart is Empty
              </h1>
              <p className="text-lg text-muted-foreground mb-8 font-serif">
                Add some products to your cart before checking out.
              </p>
              <Link to="/">
                <Button variant="filled" className="text-base py-4 px-8">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-0 font-sans tracking-tight text-center text-white animate-fade-in">
            Checkout
          </h1>
          <div className="section-divider-lime" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="stat-card">
              <h2 className="text-xl font-bold uppercase mb-6 font-sans">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold font-sans">{item.name}</h3>
                      <p className="text-sm text-foreground/60">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold font-sans">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-foreground/10 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="font-sans uppercase">Total</span>
                  <span className="font-sans">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="stat-card-lime">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6" />
                <h2 className="text-xl font-bold uppercase font-sans">
                  Secure Payment
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-foreground/80">
                  <Lock className="w-5 h-5" />
                  <span className="font-serif">256-bit SSL encryption</span>
                </div>
                <p className="text-foreground/80 font-serif">
                  You'll be redirected to Stripe's secure checkout to complete your payment.
                </p>
              </div>

              {!user ? (
                <div className="space-y-4">
                  <p className="text-foreground/80 font-serif text-center">
                    Please sign in to complete your purchase
                  </p>
                  <Link to="/auth" className="block">
                    <Button variant="filled" className="w-full text-base py-4">
                      Sign In to Checkout
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  variant="filled"
                  className="w-full text-base py-4 flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay ${subtotal.toFixed(2)}
                    </>
                  )}
                </Button>
              )}

              <p className="text-xs text-foreground/60 text-center mt-4 font-serif">
                By completing your purchase, you agree to our Terms of Service
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/cart" className="text-foreground/60 hover:text-foreground font-serif underline">
              ← Back to Cart
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
