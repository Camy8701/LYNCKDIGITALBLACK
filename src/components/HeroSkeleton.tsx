const HeroSkeleton = () => {
  return (
    <div className="relative bg-foreground/5 animate-pulse">
      <div className="px-5 md:px-20 py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1">
              {/* Category Badge */}
              <div className="h-6 w-24 bg-foreground/10 rounded-full mb-4" />
              
              {/* Title */}
              <div className="space-y-3 mb-6">
                <div className="h-12 w-3/4 bg-foreground/10 rounded" />
                <div className="h-12 w-1/2 bg-foreground/10 rounded" />
              </div>
              
              {/* Description */}
              <div className="space-y-2 mb-8">
                <div className="h-4 w-full bg-foreground/10 rounded" />
                <div className="h-4 w-2/3 bg-foreground/10 rounded" />
              </div>
              
              {/* Price & Button */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-32 bg-foreground/10 rounded-full" />
                <div className="h-8 w-20 bg-foreground/10 rounded" />
              </div>
            </div>

            {/* Right: Image */}
            <div className="order-1 lg:order-2">
              <div className="aspect-square rounded-3xl bg-foreground/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-foreground/20" />
        ))}
      </div>
    </div>
  );
};

export default HeroSkeleton;
