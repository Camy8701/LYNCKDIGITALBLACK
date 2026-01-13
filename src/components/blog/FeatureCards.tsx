import { cn } from "@/lib/utils";
import { LucideIcon, Zap, TrendingUp, Shield, DollarSign, Clock, Target, Bot, Layers, BarChart3 } from "lucide-react";

interface FeatureCard {
  icon?: string;
  title: string;
  description: string;
  highlight?: string;
}

interface FeatureCardsProps {
  cards: FeatureCard[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  trending: TrendingUp,
  shield: Shield,
  dollar: DollarSign,
  clock: Clock,
  target: Target,
  bot: Bot,
  layers: Layers,
  chart: BarChart3,
};

export function FeatureCards({ cards, columns = 3, className }: FeatureCardsProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn(`grid gap-4 my-8 ${gridCols[columns]}`, className)}>
      {cards.map((card, index) => {
        const IconComponent = card.icon ? iconMap[card.icon] || Zap : Zap;
        
        return (
          <div 
            key={index}
            className="group bg-gradient-to-br from-card to-card/50 rounded-xl p-6 border border-border hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-bold text-foreground mb-2">{card.title}</h4>
            <p className="text-foreground/70 text-sm leading-relaxed">{card.description}</p>
            {card.highlight && (
              <span className="inline-block mt-3 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                {card.highlight}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
