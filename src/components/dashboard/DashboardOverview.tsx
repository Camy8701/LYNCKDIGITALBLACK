import { Link } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useOrders } from "@/hooks/useOrders";
import Button from "@/components/Button";
import { Package, DollarSign, Download, Heart, ShoppingBag } from "lucide-react";
import { format } from "date-fns";

const DashboardOverview = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();

  // Get recent 3 orders
  const recentOrders = orders.slice(0, 3);

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-foreground"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-foreground/60 font-serif">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Statistics Cards */}
      <div>
        <span className="section-label">Overview</span>
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase font-sans text-white mt-4 mb-6">
          Key Metrics
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 -mt-4">
        {/* Total Orders */}
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#e64a19]/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-[#e64a19]" />
            </div>
            <div className="text-right">
              <div className="text-4xl md:text-5xl font-extrabold font-sans text-white">
                {stats.total_orders}
              </div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1 font-sans">
                Total Orders
              </div>
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="stat-card-lime">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#ccff00]/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#ccff00]" />
            </div>
            <div className="text-right">
              <div className="text-4xl md:text-5xl font-extrabold font-sans text-white">
                ${stats.total_spent.toFixed(0)}
              </div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1 font-sans">
                Total Spent
              </div>
            </div>
          </div>
        </div>

        {/* Available Downloads */}
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#e64a19]/20 flex items-center justify-center">
              <Download className="w-6 h-6 text-[#e64a19]" />
            </div>
            <div className="text-right">
              <div className="text-4xl md:text-5xl font-extrabold font-sans text-white">
                {stats.available_downloads}
              </div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1 font-sans">
                Downloads
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="stat-card-lime">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#ccff00]/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#ccff00]" />
            </div>
            <div className="text-right">
              <div className="text-4xl md:text-5xl font-extrabold font-sans text-white">
                {stats.wishlist_count}
              </div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground mt-1 font-sans">
                Wishlist
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="section-label">History</span>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase font-sans text-white mt-4">
              Recent Orders
            </h2>
          </div>
          {orders.length > 3 && (
            <Link to="/dashboard?tab=orders">
              <Button variant="transparent" className="text-xs md:text-sm py-2 px-4">
                View All
              </Button>
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          // Empty State
          <div className="data-panel text-center py-12">
            <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl md:text-3xl font-extrabold uppercase mb-4 font-sans text-white">
              No orders yet
            </h3>
            <p className="text-base md:text-lg text-muted-foreground mb-8 font-serif max-w-md mx-auto">
              Start exploring our digital products and place your first order!
            </p>
            <Link to="/">
              <Button variant="filled" className="text-base py-4 px-8">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          // Recent Orders List
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="stat-card"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl md:text-2xl font-extrabold font-sans text-white">
                        {order.order_number}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-500 text-white'
                            : order.status === 'pending'
                            ? 'bg-yellow-500 text-black'
                            : order.status === 'failed'
                            ? 'bg-red-500 text-white'
                            : 'bg-[#333] text-white'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground font-serif">
                      {format(new Date(order.created_at), 'MMM dd, yyyy')} •{' '}
                      {order.order_items?.length || 0} item
                      {(order.order_items?.length || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-extrabold font-sans text-[#ccff00]">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {stats.completed_orders > 0 && (
        <div className="data-panel">
          <h3 className="text-2xl md:text-3xl font-extrabold uppercase mb-6 font-sans text-white">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/dashboard?tab=orders">
              <Button variant="filled" className="w-full text-base py-4">
                View All Orders
              </Button>
            </Link>
            <Link to="/">
              <Button variant="transparent" className="w-full text-base py-4">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
