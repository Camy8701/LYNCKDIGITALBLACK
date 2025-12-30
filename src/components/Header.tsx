import { Link } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-foreground/5">
      <div className="px-5 md:px-20 py-5 md:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-serif text-2xl md:text-3xl font-bold italic">
            Digital Hub
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {user && isAdmin && (
              <Link to="/admin">
                <Button variant="transparent" showArrow={false} className="text-xs py-2 px-5">
                  DASHBOARD
                </Button>
              </Link>
            )}
            {!user && (
              <Link to="/auth">
                <Button variant="filled" showArrow={false} className="text-xs py-2 px-5">
                  SIGN IN
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
