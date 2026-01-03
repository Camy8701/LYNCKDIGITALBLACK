const Footer = () => {
  return (
    <footer className="overflow-hidden text-foreground bg-[#ff6b35] border-foreground/10 border-t pt-12">
      {/* Giant Brand Text */}
      <div
        className="text-center w-full mb-10 px-4"
        style={{
          maskImage: 'linear-gradient(180deg, transparent, black 0%, black 55%, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, black 0%, black 55%, transparent)'
        }}
      >
        <h1 className="text-[14vw] leading-[0.7] select-none font-bold text-[#ff8555] tracking-tighter mix-blend-multiply scale-y-110 font-sans">
          LYNCK DIGITAL
        </h1>
      </div>

      {/* Links Grid */}
      <div className="border-t border-foreground/10 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Navigation Links */}
        <div className="p-5 md:p-8 grid grid-cols-2 gap-8 lg:border-r border-foreground/10">
          <div className="flex flex-col gap-4">
            <a
              href="/"
              className="text-[13px] font-medium text-foreground/70 uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Shop
            </a>
            <a
              href="/blog"
              className="text-[13px] font-medium text-foreground/70 uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Blog
            </a>
            <a
              href="/?category=courses-guides"
              className="text-[13px] font-medium text-foreground/70 uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Courses
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:info@lynckstudio.pro"
              className="text-[13px] font-medium text-foreground/70 uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Contact Us
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-foreground/70 uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-foreground/70 uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Twitter/X
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-foreground/70 uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Pinterest
            </a>
          </div>
        </div>

        {/* Right Side: Digital Products Wireframe Illustration */}
        <div className="lg:h-auto lg:border-t-0 flex overflow-hidden digital-products w-full h-32 border-foreground/10 border-t relative items-center justify-center">
          <svg
            viewBox="0 0 400 120"
            className="opacity-50 max-h-[115px] w-[575px] h-[115px]"
            preserveAspectRatio="xMidYMid meet"
            strokeWidth="2"
            style={{ width: '575px', height: '115px' }}
          >
            {/* eBook/Book Icon */}
            <g transform="translate(30, 30)">
              <rect x="0" y="0" width="50" height="70" stroke="white" strokeWidth="1" fill="none" rx="2" />
              <line x1="10" y1="15" x2="40" y2="15" stroke="white" strokeWidth="1" opacity="0.6" />
              <line x1="10" y1="25" x2="40" y2="25" stroke="white" strokeWidth="1" opacity="0.6" />
              <line x1="10" y1="35" x2="35" y2="35" stroke="white" strokeWidth="1" opacity="0.6" />
              <path d="M0 0 L10 5 L10 75 L0 70 Z" stroke="white" strokeWidth="1" fill="none" />
            </g>

            {/* Chatbot Icon */}
            <g transform="translate(100, 20)" className="chatbot-icon">
              <defs>
                <clipPath id="chat-clip">
                  <rect x="5" y="30" width="50" height="40" rx="8" />
                </clipPath>
              </defs>

              {/* Chat bubble */}
              <rect x="5" y="30" width="50" height="40" rx="8" stroke="white" strokeWidth="1" fill="none" />
              <path d="M20 70 L25 80 L30 70" stroke="white" strokeWidth="1" fill="none" />

              {/* Bot face */}
              <circle cx="20" cy="45" r="3" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="40" cy="45" r="3" stroke="white" strokeWidth="1" fill="none" />
              <path d="M20 55 Q30 60 40 55" stroke="white" strokeWidth="1" fill="none" className="bot-smile" />

              {/* Antenna */}
              <line x1="30" y1="30" x2="30" y2="20" stroke="white" strokeWidth="1" />
              <circle cx="30" cy="18" r="3" stroke="white" strokeWidth="1" fill="none" className="antenna-pulse" />
            </g>

            {/* Template/Document Icon */}
            <g transform="translate(180, 25)">
              <path d="M10 0 L50 0 L60 10 L60 75 L10 75 Z" stroke="white" strokeWidth="1" fill="none" />
              <path d="M50 0 L50 10 L60 10" stroke="white" strokeWidth="1" fill="none" />
              <line x1="20" y1="20" x2="50" y2="20" stroke="white" strokeWidth="1" opacity="0.6" />
              <line x1="20" y1="30" x2="50" y2="30" stroke="white" strokeWidth="1" opacity="0.6" />
              <line x1="20" y1="40" x2="45" y2="40" stroke="white" strokeWidth="1" opacity="0.6" />
              <rect x="20" y="50" width="30" height="15" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
            </g>

            {/* Course/Video Player Icon */}
            <g transform="translate(260, 30)">
              <rect x="0" y="10" width="70" height="50" rx="4" stroke="white" strokeWidth="1" fill="none" />
              <polygon points="28,25 28,45 45,35" stroke="white" strokeWidth="1" fill="none" className="play-icon" />
              <rect x="5" y="5" width="60" height="5" rx="2" stroke="white" strokeWidth="1" fill="none" opacity="0.6" />
            </g>

            {/* Download/Cloud Icon */}
            <g transform="translate(350, 35)">
              <path d="M20 20 Q20 10 30 10 Q35 10 37 15 Q45 15 45 25 Q45 35 35 35 L15 35 Q10 35 10 28 Q10 20 20 20"
                    stroke="white" strokeWidth="1" fill="none" />
              <line x1="27" y1="30" x2="27" y2="50" stroke="white" strokeWidth="1" className="download-arrow" />
              <path d="M22 45 L27 50 L32 45" stroke="white" strokeWidth="1" fill="none" className="download-arrow" />
              <line x1="20" y1="55" x2="35" y2="55" stroke="white" strokeWidth="1.5" />
            </g>
          </svg>

          <style>{`
            .digital-products .chatbot-icon .bot-smile,
            .digital-products .chatbot-icon .antenna-pulse,
            .digital-products .play-icon,
            .digital-products .download-arrow {
              transform-box: fill-box;
              transform-origin: center;
            }

            .digital-products svg:hover .antenna-pulse {
              animation: pulse-antenna 1.5s ease-in-out infinite;
            }

            .digital-products svg:hover .bot-smile {
              animation: smile-wave 2s ease-in-out infinite;
            }

            .digital-products svg:hover .play-icon {
              animation: play-pulse 1.5s ease-in-out infinite;
            }

            .digital-products svg:hover .download-arrow {
              animation: download-bounce 1.2s ease-in-out infinite;
            }

            @keyframes pulse-antenna {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.3); opacity: 0.6; }
            }

            @keyframes smile-wave {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-2px); }
            }

            @keyframes play-pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.8; }
            }

            @keyframes download-bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(3px); }
            }
          `}</style>
        </div>

        {/* Copyright Row */}
        <div className="lg:col-span-2 border-t border-foreground/10 px-5 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-foreground/60 font-medium tracking-wide">
          <div>
            © 2026 LYNCK DIGITAL. All rights reserved
          </div>
          <div className="flex gap-8">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of use</a>
            <a href="/cookies" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
