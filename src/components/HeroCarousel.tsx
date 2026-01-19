const HeroCarousel = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <iframe
        src="https://player.flipsnack.com?hash=QjlGQzg1OUJEQzkrenVmZHMwcW04eQ=="
        width="100%"
        height="600"
        seamless
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-read; clipboard-write"
        className="w-full min-h-[400px] md:min-h-[600px] rounded-3xl"
        title="Digital Products Flipbook"
      />
    </div>
  );
};

export default HeroCarousel;
