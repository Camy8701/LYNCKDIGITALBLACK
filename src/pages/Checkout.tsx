import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { CreditCard, Lock } from "lucide-react";

const Checkout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-vibrant-mint rounded-3xl p-8 md:p-12 mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CreditCard className="w-20 h-20 text-foreground" />
                <div className="absolute -top-2 -right-2 bg-vibrant-yellow rounded-full p-2">
                  <Lock className="w-6 h-6" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold uppercase mb-6 font-sans tracking-tight">
              Checkout Coming Soon
            </h1>

            <p className="text-lg md:text-xl leading-relaxed text-foreground/80 mb-8 font-serif max-w-2xl mx-auto">
              We're currently integrating Stripe payment processing to provide you with a secure and seamless checkout experience. Your cart has been saved and will be ready when we launch!
            </p>

            <div className="bg-background/50 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold uppercase mb-4 font-sans">
                What's Coming:
              </h2>
              <ul className="space-y-3 text-left max-w-md mx-auto font-serif text-foreground/80">
                <li className="flex items-start gap-3">
                  <span className="text-accent-orange font-bold">✓</span>
                  <span>Secure payment processing with Stripe</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-orange font-bold">✓</span>
                  <span>Instant digital product delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-orange font-bold">✓</span>
                  <span>Email receipts and download links</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-orange font-bold">✓</span>
                  <span>Guest checkout option</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent-orange font-bold">✓</span>
                  <span>Multiple payment methods</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cart">
                <Button variant="filled" className="text-base py-4 px-8">
                  Back to Cart
                </Button>
              </Link>
              <Link to="/">
                <Button variant="transparent" className="text-base py-4 px-8">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-sm text-foreground/60 font-serif">
            Have questions? <a href="mailto:info@lynckstudio.pro" className="underline hover:text-foreground">Contact us</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
