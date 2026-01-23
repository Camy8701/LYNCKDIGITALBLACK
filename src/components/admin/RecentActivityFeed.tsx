import { ShoppingCart, Clock } from "lucide-react";
import { useRecentOrders } from "@/hooks/useAdminAnalytics";
import { cn } from "@/lib/utils";

const RecentActivityFeed = () => {
  const { data: orders, isLoading } = useRecentOrders(10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#ccff00]/20';
      case 'pending':
      case 'processing':
        return 'bg-[#e64a19]/20';
      case 'failed':
      case 'refunded':
        return 'bg-red-500/20';
      default:
        return 'bg-[#333]';
    }
  };

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-[#ccff00]';
      case 'pending':
      case 'processing':
        return 'text-[#e64a19]';
      case 'failed':
      case 'refunded':
        return 'text-red-500';
      default:
        return 'text-white';
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
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4 text-white">
          RECENT ACTIVITY FEED
        </h2>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="stat-card flex items-center gap-3 animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-[#333]"></div>
              <div className="flex-1">
                <div className="h-4 bg-[#333] rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-[#333] rounded w-1/2"></div>
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
        <h2 className="text-2xl font-extrabold uppercase font-sans mb-4 text-white">
          RECENT ACTIVITY FEED
        </h2>
        <div className="stat-card text-center py-8">
          <Clock className="w-16 h-16 mx-auto mb-4 text-[#333]" />
          <h3 className="text-xl font-bold font-sans mb-2 text-white">No Recent Activity</h3>
          <p className="text-muted-foreground font-serif">
            Recent transactions will appear here
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-extrabold uppercase font-sans text-white">
          RECENT ACTIVITY FEED
        </h2>
        <span className="text-sm font-bold text-muted-foreground">
          Last 10 transactions
        </span>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-3 flex items-center gap-3 hover:border-[#404040] transition-colors"
          >
            {/* Icon */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              getStatusColor(order.status)
            )}>
              <ShoppingCart className={cn("w-5 h-5", getStatusIconColor(order.status))} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold font-sans truncate text-white">
                {order.customerName || order.customerEmail}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.orderNumber} • {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} • ${order.total.toFixed(2)}
              </p>
            </div>

            {/* Status & Time */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-bold uppercase",
                order.status === 'completed' && "bg-[#ccff00]/20 text-[#ccff00]",
                order.status === 'pending' && "bg-[#e64a19]/20 text-[#e64a19]",
                order.status === 'processing' && "bg-[#e64a19]/20 text-[#e64a19]",
                (order.status === 'failed' || order.status === 'refunded') && "bg-red-500/20 text-red-500"
              )}>
                {getStatusText(order.status)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(order.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder sections for future features */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stat-card border-dashed">
          <h3 className="text-sm font-extrabold uppercase font-sans mb-2 text-white">
            Reviews
          </h3>
          <p className="text-xs text-muted-foreground font-serif">
            Customer reviews will appear here when review system is implemented
          </p>
        </div>
        <div className="stat-card-lime border-dashed">
          <h3 className="text-sm font-extrabold uppercase font-sans mb-2 text-white">
            Support Tickets
          </h3>
          <p className="text-xs text-muted-foreground font-serif">
            Support tickets will appear here when ticketing system is implemented
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecentActivityFeed;
