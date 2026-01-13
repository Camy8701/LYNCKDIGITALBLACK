import { cn } from "@/lib/utils";

interface Step {
  number: string;
  title: string;
  description: string;
}

interface NumberedStepsProps {
  steps: Step[];
  className?: string;
}

export function NumberedSteps({ steps, className }: NumberedStepsProps) {
  return (
    <div className={cn("space-y-6 my-8", className)}>
      {steps.map((step, index) => (
        <div 
          key={index} 
          className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <span className="text-4xl font-bold text-primary/30">{step.number}</span>
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full mt-1" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-foreground mb-2">{step.title}</h4>
              <p className="text-foreground/70 leading-relaxed">{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
