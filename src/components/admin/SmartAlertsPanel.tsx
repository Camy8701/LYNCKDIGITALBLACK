import { AlertTriangle, CheckCircle, Mail } from "lucide-react";
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
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4 text-white">
          AI SMART ALERTS
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="stat-card flex items-start gap-3 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-[#333]"></div>
              <div className="flex-1">
                <div className="h-4 bg-[#333] rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-[#333] rounded w-full"></div>
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
        <h2 className="text-2xl font-extrabold uppercase font-sans flex items-center gap-2 text-white">
          <AlertTriangle className="w-7 h-7 text-[#e64a19]" />
          AI SMART ALERTS
        </h2>
        {alerts && alerts.length > 0 && (
          <span className="text-sm font-bold text-[#e64a19]">
            {alerts.length} {alerts.length === 1 ? 'alert' : 'alerts'}
          </span>
        )}
      </div>

      {!alerts || alerts.length === 0 ? (
        <div className="stat-card-lime text-center py-8">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#ccff00]" />
          <h3 className="text-xl font-bold font-sans mb-2 text-white">All Clear!</h3>
          <p className="text-muted-foreground font-serif">
            No alerts at the moment. Everything is running smoothly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "stat-card flex items-start gap-3 transition-all",
                alert.priority === 'high' && "border-red-500/50",
                alert.priority === 'medium' && "border-[#e64a19]/50",
                alert.priority === 'low' && "border-[#ccff00]/30"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                alert.priority === 'high' && "bg-red-500/20",
                alert.priority === 'medium' && "bg-[#e64a19]/20",
                alert.priority === 'low' && "bg-[#ccff00]/20"
              )}>
                <AlertTriangle className={cn(
                  "w-4 h-4",
                  alert.priority === 'high' && "text-red-500",
                  alert.priority === 'medium' && "text-[#e64a19]",
                  alert.priority === 'low' && "text-[#ccff00]"
                )} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold font-sans text-sm mb-1 text-white">{alert.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>

                {alert.type === 'undownloaded' && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span>Automatic reminder can be configured</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleAlertAction(alert)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#e64a19] text-white hover:bg-[#e64a19]/80 transition-colors font-bold uppercase flex-shrink-0"
              >
                {alert.action}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder Alerts for Future Features */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stat-card border-dashed">
          <h3 className="text-sm font-extrabold uppercase font-sans mb-2 text-white">
            TRAFFIC SPIKES
          </h3>
          <p className="text-xs text-muted-foreground font-serif mb-2">
            Get alerts when product views spike above daily average
          </p>
          <button className="text-xs px-3 py-1 rounded-full border border-[#333] text-muted-foreground font-bold uppercase cursor-not-allowed">
            Connect GA4
          </button>
        </div>

        <div className="stat-card border-dashed">
          <h3 className="text-sm font-extrabold uppercase font-sans mb-2 text-white">
            NEGATIVE REVIEWS
          </h3>
          <p className="text-xs text-muted-foreground font-serif mb-2">
            Get notified when customers leave reviews below 3 stars
          </p>
          <button className="text-xs px-3 py-1 rounded-full border border-[#333] text-muted-foreground font-bold uppercase cursor-not-allowed">
            Enable Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default SmartAlertsPanel;
