import { cn } from "@/lib/utils";

const ProductCardSkeleton = () => {
  return (
    <article className="rounded-3xl overflow-hidden flex flex-col h-full bg-foreground/5 animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square overflow-hidden p-4 md:p-5">
        <div className="relative w-full h-full rounded-2xl bg-foreground/10" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        {/* Category */}
        <div className="h-3 w-16 bg-foreground/10 rounded mb-2" />
        
        {/* Title */}
        <div className="h-8 w-3/4 bg-foreground/10 rounded mb-3" />
        
        {/* Description */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="h-4 w-full bg-foreground/10 rounded" />
          <div className="h-4 w-2/3 bg-foreground/10 rounded" />
        </div>
        
        {/* Price */}
        <div className="h-7 w-20 bg-foreground/10 rounded mb-4" />
        
        {/* Buttons */}
        <div className="flex items-center gap-2">
          <div className="h-10 flex-1 bg-foreground/10 rounded-full" />
          <div className="h-10 w-10 bg-foreground/10 rounded-full" />
        </div>
      </div>
    </article>
  );
};

export default ProductCardSkeleton;
