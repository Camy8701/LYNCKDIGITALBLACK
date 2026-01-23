const HeroCarousel = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0a0a0a] border border-[#262626]">
      <iframe
        src="https://player.flipsnack.com?hash=QjlGQzg1OUJEQzkrZGtzN2xhMDk1ZQ=="
        width="100%"
        height="750"
        seamless={true}
        scrolling="no"
        frameBorder={0}
        allowFullScreen
        allow="autoplay; clipboard-read; clipboard-write"
        className="w-full"
        title="LYNCK Digital Catalog"
      />
    </div>
  );
};

export default HeroCarousel;
