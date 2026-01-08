import { Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import Button from "./Button";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Shop", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/about" },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-foreground/5">
      <div className="px-5 md:px-20 py-4 md:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Google Partner Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="shrink-0">
              <img
                src="/assets/logo.png"
                alt="LYNCK DIGITAL"
                className="h-11 md:h-[52px] w-auto"
              />
            </Link>
            <a
              href="https://www.google.com/partners/agency?id=6214402482"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center hover:scale-105 transition-all duration-300"
              aria-label="Google Partner Badge"
              title="Certified Google Partner"
            >
              <img
                src="https://www.gstatic.com/partners/badge/images/2025/PartnerBadgeClickable.svg"
                alt="Google Partner"
                className="h-11 md:h-[52px] w-auto"
                loading="lazy"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-bold uppercase tracking-wider hover:text-foreground/70 transition-all duration-300 hover:scale-105 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-foreground after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className="text-sm font-bold uppercase tracking-wider hover:text-foreground/70 transition-all duration-300 hover:scale-105 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-foreground after:transition-all after:duration-300 hover:after:w-full"
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-bold uppercase tracking-wider hover:text-foreground/70 transition-all duration-300 hover:scale-105 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-foreground after:transition-all after:duration-300 hover:after:w-full"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <SearchBar />
            <CartButton />
            
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground/5 rounded-full">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-medium truncate max-w-[100px]">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 hover:bg-foreground/10 rounded-full transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button variant="filled" showArrow={false} className="text-xs py-2 px-5">
                  SIGN IN
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-foreground/10 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-foreground/10 pt-4 animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold uppercase tracking-wider"
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold uppercase tracking-wider"
                >
                  Admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg font-bold uppercase tracking-wider text-left text-foreground/70"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold uppercase tracking-wider"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
