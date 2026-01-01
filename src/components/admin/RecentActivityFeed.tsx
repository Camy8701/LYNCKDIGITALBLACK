import { ShoppingCart, Clock } from "lucide-react";
import { useRecentOrders } from "@/hooks/useAdminAnalytics";
import { cn } from "@/lib/utils";

const RecentActivityFeed = () => {
  const { data: orders, isLoading } = useRecentOrders(10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-vibrant-mint';
      case 'pending':
      case 'processing':
        return 'bg-vibrant-yellow';
      case 'failed':
      case 'refunded':
        return 'bg-vibrant-coral';
      default:
        return 'bg-vibrant-purple';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4">
          RECENT ACTIVITY FEED
        </h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-3 flex items-center gap-3 animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-foreground/10"></div>
              <div className="flex-1">
                <div className="h-4 bg-foreground/10 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4">
          RECENT ACTIVITY FEED
        </h2>
        <div className="bg-card rounded-2xl p-8 text-center border-2 border-foreground/10">
          <Clock className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
          <h3 className="text-xl font-bold font-sans mb-2">No Recent Activity</h3>
          <p className="text-foreground/60 font-serif">
            Recent transactions will appear here
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-extrabold uppercase font-sans">
          RECENT ACTIVITY FEED
        </h2>
        <span className="text-sm font-bold text-foreground/60">
          Last 10 transactions
        </span>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-card rounded-xl p-3 flex items-center gap-3 hover:bg-foreground/5 transition-colors border border-foreground/10"
          >
            {/* Icon */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              getStatusColor(order.status)
            )}>
              <ShoppingCart className="w-5 h-5 text-foreground" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold font-sans truncate">
                {order.customerName || order.customerEmail}
              </p>
              <p className="text-xs text-foreground/60">
                {order.orderNumber} • {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} • ${order.total.toFixed(2)}
              </p>
            </div>

            {/* Status & Time */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-bold uppercase",
                order.status === 'completed' && "bg-vibrant-mint/30 text-green-800",
                order.status === 'pending' && "bg-vibrant-yellow/30 text-yellow-800",
                order.status === 'processing' && "bg-vibrant-purple/30 text-purple-800",
                (order.status === 'failed' || order.status === 'refunded') && "bg-vibrant-coral/30 text-red-800"
              )}>
                {getStatusText(order.status)}
              </span>
              <span className="text-xs text-foreground/50">
                {formatTimeAgo(order.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder sections for future features */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-vibrant-yellow/20 rounded-xl p-4 border-2 border-vibrant-yellow/30">
          <h3 className="text-sm font-extrabold uppercase font-sans mb-2 flex items-center gap-2">
            📝 Reviews
          </h3>
          <p className="text-xs text-foreground/60 font-serif">
            Customer reviews will appear here when review system is implemented
          </p>
        </div>
        <div className="bg-vibrant-purple/20 rounded-xl p-4 border-2 border-vibrant-purple/30">
          <h3 className="text-sm font-extrabold uppercase font-sans mb-2 flex items-center gap-2">
            💬 Support Tickets
          </h3>
          <p className="text-xs text-foreground/60 font-serif">
            Support tickets will appear here when ticketing system is implemented
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecentActivityFeed;
