import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone number must be less than 20 characters").optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          message: data.message,
        },
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      reset();
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Us - LYNCK DIGITAL"
        description="Get in touch with LYNCK DIGITAL. We'd love to hear from you about our digital products, courses, and templates."
      />
      <Header />

      <main className="px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12 font-sans">
            Contact
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold uppercase tracking-wider mb-2 font-sans">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-3 bg-transparent border-2 border-foreground rounded-lg font-sans focus:outline-none focus:ring-2 focus:ring-foreground/50 transition-all"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-accent-red">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider mb-2 font-sans">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 bg-transparent border-2 border-foreground rounded-lg font-sans focus:outline-none focus:ring-2 focus:ring-foreground/50 transition-all"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-accent-red">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold uppercase tracking-wider mb-2 font-sans">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className="w-full px-4 py-3 bg-transparent border-2 border-foreground rounded-lg font-sans focus:outline-none focus:ring-2 focus:ring-foreground/50 transition-all"
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-accent-red">{errors.phone.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-bold uppercase tracking-wider mb-2 font-sans">
                Comment *
              </label>
              <textarea
                id="message"
                {...register("message")}
                rows={6}
                className="w-full px-4 py-3 bg-transparent border-2 border-foreground rounded-lg font-sans resize-none focus:outline-none focus:ring-2 focus:ring-foreground/50 transition-all"
                placeholder="Your message..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-accent-red">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#ff8c00] hover:bg-[#ff6b00] text-foreground uppercase font-bold py-4 px-10 rounded-full inline-flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-sans text-lg tracking-wider"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
