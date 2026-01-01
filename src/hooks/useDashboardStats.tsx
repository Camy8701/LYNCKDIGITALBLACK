import { useQuery } from '@tanstack/react-query';
import { DashboardStats } from '@/types/dashboard';
import { useAuth } from './useAuth';

/**
 * Fetch aggregated dashboard statistics for the current user
 * Note: Orders/payments functionality pending Stripe integration
 */
export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Placeholder stats until orders table is created
      return {
        total_orders: 0,
        total_spent: 0,
        completed_orders: 0,
        pending_orders: 0,
        available_downloads: 0,
        wishlist_count: 0,
        recent_order_date: null
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30
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
      return [];
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
      return {
        total_products: 0,
        total_downloads: 0,
        total_available: 0,
        items: []
      };
    },
    enabled: !!user
  });
}
