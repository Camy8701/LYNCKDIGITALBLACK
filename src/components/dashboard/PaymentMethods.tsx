import Button from "@/components/Button";
import { CreditCard, Plus, AlertCircle, Zap, Shield, Layers, Star } from "lucide-react";

const PaymentMethods = () => {
  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="stat-card-lime flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#ccff00]/20 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-[#ccff00]" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold uppercase mb-2 font-sans text-white">
            Coming Soon: Stripe Integration
          </h3>
          <p className="text-base font-serif text-muted-foreground leading-relaxed">
            We're currently integrating Stripe payment processing to enable saved payment methods.
            Soon you'll be able to securely save your payment information for faster checkout!
          </p>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold uppercase font-sans text-white">
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
        <div className="text-center py-12 border border-[#222] rounded-xl bg-[#0a0a0a]/50">
          <CreditCard className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl md:text-2xl font-extrabold uppercase mb-3 font-sans text-white">
            No Payment Methods
          </h3>
          <p className="text-base text-muted-foreground font-serif max-w-md mx-auto">
            Payment methods will appear here once Stripe integration is complete.
          </p>
        </div>
      </div>

      {/* Features Preview */}
      <div className="data-panel">
        <span className="section-label">Preview</span>
        <h3 className="text-2xl md:text-3xl font-extrabold uppercase mb-6 font-sans text-white mt-4">
          Upcoming Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 p-4 bg-[#0a0a0a] rounded-xl border border-[#262626]">
            <div className="w-10 h-10 rounded-lg bg-[#e64a19]/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-[#e64a19]" />
            </div>
            <div>
              <h4 className="font-bold font-sans text-sm mb-1 text-white">Secure Storage</h4>
              <p className="text-sm text-muted-foreground font-serif">
                Credit card details stored securely with Stripe
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[#0a0a0a] rounded-xl border border-[#262626]">
            <div className="w-10 h-10 rounded-lg bg-[#ccff00]/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-[#ccff00]" />
            </div>
            <div>
              <h4 className="font-bold font-sans text-sm mb-1 text-white">Quick Checkout</h4>
              <p className="text-sm text-muted-foreground font-serif">
                One-click purchases with saved payment methods
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[#0a0a0a] rounded-xl border border-[#262626]">
            <div className="w-10 h-10 rounded-lg bg-[#e64a19]/20 flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5 text-[#e64a19]" />
            </div>
            <div>
              <h4 className="font-bold font-sans text-sm mb-1 text-white">Multiple Methods</h4>
              <p className="text-sm text-muted-foreground font-serif">
                Save and manage multiple payment methods
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[#0a0a0a] rounded-xl border border-[#262626]">
            <div className="w-10 h-10 rounded-lg bg-[#ccff00]/20 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-[#ccff00]" />
            </div>
            <div>
              <h4 className="font-bold font-sans text-sm mb-1 text-white">Default Selection</h4>
              <p className="text-sm text-muted-foreground font-serif">
                Set a default payment method for convenience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Temporary Checkout Info */}
      <div className="stat-card">
        <h3 className="text-2xl md:text-3xl font-extrabold uppercase mb-4 font-sans text-white">
          Current Checkout Process
        </h3>
        <p className="text-base font-serif text-muted-foreground leading-relaxed mb-4">
          For now, checkout will create placeholder orders marked as "completed" so you can test
          the full dashboard experience including order history and downloads.
        </p>
        <p className="text-sm font-serif text-[#ccff00]">
          Real payment processing will be available once Stripe integration is completed.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;
