import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundLayers from "@/components/BackgroundLayers";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import OrderHistory from "@/components/dashboard/OrderHistory";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import WishlistView from "@/components/dashboard/WishlistView";
import PaymentMethods from "@/components/dashboard/PaymentMethods";
import { cn } from "@/lib/utils";
import { Package, User, Heart, CreditCard, LayoutDashboard } from "lucide-react";

type DashboardTab = 'overview' | 'orders' | 'profile' | 'wishlist' | 'payment';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial tab from URL or default to overview
  const initialTab = (searchParams.get('tab') as DashboardTab) || 'overview';
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Update URL when tab changes
  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-lg font-sans font-bold text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <BackgroundLayers />
      <div className="relative z-[200] flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-5 md:px-20 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-4">
            <span className="mono-label mb-4 block">Account</span>
            <h1 className="text-5xl md:text-7xl font-extrabold uppercase mb-4 font-sans tracking-tight text-white animate-fade-in">
              My Dashboard
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-serif animate-fade-in-delay-1">
              Manage your orders, profile, and wishlist
            </p>
          </div>
          <div className="section-divider-lime" />

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 mb-8 md:mb-12">
            <button
              onClick={() => handleTabChange('overview')}
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2",
                activeTab === 'overview'
                  ? "bg-[#e64a19] text-white border-2 border-[#e64a19]"
                  : "bg-transparent text-white border-2 border-[#262626] hover:border-[#ccff00]/50"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </button>

            <button
              onClick={() => handleTabChange('orders')}
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2",
                activeTab === 'orders'
                  ? "bg-[#e64a19] text-white border-2 border-[#e64a19]"
                  : "bg-transparent text-white border-2 border-[#262626] hover:border-[#ccff00]/50"
              )}
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </button>

            <button
              onClick={() => handleTabChange('profile')}
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2",
                activeTab === 'profile'
                  ? "bg-[#e64a19] text-white border-2 border-[#e64a19]"
                  : "bg-transparent text-white border-2 border-[#262626] hover:border-[#ccff00]/50"
              )}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            <button
              onClick={() => handleTabChange('wishlist')}
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2",
                activeTab === 'wishlist'
                  ? "bg-[#e64a19] text-white border-2 border-[#e64a19]"
                  : "bg-transparent text-white border-2 border-[#262626] hover:border-[#ccff00]/50"
              )}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </button>

            <button
              onClick={() => handleTabChange('payment')}
              className={cn(
                "px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2",
                activeTab === 'payment'
                  ? "bg-[#e64a19] text-white border-2 border-[#e64a19]"
                  : "bg-transparent text-white border-2 border-[#262626] hover:border-[#ccff00]/50"
              )}
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payment</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && <DashboardOverview />}
            {activeTab === 'orders' && <OrderHistory />}
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'wishlist' && <WishlistView />}
            {activeTab === 'payment' && <PaymentMethods />}
          </div>
        </div>
      </main>

      <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
