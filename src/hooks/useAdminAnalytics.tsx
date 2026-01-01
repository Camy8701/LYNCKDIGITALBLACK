import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// =====================================================
// REVENUE METRICS
// =====================================================

interface RevenueMetrics {
  today: number;
  yesterday: number;
  todayVsYesterday: number; // percentage change
  monthToDate: number;
  lastMonth: number;
  monthVsLastMonth: number; // percentage change
}

export function useRevenueMetrics() {
  return useQuery({
    queryKey: ['admin-revenue-metrics'],
    queryFn: async (): Promise<RevenueMetrics> => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      // Today's revenue
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completed')
        .gte('created_at', today.toISOString().split('T')[0])
        .lt('created_at', new Date(today.getTime() + 86400000).toISOString().split('T')[0]);

      // Yesterday's revenue
      const { data: yesterdayOrders } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completed')
        .gte('created_at', yesterday.toISOString().split('T')[0])
        .lt('created_at', today.toISOString().split('T')[0]);

      // Month-to-date revenue
      const { data: mtdOrders } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completed')
        .gte('created_at', startOfMonth.toISOString());

      // Last month same period revenue
      const dayOfMonth = today.getDate();
      const lastMonthSamePeriod = new Date(startOfLastMonth);
      lastMonthSamePeriod.setDate(dayOfMonth);

      const { data: lastMonthOrders } = await supabase
        .from('orders')
        .select('total')
        .eq('status', 'completed')
        .gte('created_at', startOfLastMonth.toISOString())
        .lt('created_at', lastMonthSamePeriod.toISOString());

      const todayTotal = todayOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
      const yesterdayTotal = yesterdayOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
      const mtdTotal = mtdOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
      const lastMonthTotal = lastMonthOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

      const todayVsYesterday = yesterdayTotal > 0
        ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100
        : 0;

      const monthVsLastMonth = lastMonthTotal > 0
        ? ((mtdTotal - lastMonthTotal) / lastMonthTotal) * 100
        : 0;

      return {
        today: todayTotal,
        yesterday: yesterdayTotal,
        todayVsYesterday,
        monthToDate: mtdTotal,
        lastMonth: lastMonthTotal,
        monthVsLastMonth,
      };
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

// =====================================================
// REFUND RATE
// =====================================================

interface RefundRate {
  rate: number; // percentage
  refundedCount: number;
  totalCount: number;
  isAlarm: boolean; // true if > 5%
}

export function useRefundRate() {
  return useQuery({
    queryKey: ['admin-refund-rate'],
    queryFn: async (): Promise<RefundRate> => {
      // Get all completed and refunded orders from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: orders } = await supabase
        .from('orders')
        .select('status')
        .in('status', ['completed', 'refunded'])
        .gte('created_at', thirtyDaysAgo.toISOString());

      const totalCount = orders?.length || 0;
      const refundedCount = orders?.filter(o => o.status === 'refunded').length || 0;
      const rate = totalCount > 0 ? (refundedCount / totalCount) * 100 : 0;

      return {
        rate,
        refundedCount,
        totalCount,
        isAlarm: rate > 5,
      };
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// =====================================================
// PRODUCT PERFORMANCE
// =====================================================

interface ProductPerformance {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  file_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  category_id: string | null;
  category: string | null;
  unitsSoldWeek: number;
  revenueWeek: number;
  unitsSoldTotal: number;
  revenueTotal: number;
}

export function useProductPerformance() {
  return useQuery({
    queryKey: ['admin-product-performance'],
    queryFn: async (): Promise<ProductPerformance[]> => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Get all products with all necessary fields
      const { data: products } = await supabase
        .from('products')
        .select('id, name, slug, short_description, description, price, original_price, image_url, file_url, is_featured, is_active, created_at, category_id, category:categories(name)');

      if (!products) return [];

      // Get order items for each product
      const performancePromises = products.map(async (product) => {
        // Week stats
        const { data: weekItems } = await supabase
          .from('order_items')
          .select('quantity, subtotal, order:orders!inner(status, created_at)')
          .eq('product_id', product.id)
          .eq('order.status', 'completed')
          .gte('order.created_at', oneWeekAgo.toISOString());

        // Total stats
        const { data: totalItems } = await supabase
          .from('order_items')
          .select('quantity, subtotal, order:orders!inner(status)')
          .eq('product_id', product.id)
          .eq('order.status', 'completed');

        const unitsSoldWeek = weekItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
        const revenueWeek = weekItems?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0;
        const unitsSoldTotal = totalItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
        const revenueTotal = totalItems?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0;

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          short_description: product.short_description,
          description: product.description,
          price: product.price,
          original_price: product.original_price,
          image_url: product.image_url,
          file_url: product.file_url,
          is_featured: product.is_featured,
          is_active: product.is_active,
          created_at: product.created_at,
          category_id: product.category_id,
          category: product.category?.name || null,
          unitsSoldWeek,
          revenueWeek,
          unitsSoldTotal,
          revenueTotal,
        };
      });

      const performance = await Promise.all(performancePromises);

      // Sort by revenue (highest first)
      return performance.sort((a, b) => b.revenueTotal - a.revenueTotal);
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// =====================================================
// TOP CUSTOMERS
// =====================================================

interface TopCustomer {
  id: string;
  email: string;
  fullName: string | null;
  totalPurchases: number;
  totalSpent: number;
  lastPurchaseDate: string;
}

export function useTopCustomers(limit: number = 10) {
  return useQuery({
    queryKey: ['admin-top-customers', limit],
    queryFn: async (): Promise<TopCustomer[]> => {
      // Get all orders grouped by user
      const { data: orders } = await supabase
        .from('orders')
        .select('user_id, total, created_at')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (!orders) return [];

      // Group by user_id
      const userStats = orders.reduce((acc, order) => {
        if (!acc[order.user_id]) {
          acc[order.user_id] = {
            totalPurchases: 0,
            totalSpent: 0,
            lastPurchaseDate: order.created_at,
          };
        }
        acc[order.user_id].totalPurchases++;
        acc[order.user_id].totalSpent += order.total || 0;

        // Keep most recent date
        if (order.created_at > acc[order.user_id].lastPurchaseDate) {
          acc[order.user_id].lastPurchaseDate = order.created_at;
        }

        return acc;
      }, {} as Record<string, { totalPurchases: number; totalSpent: number; lastPurchaseDate: string }>);

      // Get user details
      const userIds = Object.keys(userStats);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const { data: users } = await supabase.auth.admin.listUsers();
      const userEmailMap = new Map(users.users?.map(u => [u.id, u.email]) || []);

      if (!profiles) return [];

      // Combine data
      const customers: TopCustomer[] = profiles.map(profile => ({
        id: profile.id,
        email: userEmailMap.get(profile.id) || '',
        fullName: profile.full_name,
        totalPurchases: userStats[profile.id].totalPurchases,
        totalSpent: userStats[profile.id].totalSpent,
        lastPurchaseDate: userStats[profile.id].lastPurchaseDate,
      }));

      // Sort by total spent and limit
      return customers
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, limit);
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// =====================================================
// RECENT ORDERS
// =====================================================

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string | null;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

export function useRecentOrders(limit: number = 10) {
  return useQuery({
    queryKey: ['admin-recent-orders', limit],
    queryFn: async (): Promise<RecentOrder[]> => {
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total,
          status,
          created_at,
          user_id,
          items:order_items(id)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!orders) return [];

      // Fetch user emails and profiles separately
      const userIds = orders.map(o => o.user_id).filter(Boolean);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const { data: users } = await supabase.auth.admin.listUsers();
      const userEmailMap = new Map(users.users?.map(u => [u.id, u.email]) || []);

      return orders.map(order => {
        const profile = profiles?.find(p => p.id === order.user_id);
        const email = userEmailMap.get(order.user_id) || 'Unknown';

        return {
          id: order.id,
          orderNumber: order.order_number,
          customerEmail: email,
          customerName: profile?.full_name || null,
          total: order.total || 0,
          status: order.status,
          createdAt: order.created_at,
          itemCount: order.items?.length || 0,
        };
      });
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// =====================================================
// UNDOWNLOADED PURCHASES
// =====================================================

interface UndownloadedPurchase {
  orderItemId: string;
  customerEmail: string;
  customerName: string | null;
  productName: string;
  purchaseDate: string;
  daysAgo: number;
}

export function useUndownloadedPurchases() {
  return useQuery({
    queryKey: ['admin-undownloaded-purchases'],
    queryFn: async (): Promise<UndownloadedPurchase[]> => {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: items } = await supabase
        .from('order_items')
        .select(`
          id,
          product_name,
          download_count,
          order:orders!inner(
            user_id,
            created_at,
            status
          )
        `)
        .eq('download_count', 0)
        .eq('order.status', 'completed')
        .lt('order.created_at', twentyFourHoursAgo.toISOString());

      if (!items) return [];

      // Fetch user emails and profiles separately
      const userIds = items.map(i => i.order.user_id).filter(Boolean);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const { data: users } = await supabase.auth.admin.listUsers();
      const userEmailMap = new Map(users.users?.map(u => [u.id, u.email]) || []);

      const now = new Date();
      return items.map(item => {
        const purchaseDate = new Date(item.order.created_at);
        const daysAgo = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
        const profile = profiles?.find(p => p.id === item.order.user_id);
        const email = userEmailMap.get(item.order.user_id) || 'Unknown';

        return {
          orderItemId: item.id,
          customerEmail: email,
          customerName: profile?.full_name || null,
          productName: item.product_name,
          purchaseDate: item.order.created_at,
          daysAgo,
        };
      });
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// =====================================================
// DOWNLOAD STATS
// =====================================================

interface DownloadStats {
  totalDownloads: number;
  uniqueCustomers: number;
  avgTimeToFirstDownload: number; // in hours
  downloadsToday: number;
}

export function useDownloadStats() {
  return useQuery({
    queryKey: ['admin-download-stats'],
    queryFn: async (): Promise<DownloadStats> => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Total downloads
      const { data: allLogs } = await supabase
        .from('download_logs')
        .select('user_id, created_at, order_item:order_items!inner(order:orders!inner(created_at))');

      // Downloads today
      const { data: todayLogs } = await supabase
        .from('download_logs')
        .select('id')
        .gte('created_at', today.toISOString());

      const totalDownloads = allLogs?.length || 0;
      const uniqueCustomers = new Set(allLogs?.map(log => log.user_id)).size;
      const downloadsToday = todayLogs?.length || 0;

      // Calculate average time to first download
      let avgTimeToFirstDownload = 0;
      if (allLogs && allLogs.length > 0) {
        const times = allLogs
          .map(log => {
            const orderDate = new Date(log.order_item.order.created_at);
            const downloadDate = new Date(log.created_at);
            return (downloadDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60); // hours
          })
          .filter(time => time >= 0); // Filter out any negative times (data issues)

        if (times.length > 0) {
          avgTimeToFirstDownload = times.reduce((sum, time) => sum + time, 0) / times.length;
        }
      }

      return {
        totalDownloads,
        uniqueCustomers,
        avgTimeToFirstDownload,
        downloadsToday,
      };
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// =====================================================
// EMAIL SUBSCRIBERS
// =====================================================

interface EmailGrowth {
  totalSubscribers: number;
  newThisWeek: number;
  newLastWeek: number;
  weeklyGrowth: number; // percentage
}

export function useEmailGrowth() {
  return useQuery({
    queryKey: ['admin-email-growth'],
    queryFn: async (): Promise<EmailGrowth> => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      // Total subscribers
      const { data: allSubscribers, count: totalCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('subscribed_to_newsletter', true);

      // New this week
      const { data: thisWeekSubscribers, count: thisWeekCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('subscribed_to_newsletter', true)
        .gte('newsletter_subscribed_at', oneWeekAgo.toISOString());

      // New last week
      const { data: lastWeekSubscribers, count: lastWeekCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('subscribed_to_newsletter', true)
        .gte('newsletter_subscribed_at', twoWeeksAgo.toISOString())
        .lt('newsletter_subscribed_at', oneWeekAgo.toISOString());

      const totalSubscribers = totalCount || 0;
      const newThisWeek = thisWeekCount || 0;
      const newLastWeek = lastWeekCount || 0;
      const weeklyGrowth = newLastWeek > 0
        ? ((newThisWeek - newLastWeek) / newLastWeek) * 100
        : 0;

      return {
        totalSubscribers,
        newThisWeek,
        newLastWeek,
        weeklyGrowth,
      };
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

// =====================================================
// ADMIN ALERTS
// =====================================================

export interface AdminAlert {
  id: string;
  type: 'refund' | 'undownloaded' | 'traffic' | 'review';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  action: string;
  actionUrl?: string;
  createdAt: string;
}

export function useAdminAlerts() {
  return useQuery({
    queryKey: ['admin-alerts'],
    queryFn: async (): Promise<AdminAlert[]> => {
      const alerts: AdminAlert[] = [];

      // Check for undownloaded purchases (>3 days)
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const { data: undownloaded } = await supabase
        .from('order_items')
        .select(`
          id,
          product_name,
          order:orders!inner(
            user_id,
            created_at,
            status
          )
        `)
        .eq('download_count', 0)
        .eq('order.status', 'completed')
        .lt('order.created_at', threeDaysAgo.toISOString())
        .limit(5);

      if (undownloaded && undownloaded.length > 0) {
        // Fetch user emails separately
        const userIds = undownloaded.map(i => i.order.user_id).filter(Boolean);
        const { data: users } = await supabase.auth.admin.listUsers();
        const userEmailMap = new Map(users.users?.map(u => [u.id, u.email]) || []);

        undownloaded.forEach(item => {
          const email = userEmailMap.get(item.order.user_id) || 'Unknown';
          alerts.push({
            id: `undownloaded-${item.id}`,
            type: 'undownloaded',
            priority: 'medium',
            title: 'Customer hasn\'t downloaded purchase',
            message: `${email} hasn't downloaded "${item.product_name}" for 3+ days`,
            action: 'Send Reminder',
            createdAt: item.order.created_at,
          });
        });
      }

      // Check for high refund rate
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentOrders } = await supabase
        .from('orders')
        .select('status')
        .in('status', ['completed', 'refunded'])
        .gte('created_at', thirtyDaysAgo.toISOString());

      const totalCount = recentOrders?.length || 0;
      const refundedCount = recentOrders?.filter(o => o.status === 'refunded').length || 0;
      const refundRate = totalCount > 0 ? (refundedCount / totalCount) * 100 : 0;

      if (refundRate > 5) {
        alerts.push({
          id: 'high-refund-rate',
          type: 'refund',
          priority: 'high',
          title: 'High Refund Rate Detected',
          message: `Refund rate is ${refundRate.toFixed(1)}% (${refundedCount} of ${totalCount} orders in last 30 days)`,
          action: 'Review Orders',
          createdAt: new Date().toISOString(),
        });
      }

      return alerts.sort((a, b) => {
        // Sort by priority then date
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    },
    refetchInterval: 60000, // Refetch every minute
  });
}
