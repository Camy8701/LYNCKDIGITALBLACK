import { AlertTriangle, CheckCircle, Mail, RefreshCw } from "lucide-react";
import { useAdminAlerts } from "@/hooks/useAdminAnalytics";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SmartAlertsPanel = () => {
  const { data: alerts, isLoading } = useAdminAlerts();

  const handleAlertAction = (alert: any) => {
    switch (alert.type) {
      case 'undownloaded':
        toast.success('Reminder email sent');
        break;
      case 'refund':
        toast.success('Refund request reviewed');
        break;
      default:
        toast.info('Action performed');
    }
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4">
          AI SMART ALERTS
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-4 flex items-start gap-3 animate-pulse"
            >
              <div className="w-6 h-6 rounded-full bg-foreground/10"></div>
              <div className="flex-1">
                <div className="h-4 bg-foreground/10 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-foreground/10 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-extrabold uppercase font-sans flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-vibrant-coral" />
          AI SMART ALERTS
        </h2>
        {alerts && alerts.length > 0 && (
          <span className="text-sm font-bold text-vibrant-coral">
            {alerts.length} {alerts.length === 1 ? 'alert' : 'alerts'}
          </span>
        )}
      </div>

      {!alerts || alerts.length === 0 ? (
        <div className="bg-vibrant-mint rounded-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-700" />
          <h3 className="text-xl font-bold font-sans mb-2">All Clear!</h3>
          <p className="text-foreground/60 font-serif">
            No alerts at the moment. Everything is running smoothly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "rounded-2xl p-4 flex items-start gap-3 transition-all hover:shadow-lg",
                alert.priority === 'high' && "bg-vibrant-coral border-2 border-red-600/30",
                alert.priority === 'medium' && "bg-vibrant-yellow border-2 border-yellow-600/30",
                alert.priority === 'low' && "bg-vibrant-mint border-2 border-green-600/30"
              )}
            >
              <AlertTriangle className={cn(
                "w-6 h-6 flex-shrink-0",
                alert.priority === 'high' && "text-red-700",
                alert.priority === 'medium' && "text-yellow-700",
                alert.priority === 'low' && "text-green-700"
              )} />

              <div className="flex-1 min-w-0">
                <h3 className="font-bold font-sans text-sm mb-1">{alert.title}</h3>
                <p className="text-xs text-foreground/80 mb-2">{alert.message}</p>

                {alert.type === 'undownloaded' && (
                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <Mail className="w-3 h-3" />
                    <span>Automatic reminder can be configured</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleAlertAction(alert)}
                className="text-xs px-3 py-1.5 rounded-full bg-foreground text-background hover:bg-foreground/80 transition-colors font-bold uppercase flex-shrink-0 flex items-center gap-1"
              >
                {alert.action}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder Alerts for Future Features */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-foreground/5 rounded-xl p-4 border-2 border-dashed border-foreground/20">
          <h3 className="text-sm font-extrabold uppercase font-sans mb-2 flex items-center gap-2">
            📊 Traffic Spikes
          </h3>
          <p className="text-xs text-foreground/60 font-serif mb-2">
            Get alerts when product views spike above daily average
          </p>
          <button className="text-xs px-3 py-1 rounded-full border border-foreground/30 text-foreground/50 font-bold uppercase cursor-not-allowed">
            Connect GA4
          </button>
        </div>

        <div className="bg-foreground/5 rounded-xl p-4 border-2 border-dashed border-foreground/20">
          <h3 className="text-sm font-extrabold uppercase font-sans mb-2 flex items-center gap-2">
            ⭐ Negative Reviews
          </h3>
          <p className="text-xs text-foreground/60 font-serif mb-2">
            Get notified when customers leave reviews below 3 stars
          </p>
          <button className="text-xs px-3 py-1 rounded-full border border-foreground/30 text-foreground/50 font-bold uppercase cursor-not-allowed">
            Enable Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default SmartAlertsPanel;
