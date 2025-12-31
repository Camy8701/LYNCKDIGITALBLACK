const Footer = () => {
  const helpLinks = [{ label: "CONTACT", href: "mailto:info@lynckstudio.pro" }];

  const socialLinks = [
    { label: "INSTAGRAM", href: "https://instagram.com" },
    { label: "TWITTER", href: "https://twitter.com" },
    { label: "PINTEREST", href: "https://pinterest.com" },
  ];

  return (
    <footer className="bg-accent-red text-foreground">
      <div className="px-5 md:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-x-12 lg:gap-x-16 items-start">
          {/* Logo Section */}
          <div className="md:col-span-1">
            <div className="font-serif text-3xl md:text-4xl font-bold italic">
              LYNCK DIGITAL
            </div>
            <p className="text-sm mt-3 text-foreground/80 font-serif">
              Premium digital products for creators and entrepreneurs.
            </p>
          </div>

          {/* Connect */}
          <div className="md:col-span-1">
            <h3 className="footer-header">CONNECT</h3>
            <nav className="flex flex-col gap-2">
              {helpLinks.map((link) => (
                <a key={link.label} href={link.href} className="footer-link">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="md:col-span-1">
            <h3 className="footer-header">FOLLOW</h3>
            <nav className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div className="md:col-span-1">
            <h3 className="footer-header">CATEGORIES</h3>
            <nav className="flex flex-col gap-2">
              <a href="/?category=courses-guides" className="footer-link">COURSES</a>
              <a href="/?category=templates" className="footer-link">TEMPLATES</a>
              <a href="/?category=ebooks" className="footer-link">EBOOKS</a>
            </nav>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-foreground/20">
          <p className="text-sm text-center md:text-left uppercase">
            © 2025 LYNCK DIGITAL. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
