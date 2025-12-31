import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats } from '@/types/dashboard';
import { useAuth } from './useAuth';

/**
 * Fetch aggregated dashboard statistics for the current user
 */
export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Fetch all necessary data in parallel
      const [ordersResult, wishlistResult, orderItemsResult] = await Promise.all([
        // Get all orders
        supabase
          .from('orders')
          .select('id, status, total, created_at')
          .eq('user_id', user.id),

        // Get wishlist count
        supabase
          .from('wishlists')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        // Get order items for download stats
        supabase
          .from('order_items')
          .select('id, download_count, max_downloads, order_id')
          .in(
            'order_id',
            supabase
              .from('orders')
              .select('id')
              .eq('user_id', user.id)
              .eq('status', 'completed')
          )
      ]);

      // Check for errors
      if (ordersResult.error) throw ordersResult.error;
      if (wishlistResult.error) throw wishlistResult.error;
      if (orderItemsResult.error) throw orderItemsResult.error;

      const orders = ordersResult.data || [];
      const wishlistCount = wishlistResult.count || 0;
      const orderItems = orderItemsResult.data || [];

      // Calculate statistics
      const completedOrders = orders.filter(o => o.status === 'completed');
      const pendingOrders = orders.filter(o => o.status === 'pending');

      const totalSpent = completedOrders.reduce((sum, order) => {
        return sum + (Number(order.total) || 0);
      }, 0);

      // Calculate available downloads (items that still have downloads left)
      const availableDownloads = orderItems.filter(item => {
        return item.download_count < item.max_downloads;
      }).length;

      // Get most recent order date
      const recentOrderDate = orders.length > 0
        ? orders.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          })[0].created_at
        : null;

      return {
        total_orders: orders.length,
        total_spent: totalSpent,
        completed_orders: completedOrders.length,
        pending_orders: pendingOrders.length,
        available_downloads: availableDownloads,
        wishlist_count: wishlistCount,
        recent_order_date: recentOrderDate
      };
    },
    enabled: !!user,
    // Refetch stats when returning to dashboard
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30 // 30 minutes (formerly cacheTime)
  });
}

/**
 * Fetch order statistics over time (for charts/analytics)
 */
export function useOrdersOverTime(days: number = 30) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders-over-time', user?.id, days],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total, status')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const grouped = (data || []).reduce((acc, order) => {
        const date = new Date(order.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            date,
            count: 0,
            total: 0,
            completed: 0
          };
        }
        acc[date].count++;
        acc[date].total += Number(order.total) || 0;
        if (order.status === 'completed') {
          acc[date].completed++;
        }
        return acc;
      }, {} as Record<string, { date: string; count: number; total: number; completed: number }>);

      return Object.values(grouped);
    },
    enabled: !!user
  });
}

/**
 * Fetch download statistics
 */
export function useDownloadStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['download-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get all order items for completed orders
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('id, product_name, download_count, max_downloads')
        .in(
          'order_id',
          supabase
            .from('orders')
            .select('id')
            .eq('user_id', user.id)
            .eq('status', 'completed')
        );

      if (itemsError) throw itemsError;

      const items = orderItems || [];

      const totalProducts = items.length;
      const totalDownloads = items.reduce((sum, item) => sum + item.download_count, 0);
      const totalAvailable = items.reduce((sum, item) => {
        const remaining = item.max_downloads - item.download_count;
        return sum + Math.max(0, remaining);
      }, 0);

      return {
        total_products: totalProducts,
        total_downloads: totalDownloads,
        total_available: totalAvailable,
        items: items.map(item => ({
          product_name: item.product_name,
          downloads_used: item.download_count,
          downloads_total: item.max_downloads,
          downloads_remaining: Math.max(0, item.max_downloads - item.download_count)
        }))
      };
    },
    enabled: !!user
  });
}
