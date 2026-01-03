import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Loader2, Send } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const { data: response, error } = await supabase.functions.invoke(
        "send-contact-email",
        {
          body: data,
        }
      );

      if (error) {
        throw error;
      }

      if (!response?.success) {
        throw new Error(response?.error || "Failed to send message");
      }

      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      });
      reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again later or email us directly at info@lynckstudio.pro",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Us - LYNCK DIGITAL"
        description="Get in touch with LYNCK DIGITAL. We're here to help with any questions about our digital products."
        type="website"
        url={window.location.href}
      />
      <Header />

      <main className="px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase mb-4 font-sans tracking-tighter">
            CONTACT US
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 font-serif mb-12">
            Have a question? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card border-2 border-foreground/10 rounded-3xl p-8 md:p-12 space-y-6"
          >
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold uppercase tracking-wider mb-2 font-sans"
              >
                Name *
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl focus:border-primary focus:outline-none font-serif transition-colors"
                placeholder="Your full name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1 font-serif">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold uppercase tracking-wider mb-2 font-sans"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl focus:border-primary focus:outline-none font-serif transition-colors"
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1 font-serif">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-bold uppercase tracking-wider mb-2 font-sans"
              >
                Phone <span className="text-foreground/50">(Optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl focus:border-primary focus:outline-none font-serif transition-colors"
                placeholder="+1 (555) 123-4567"
                disabled={isSubmitting}
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-bold uppercase tracking-wider mb-2 font-sans"
              >
                Message *
              </label>
              <textarea
                id="message"
                {...register("message", {
                  required: "Message is required",
                  minLength: {
                    value: 10,
                    message: "Message must be at least 10 characters",
                  },
                })}
                rows={6}
                className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl focus:border-primary focus:outline-none font-serif resize-none transition-colors"
                placeholder="Tell us how we can help you..."
                disabled={isSubmitting}
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1 font-serif">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ff6b35] hover:bg-[#ff8555] text-white font-bold uppercase tracking-wider py-4 px-8 rounded-full transition-all duration-300 flex items-center justify-center gap-2 font-sans disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>

            <p className="text-xs text-foreground/60 text-center font-serif mt-4">
              By submitting this form, you agree to our privacy policy. We'll
              never share your information.
            </p>
          </form>

          {/* Alternative Contact Methods */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-vibrant-mint rounded-2xl p-6">
              <h3 className="text-lg font-extrabold uppercase mb-2 font-sans">
                Email Us Directly
              </h3>
              <a
                href="mailto:info@lynckstudio.pro"
                className="text-foreground/70 font-serif hover:text-foreground transition-colors"
              >
                info@lynckstudio.pro
              </a>
            </div>

            <div className="bg-vibrant-yellow rounded-2xl p-6">
              <h3 className="text-lg font-extrabold uppercase mb-2 font-sans">
                Response Time
              </h3>
              <p className="text-foreground/70 font-serif">
                We typically respond within 24 hours on business days.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
