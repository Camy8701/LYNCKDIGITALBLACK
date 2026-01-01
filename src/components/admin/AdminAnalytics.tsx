import RevenueCommandCenter from "./RevenueCommandCenter";
import ProductPerformanceGrid from "./ProductPerformanceGrid";
import SmartAlertsPanel from "./SmartAlertsPanel";
import DownloadTracker from "./DownloadTracker";
import TopCustomersTable from "./TopCustomersTable";
import RecentActivityFeed from "./RecentActivityFeed";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const AdminAnalytics = () => {
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
          <h1 className="text-4xl font-extrabold uppercase font-sans mb-2">
            ANALYTICS DASHBOARD
          </h1>
          <p className="text-foreground/60 font-serif">
            Real-time insights into your business performance
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground hover:bg-foreground hover:text-background transition-colors font-bold uppercase text-sm"
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
      <ProductPerformanceGrid />

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
        <div className="bg-vibrant-purple/20 rounded-3xl p-6 border-2 border-vibrant-purple/30">
          <h3 className="text-xl font-extrabold uppercase font-sans mb-3">
            📈 TRAFFIC & CONVERSION
          </h3>
          <p className="text-sm text-foreground/70 font-serif mb-4">
            Track visitors, conversion rates, and traffic sources
          </p>
          <div className="space-y-2 mb-4">
            <div className="bg-background/30 rounded-xl p-3">
              <div className="text-xs text-foreground/60 uppercase font-bold">Total Visitors</div>
              <div className="text-2xl font-extrabold font-sans">-</div>
            </div>
            <div className="bg-background/30 rounded-xl p-3">
              <div className="text-xs text-foreground/60 uppercase font-bold">Conversion Rate</div>
              <div className="text-2xl font-extrabold font-sans">-</div>
            </div>
          </div>
          <button className="w-full text-sm py-2 px-4 rounded-full border-2 border-foreground/30 text-foreground/50 font-bold uppercase cursor-not-allowed">
            Connect Google Analytics 4
          </button>
        </div>

        {/* Email & Audience Growth */}
        <div className="bg-vibrant-mint/20 rounded-3xl p-6 border-2 border-vibrant-mint/30">
          <h3 className="text-xl font-extrabold uppercase font-sans mb-3">
            📧 EMAIL & AUDIENCE GROWTH
          </h3>
          <p className="text-sm text-foreground/70 font-serif mb-4">
            Monitor newsletter subscribers and email campaign performance
          </p>
          <div className="space-y-2 mb-4">
            <div className="bg-background/30 rounded-xl p-3">
              <div className="text-xs text-foreground/60 uppercase font-bold">Subscribers</div>
              <div className="text-2xl font-extrabold font-sans">0</div>
            </div>
            <div className="bg-background/30 rounded-xl p-3">
              <div className="text-xs text-foreground/60 uppercase font-bold">Open Rate</div>
              <div className="text-2xl font-extrabold font-sans">-</div>
            </div>
          </div>
          <button className="w-full text-sm py-2 px-4 rounded-full border-2 border-foreground/30 text-foreground/50 font-bold uppercase cursor-not-allowed">
            Connect Email Service
          </button>
        </div>
      </div>

      {/* Support & Quality Monitor Placeholder */}
      <div className="bg-vibrant-coral/20 rounded-3xl p-6 border-2 border-vibrant-coral/30">
        <h3 className="text-xl font-extrabold uppercase font-sans mb-3">
          💬 SUPPORT & QUALITY MONITOR
        </h3>
        <p className="text-sm text-foreground/70 font-serif mb-4">
          Track support tickets, response times, and product quality scores
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-background/30 rounded-xl p-4">
            <div className="text-xs text-foreground/60 uppercase font-bold mb-1">Open Tickets</div>
            <div className="text-3xl font-extrabold font-sans">-</div>
          </div>
          <div className="bg-background/30 rounded-xl p-4">
            <div className="text-xs text-foreground/60 uppercase font-bold mb-1">Avg. Response Time</div>
            <div className="text-3xl font-extrabold font-sans">-</div>
          </div>
          <div className="bg-background/30 rounded-xl p-4">
            <div className="text-xs text-foreground/60 uppercase font-bold mb-1">Quality Score</div>
            <div className="text-3xl font-extrabold font-sans">-</div>
          </div>
        </div>
        <button className="text-sm py-2 px-4 rounded-full border-2 border-foreground/30 text-foreground/50 font-bold uppercase cursor-not-allowed">
          Enable Ticketing System
        </button>
      </div>

      {/* Footer Note */}
      <div className="text-center py-8 border-t-2 border-foreground/10">
        <p className="text-xs text-foreground/50 font-serif">
          Analytics update every 1-5 minutes • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default AdminAnalytics;
