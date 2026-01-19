const HeroCarousel = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <iframe
        src="https://player.flipsnack.com?hash=QjlGQzg1OUJEQzkrenVmZHMwcW04eQ=="
        width="100%"
        height="800"
        seamless
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-read; clipboard-write"
        className="w-full min-h-[500px] md:min-h-[700px] lg:min-h-[800px] rounded-3xl"
        title="Digital Products Flipbook"
      />
    </div>
  );
};

export default HeroCarousel;
