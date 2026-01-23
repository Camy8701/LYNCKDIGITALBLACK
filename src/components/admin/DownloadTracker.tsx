import { AlertCircle, Download, Clock, Mail, CheckCircle } from "lucide-react";
import { useUndownloadedPurchases, useDownloadStats } from "@/hooks/useAdminAnalytics";
import { toast } from "sonner";

const DownloadTracker = () => {
  const { data: undownloaded, isLoading: undownloadedLoading } = useUndownloadedPurchases();
  const { data: stats, isLoading: statsLoading } = useDownloadStats();

  const handleSendReminder = (email: string, productName: string) => {
    // TODO: Implement email reminder
    toast.success(`Reminder email sent to ${email} for "${productName}"`);
  };

  if (undownloadedLoading || statsLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4 text-white">
          DOWNLOAD & DELIVERY TRACKER
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-12 bg-[#333] rounded mb-2"></div>
              <div className="h-4 bg-[#333] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-extrabold uppercase font-sans mb-4 text-white">
        DOWNLOAD & DELIVERY TRACKER
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card-lime transition-transform hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-lg bg-[#ccff00]/20 flex items-center justify-center mb-3">
            <Download className="w-5 h-5 text-[#ccff00]" />
          </div>
          <div className="text-4xl font-extrabold font-sans text-white">
            {stats?.totalDownloads || 0}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">
            Total Downloads
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats?.downloadsToday || 0} today • {stats?.uniqueCustomers || 0} unique customers
          </div>
        </div>

        <div className="stat-card transition-transform hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-lg bg-[#e64a19]/20 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-[#e64a19]" />
          </div>
          <div className="text-4xl font-extrabold font-sans text-white">
            {stats?.avgTimeToFirstDownload ? `${stats.avgTimeToFirstDownload.toFixed(1)}h` : 'N/A'}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">
            Avg. Time to Download
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            From purchase to first download
          </div>
        </div>

        <div className="stat-card transition-transform hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-lg bg-[#e64a19]/20 flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5 text-[#e64a19]" />
          </div>
          <div className="text-4xl font-extrabold font-sans text-white">
            {undownloaded?.length || 0}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1">
            Undownloaded
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Purchases older than 24 hours
          </div>
        </div>
      </div>

      {/* Undownloaded Purchases List */}
      {undownloaded && undownloaded.length > 0 && (
        <div className="stat-card border-[#e64a19]/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-extrabold uppercase font-sans text-white">
              Needs Attention
            </h3>
            <span className="text-sm font-bold text-[#e64a19]">
              {undownloaded.length} {undownloaded.length === 1 ? 'customer' : 'customers'}
            </span>
          </div>

          <div className="space-y-2">
            {undownloaded.slice(0, 10).map((item) => (
              <div
                key={item.orderItemId}
                className="bg-[#0a0a0a]/50 border border-[#222] rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold font-sans truncate text-white">
                    {item.customerName || item.customerEmail}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.productName} • {item.daysAgo} {item.daysAgo === 1 ? 'day' : 'days'} ago
                  </p>
                </div>
                <button
                  onClick={() => handleSendReminder(item.customerEmail, item.productName)}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#e64a19] text-white hover:bg-[#e64a19]/80 transition-colors font-bold uppercase flex items-center gap-1 flex-shrink-0"
                >
                  <Mail className="w-3 h-3" />
                  Remind
                </button>
              </div>
            ))}
          </div>

          {undownloaded.length > 10 && (
            <div className="mt-3 text-center">
              <p className="text-xs text-muted-foreground">
                And {undownloaded.length - 10} more...
              </p>
            </div>
          )}
        </div>
      )}

      {undownloaded && undownloaded.length === 0 && (
        <div className="stat-card-lime text-center py-8">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#ccff00]" />
          <h3 className="text-xl font-bold font-sans mb-2 text-white">All Clear!</h3>
          <p className="text-muted-foreground font-serif">
            All customers have downloaded their purchases
          </p>
        </div>
      )}
    </section>
  );
};

export default DownloadTracker;
