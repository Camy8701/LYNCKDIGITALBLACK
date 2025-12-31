import Button from "@/components/Button";
import { CreditCard, Plus, AlertCircle } from "lucide-react";

const PaymentMethods = () => {
  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="bg-vibrant-yellow rounded-3xl p-6 md:p-8 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-foreground/80 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-extrabold uppercase mb-2 font-sans">
            Coming Soon: Stripe Integration
          </h3>
          <p className="text-base font-serif text-foreground/80 leading-relaxed">
            We're currently integrating Stripe payment processing to enable saved payment methods.
            Soon you'll be able to securely save your payment information for faster checkout!
          </p>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="bg-vibrant-lavender rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase font-sans">
            Saved Payment Methods
          </h2>
          <Button
            variant="filled"
            className="text-sm py-2 px-4 flex items-center gap-2 opacity-50 cursor-not-allowed"
            disabled
          >
            <Plus className="w-4 h-4" />
            Add Payment Method
          </Button>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <CreditCard className="w-20 h-20 text-foreground/20 mx-auto mb-6" />
          <h3 className="text-xl md:text-2xl font-extrabold uppercase mb-3 font-sans">
            No Payment Methods
          </h3>
          <p className="text-base text-foreground/60 font-serif max-w-md mx-auto">
            Payment methods will appear here once Stripe integration is complete.
          </p>
        </div>
      </div>

      {/* Features Preview */}
      <div className="bg-vibrant-mint rounded-3xl p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-extrabold uppercase mb-6 font-sans">
          Upcoming Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-foreground rounded-full mt-2"></div>
            <div>
              <h4 className="font-bold font-sans text-sm mb-1">Secure Storage</h4>
              <p className="text-sm text-foreground/70 font-serif">
                Credit card details stored securely with Stripe
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-foreground rounded-full mt-2"></div>
            <div>
              <h4 className="font-bold font-sans text-sm mb-1">Quick Checkout</h4>
              <p className="text-sm text-foreground/70 font-serif">
                One-click purchases with saved payment methods
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-foreground rounded-full mt-2"></div>
            <div>
              <h4 className="font-bold font-sans text-sm mb-1">Multiple Methods</h4>
              <p className="text-sm text-foreground/70 font-serif">
                Save and manage multiple payment methods
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-foreground rounded-full mt-2"></div>
            <div>
              <h4 className="font-bold font-sans text-sm mb-1">Default Selection</h4>
              <p className="text-sm text-foreground/70 font-serif">
                Set a default payment method for convenience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Temporary Checkout Info */}
      <div className="bg-vibrant-coral rounded-3xl p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-extrabold uppercase mb-4 font-sans">
          Current Checkout Process
        </h3>
        <p className="text-base font-serif text-foreground/80 leading-relaxed mb-4">
          For now, checkout will create placeholder orders marked as "completed" so you can test
          the full dashboard experience including order history and downloads.
        </p>
        <p className="text-sm font-serif text-foreground/70">
          Real payment processing will be available once Stripe integration is completed.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;
