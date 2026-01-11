import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Star, Zap, Shield, Clock, Users, Headphones, Package, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  phone: z.string().max(20).optional(),
  selected_package: z.string().min(1, "Please select a package"),
  budget: z.string().optional(),
  message: z.string().max(1000).optional(),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

const packages = [
  {
    id: "starter",
    name: "Starter",
    products: 10,
    price: 497,
    description: "Perfect for testing the waters",
    features: [
      "10 premium digital products",
      "Fully automated store",
      "Payment processing setup",
      "Email delivery system",
      "30-day email support",
      "Basic training videos",
    ],
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    products: 20,
    price: 897,
    description: "Most popular choice for serious sellers",
    features: [
      "20 premium digital products",
      "Fully automated store",
      "Payment processing setup",
      "Email delivery system",
      "60-day priority support",
      "Complete training course",
      "Email marketing templates",
      "1 month ad management",
    ],
    popular: true,
  },
  {
    id: "empire",
    name: "Empire",
    products: 30,
    price: 1497,
    description: "For those ready to dominate",
    features: [
      "30+ premium digital products",
      "Fully automated store",
      "Payment processing setup",
      "Advanced email sequences",
      "90-day VIP support",
      "Complete training course",
      "Email marketing templates",
      "3 months ad management",
      "Custom branding",
      "Priority product updates",
    ],
    popular: false,
  },
];

const whatsIncluded = [
  {
    icon: Package,
    title: "Ready-to-Sell Products",
    description: "High-quality digital products with full resell rights, professionally designed and market-tested.",
  },
  {
    icon: Zap,
    title: "Automated Delivery",
    description: "Instant product delivery system that works 24/7, so you can earn while you sleep.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Stripe integration for secure, worldwide payment processing with fraud protection.",
  },
  {
    icon: Clock,
    title: "Quick Setup",
    description: "Your store is ready within 48-72 hours. No technical skills required.",
  },
  {
    icon: Users,
    title: "Training Included",
    description: "Step-by-step video training on how to market and grow your digital business.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Our team is here to help you succeed with responsive support and guidance.",
  },
];

const faqs = [
  {
    question: "How quickly will my store be ready?",
    answer: "Most stores are completed within 48-72 hours after we receive your order. We'll keep you updated throughout the process and notify you as soon as your store is live and ready to start generating income.",
  },
  {
    question: "Do I need any technical skills?",
    answer: "Absolutely not! We handle all the technical setup for you. Your store comes with easy-to-follow training videos that show you exactly how to manage orders, update products, and grow your business.",
  },
  {
    question: "What are the monthly costs?",
    answer: "The only recurring costs are optional: payment processing fees (standard Stripe rates of ~2.9% + €0.30 per transaction) and our optional ad management service (€99/month). The store platform itself has no monthly fees.",
  },
  {
    question: "Can I add my own products later?",
    answer: "Yes! Your store is fully yours to customize. You can add, remove, or modify products at any time. We provide training on how to do this, and our support team is always available to help.",
  },
  {
    question: "What kind of support do I get?",
    answer: "Support duration depends on your package (30-90 days). During this period, you have direct access to our team via email for any questions about your store, marketing strategies, or technical issues.",
  },
  {
    question: "Is this a franchise or do I own the store?",
    answer: "You own your store 100%. It's built on your own domain, your own payment processor, and you keep all the profits. We simply set everything up for you and provide the products to get you started.",
  },
];

export default function Services() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("growth");

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      selected_package: "growth",
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("service_inquiries").insert({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        selected_package: data.selected_package,
        budget: data.budget || null,
        message: data.message?.trim() || null,
      });

      if (error) throw error;

      toast.success("Thank you! We'll be in touch within 24 hours.");
      reset();
      setSelectedPackage("growth");
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setValue("selected_package", packageId);
    // Scroll to form
    document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Done For You Digital Store | Get Your Automated Business"
        description="Get a fully automated digital product store with 10-30+ premium products, payment processing, and email delivery. Start earning passive income within 72 hours."
        url="https://lynckdigital.store/services"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 lg:py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                  Done For You Service
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Your Own Profitable Digital Store{" "}
                  <span className="text-primary">Ready in 72 Hours</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Skip the months of learning and setup. We build your complete automated store, 
                  load it with premium digital products, and hand you the keys to start selling.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })}>
                    View Packages
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" })}>
                    Get Started Now
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* What's Included Section */}
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Everything You Need to Succeed
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  We don't just give you a store – we give you a complete business-in-a-box
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {whatsIncluded.map((item, index) => (
                  <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Package Tiers Section */}
          <section id="packages" className="py-16 lg:py-24 scroll-mt-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Choose Your Package
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Select the package that matches your ambitions. All packages include a fully functional store.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {packages.map((pkg) => (
                  <Card 
                    key={pkg.id} 
                    className={`relative flex flex-col ${
                      pkg.popular 
                        ? "border-primary shadow-lg shadow-primary/20 scale-105" 
                        : "border-border"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          <Star className="h-3.5 w-3.5" />
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold text-foreground">€{pkg.price}</span>
                          <span className="text-muted-foreground">one-time</span>
                        </div>
                        <p className="text-primary font-medium mt-2">
                          {pkg.products} Digital Products
                        </p>
                      </div>
                      <ul className="space-y-3 mb-6 flex-1">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full" 
                        variant={pkg.popular ? "default" : "outline"}
                        onClick={() => handlePackageSelect(pkg.id)}
                      >
                        Select {pkg.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-8">
                Need a custom package? <button onClick={() => document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" })} className="text-primary hover:underline">Contact us</button> for enterprise solutions.
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Got questions? We've got answers.
                </p>
              </div>
              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-colors ${
                      expandedFaq === index ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">{faq.question}</CardTitle>
                        {expandedFaq === index ? (
                          <ChevronUp className="h-5 w-5 text-primary shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    {expandedFaq === index && (
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Lead Capture Form Section */}
          <section id="inquiry-form" className="py-16 lg:py-24 scroll-mt-20">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Fill out the form below and we'll be in touch within 24 hours to discuss your new store.
                  </p>
                </div>
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            {...register("name")}
                            className={errors.name ? "border-destructive" : ""}
                          />
                          {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            {...register("email")}
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          {...register("phone")}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Select Package *</Label>
                        <RadioGroup 
                          value={selectedPackage} 
                          onValueChange={(value) => {
                            setSelectedPackage(value);
                            setValue("selected_package", value);
                          }}
                          className="grid sm:grid-cols-3 gap-3"
                        >
                          {packages.map((pkg) => (
                            <div key={pkg.id}>
                              <RadioGroupItem
                                value={pkg.id}
                                id={pkg.id}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={pkg.id}
                                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                                  selectedPackage === pkg.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <span className="font-semibold">{pkg.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {pkg.products} products
                                </span>
                                <span className="text-primary font-bold mt-1">€{pkg.price}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.selected_package && (
                          <p className="text-sm text-destructive">{errors.selected_package.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budget">Monthly Marketing Budget (Optional)</Label>
                        <Input
                          id="budget"
                          placeholder="e.g., €500-1000/month"
                          {...register("budget")}
                        />
                        <p className="text-xs text-muted-foreground">
                          This helps us recommend the best ad management strategy for you.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Notes (Optional)</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your goals, preferred niche, or any questions you have..."
                          rows={4}
                          {...register("message")}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Request Your Store"}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        By submitting this form, you agree to be contacted about our services. 
                        We respect your privacy and will never share your information.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
