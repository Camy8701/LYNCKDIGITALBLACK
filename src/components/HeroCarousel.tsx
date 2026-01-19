const HeroCarousel = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <iframe
        src="https://player.flipsnack.com?hash=QjlGQzg1OUJEQzkrenVmZHMwcW04eQ=="
        width="100%"
        seamless
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-read; clipboard-write"
        className="w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[700px] rounded-3xl"
        title="Digital Products Flipbook"
      />
    </div>
  );
};

export default HeroCarousel;
