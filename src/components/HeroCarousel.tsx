import { useState, useEffect, useRef } from 'react';

const HeroCarousel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-3xl min-h-[500px] md:min-h-[700px] lg:min-h-[800px]">
      {isVisible ? (
        <iframe
          src="https://player.flipsnack.com?hash=QjlGQzg1OUJEQzkrenVmZHMwcW04eQ=="
          width="100%"
          height="800"
          seamless
          scrolling="no"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-read; clipboard-write"
          loading="lazy"
          className="w-full min-h-[500px] md:min-h-[700px] lg:min-h-[800px] rounded-3xl"
          title="Digital Products Flipbook"
        />
      ) : (
        <div className="w-full h-full min-h-[500px] md:min-h-[700px] lg:min-h-[800px] bg-muted/50 animate-pulse rounded-3xl flex items-center justify-center">
          <span className="text-muted-foreground">Loading flipbook...</span>
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
