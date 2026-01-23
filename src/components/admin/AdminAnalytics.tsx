import RevenueCommandCenter from "./RevenueCommandCenter";
import ProductPerformanceGrid from "./ProductPerformanceGrid";
import SmartAlertsPanel from "./SmartAlertsPanel";
import DownloadTracker from "./DownloadTracker";
import TopCustomersTable from "./TopCustomersTable";
import RecentActivityFeed from "./RecentActivityFeed";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Product } from "@/types/product";

interface AdminAnalyticsProps {
  onEditProduct: (product: Product) => void;
}

const AdminAnalytics = ({ onEditProduct }: AdminAnalyticsProps) => {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['admin-refund-rate'] });
    queryClient.invalidateQueries({ queryKey: ['admin-product-performance'] });
    queryClient.invalidateQueries({ queryKey: ['admin-top-customers'] });
    queryClient.invalidateQueries({ queryKey: ['admin-recent-orders'] });
    queryClient.invalidateQueries({ queryKey: ['admin-undownloaded-purchases'] });
    queryClient.invalidateQueries({ queryKey: ['admin-download-stats'] });
    queryClient.invalidateQueries({ queryKey: ['admin-alerts'] });
    toast.success('Analytics refreshed');
  };

  return (
    <div className="space-y-8">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold uppercase font-sans mb-2 text-white">
            ANALYTICS DASHBOARD
          </h1>
          <p className="text-muted-foreground font-serif">
            Real-time insights into your business performance
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#333] text-white hover:border-[#e64a19] hover:text-[#e64a19] transition-colors font-bold uppercase text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Revenue Command Center */}
      <RevenueCommandCenter />

      {/* Smart Alerts - Priority Section */}
      <SmartAlertsPanel />

      {/* Product Performance */}
      <ProductPerformanceGrid onEditProduct={onEditProduct} />

      {/* Two Column Layout for Download Tracker and Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <DownloadTracker />
        </div>
      </div>

      {/* Top Customers */}
      <TopCustomersTable />

      {/* Recent Activity */}
      <RecentActivityFeed />

      {/* Placeholder Sections for Future Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic & Conversion Funnel */}
        <div className="stat-card">
          <h3 className="text-xl font-extrabold uppercase font-sans mb-3 text-white">
            TRAFFIC & CONVERSION
          </h3>
          <p className="text-sm text-muted-foreground font-serif mb-4">
            Track visitors, conversion rates, and traffic sources
          </p>
          <div className="space-y-2 mb-4">
            <div className="bg-[#0a0a0a]/50 border border-[#222] rounded-xl p-3">
              <div className="text-xs text-muted-foreground uppercase font-bold">Total Visitors</div>
              <div className="text-2xl font-extrabold font-sans text-white">-</div>
            </div>
            <div className="bg-[#0a0a0a]/50 border border-[#222] rounded-xl p-3">
              <div className="text-xs text-muted-foreground uppercase font-bold">Conversion Rate</div>
              <div className="text-2xl font-extrabold font-sans text-white">-</div>
            </div>
          </div>
          <button className="w-full text-sm py-2 px-4 rounded-full border border-[#333] text-muted-foreground font-bold uppercase cursor-not-allowed">
            Connect Google Analytics 4
          </button>
        </div>

        {/* Email & Audience Growth */}
        <div className="stat-card-lime">
          <h3 className="text-xl font-extrabold uppercase font-sans mb-3 text-white">
            EMAIL & AUDIENCE GROWTH
          </h3>
          <p className="text-sm text-muted-foreground font-serif mb-4">
            Monitor newsletter subscribers and email campaign performance
          </p>
          <div className="space-y-2 mb-4">
            <div className="bg-[#0a0a0a]/50 border border-[#222] rounded-xl p-3">
              <div className="text-xs text-muted-foreground uppercase font-bold">Subscribers</div>
              <div className="text-2xl font-extrabold font-sans text-white">0</div>
            </div>
            <div className="bg-[#0a0a0a]/50 border border-[#222] rounded-xl p-3">
              <div className="text-xs text-muted-foreground uppercase font-bold">Open Rate</div>
              <div className="text-2xl font-extrabold font-sans text-white">-</div>
            </div>
          </div>
          <button className="w-full text-sm py-2 px-4 rounded-full border border-[#333] text-muted-foreground font-bold uppercase cursor-not-allowed">
            Connect Email Service
          </button>
        </div>
      </div>

      {/* Support & Quality Monitor Placeholder */}
      <div className="stat-card">
        <h3 className="text-xl font-extrabold uppercase font-sans mb-3 text-white">
          SUPPORT & QUALITY MONITOR
        </h3>
        <p className="text-sm text-muted-foreground font-serif mb-4">
          Track support tickets, response times, and product quality scores
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#0a0a0a]/50 border border-[#222] rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Open Tickets</div>
            <div className="text-3xl font-extrabold font-sans text-white">-</div>
          </div>
          <div className="bg-[#0a0a0a]/50 border border-[#222] rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Avg. Response Time</div>
            <div className="text-3xl font-extrabold font-sans text-white">-</div>
          </div>
          <div className="bg-[#0a0a0a]/50 border border-[#222] rounded-xl p-4">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Quality Score</div>
            <div className="text-3xl font-extrabold font-sans text-white">-</div>
          </div>
        </div>
        <button className="text-sm py-2 px-4 rounded-full border border-[#333] text-muted-foreground font-bold uppercase cursor-not-allowed">
          Enable Ticketing System
        </button>
      </div>

      {/* Footer Note */}
      <div className="text-center py-8 border-t border-[#222]">
        <p className="text-xs text-muted-foreground font-serif">
          Analytics update every 1-5 minutes • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default AdminAnalytics;
