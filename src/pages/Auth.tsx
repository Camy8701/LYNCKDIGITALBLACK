import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/Button";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate("/admin");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created successfully!');
          navigate("/admin");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="bg-vibrant-purple rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase text-center mb-2 font-sans tracking-tighter">
            {isLogin ? "SIGN IN" : "SIGN UP"}
          </h1>
          <p className="text-center text-foreground/70 mb-8 font-serif">
            {isLogin ? "Access your admin dashboard" : "Create your admin account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold uppercase mb-2 font-sans">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-transparent text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold uppercase mb-2 font-sans">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-foreground bg-transparent text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="filled"
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? "LOADING..." : isLogin ? "SIGN IN" : "SIGN UP"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-sans underline hover:opacity-70 transition-opacity"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm font-sans font-bold uppercase tracking-tight hover:opacity-70 transition-opacity"
          >
            ← BACK TO SHOP
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
