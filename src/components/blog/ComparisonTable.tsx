import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface ComparisonTableProps {
  isItems: string[];
  isNotItems: string[];
  isTitle?: string;
  isNotTitle?: string;
  className?: string;
}

export function ComparisonTable({ 
  isItems, 
  isNotItems, 
  isTitle = "IS", 
  isNotTitle = "IS NOT",
  className 
}: ComparisonTableProps) {
  return (
    <div className={cn("grid md:grid-cols-2 gap-4 my-8", className)}>
      {/* IS Column */}
      <div className="bg-emerald-500/10 dark:bg-emerald-500/5 rounded-xl p-6 border border-emerald-500/20">
        <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
          <Check className="w-5 h-5" />
          {isTitle}
        </h4>
        <ul className="space-y-3">
          {isItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-foreground/80">
              <Check className="w-4 h-4 mt-1 text-emerald-500 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* IS NOT Column */}
      <div className="bg-red-500/10 dark:bg-red-500/5 rounded-xl p-6 border border-red-500/20">
        <h4 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
          <X className="w-5 h-5" />
          {isNotTitle}
        </h4>
        <ul className="space-y-3">
          {isNotItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-foreground/80">
              <X className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
