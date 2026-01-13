import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant?: 'default' | 'gradient' | 'minimal';
  className?: string;
}

export function CTASection({
  title,
  description,
  primaryButtonText = "Get Started",
  primaryButtonLink = "/products",
  secondaryButtonText,
  secondaryButtonLink,
  variant = 'default',
  className,
}: CTASectionProps) {
  const variants = {
    default: 'bg-card border border-border',
    gradient: 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20',
    minimal: 'bg-transparent',
  };

  return (
    <div className={cn("rounded-2xl p-8 my-12 text-center", variants[variant], className)}>
      <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-foreground/70 max-w-2xl mx-auto mb-6">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="gap-2">
          <Link to={primaryButtonLink}>
            {primaryButtonText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        
        {secondaryButtonText && secondaryButtonLink && (
          <Button asChild variant="outline" size="lg">
            <Link to={secondaryButtonLink}>
              {secondaryButtonText}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
