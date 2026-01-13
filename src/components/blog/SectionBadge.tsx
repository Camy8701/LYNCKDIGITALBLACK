import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  label: string;
  variant?: 'foundation' | 'automation' | 'strategy' | 'action' | 'default';
  className?: string;
}

const variantStyles = {
  foundation: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  automation: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
  strategy: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
  action: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
  default: 'bg-primary/20 text-primary border-primary/30',
};

export function SectionBadge({ label, variant = 'default', className }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
