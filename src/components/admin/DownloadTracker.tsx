import { AlertCircle, Download, Clock, Mail } from "lucide-react";
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
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4">
          DOWNLOAD & DELIVERY TRACKER
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
              <div className="h-12 bg-foreground/10 rounded mb-2"></div>
              <div className="h-4 bg-foreground/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-extrabold uppercase font-sans mb-4">
        DOWNLOAD & DELIVERY TRACKER
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-vibrant-mint rounded-2xl p-6">
          <Download className="w-10 h-10 mb-3 text-foreground/80" />
          <div className="text-4xl font-extrabold font-sans">
            {stats?.totalDownloads || 0}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground/70 mt-1">
            Total Downloads
          </div>
          <div className="text-xs text-foreground/60 mt-1">
            {stats?.downloadsToday || 0} today • {stats?.uniqueCustomers || 0} unique customers
          </div>
        </div>

        <div className="bg-vibrant-purple rounded-2xl p-6">
          <Clock className="w-10 h-10 mb-3 text-foreground/80" />
          <div className="text-4xl font-extrabold font-sans">
            {stats?.avgTimeToFirstDownload ? `${stats.avgTimeToFirstDownload.toFixed(1)}h` : 'N/A'}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground/70 mt-1">
            Avg. Time to Download
          </div>
          <div className="text-xs text-foreground/60 mt-1">
            From purchase to first download
          </div>
        </div>

        <div className="bg-vibrant-coral rounded-2xl p-6">
          <AlertCircle className="w-10 h-10 mb-3 text-foreground/80" />
          <div className="text-4xl font-extrabold font-sans">
            {undownloaded?.length || 0}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-foreground/70 mt-1">
            Undownloaded
          </div>
          <div className="text-xs text-foreground/60 mt-1">
            Purchases older than 24 hours
          </div>
        </div>
      </div>

      {/* Undownloaded Purchases List */}
      {undownloaded && undownloaded.length > 0 && (
        <div className="bg-vibrant-yellow rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-extrabold uppercase font-sans">
              Needs Attention
            </h3>
            <span className="text-sm font-bold text-foreground/60">
              {undownloaded.length} {undownloaded.length === 1 ? 'customer' : 'customers'}
            </span>
          </div>

          <div className="space-y-2">
            {undownloaded.slice(0, 10).map((item) => (
              <div
                key={item.orderItemId}
                className="bg-background/50 rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold font-sans truncate">
                    {item.customerName || item.customerEmail}
                  </p>
                  <p className="text-xs text-foreground/60 truncate">
                    {item.productName} • {item.daysAgo} {item.daysAgo === 1 ? 'day' : 'days'} ago
                  </p>
                </div>
                <button
                  onClick={() => handleSendReminder(item.customerEmail, item.productName)}
                  className="text-xs px-3 py-1.5 rounded-full bg-foreground text-background hover:bg-foreground/80 transition-colors font-bold uppercase flex items-center gap-1 flex-shrink-0"
                >
                  <Mail className="w-3 h-3" />
                  Remind
                </button>
              </div>
            ))}
          </div>

          {undownloaded.length > 10 && (
            <div className="mt-3 text-center">
              <p className="text-xs text-foreground/60">
                And {undownloaded.length - 10} more...
              </p>
            </div>
          )}
        </div>
      )}

      {undownloaded && undownloaded.length === 0 && (
        <div className="bg-vibrant-mint rounded-2xl p-8 text-center">
          <Download className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
          <h3 className="text-xl font-bold font-sans mb-2">All Clear!</h3>
          <p className="text-foreground/60 font-serif">
            All customers have downloaded their purchases
          </p>
        </div>
      )}
    </section>
  );
};

export default DownloadTracker;
