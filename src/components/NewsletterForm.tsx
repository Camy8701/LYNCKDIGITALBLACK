import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, ArrowRight, Loader2, Check } from "lucide-react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already subscribed!");
          setIsSubscribed(true);
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast.success("Welcome! You're now subscribed.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-primary/10 rounded-3xl p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
          <Check className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold uppercase font-sans mb-3 tracking-tight">
          You're In!
        </h3>
        <p className="text-foreground/70 font-serif max-w-md mx-auto">
          Thanks for subscribing. We'll send you our best tips and insights straight to your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-8 md:p-12 border border-foreground/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl md:text-2xl font-extrabold uppercase font-sans tracking-tight">
          Stay Updated
        </h3>
      </div>
      <p className="text-foreground/70 font-serif mb-6 max-w-lg">
        Get the latest tips, insights, and resources delivered straight to your inbox. No spam, just valuable content.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-5 py-3 bg-background border border-foreground/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-sans"
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background font-bold uppercase text-sm tracking-wider rounded-xl hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Subscribe <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
      <p className="text-xs text-foreground/50 mt-4 font-sans">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterForm;
