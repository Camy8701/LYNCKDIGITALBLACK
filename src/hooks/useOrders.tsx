import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Order,
  OrderItem,
  OrderWithItems,
  CreateOrderInput,
  CreateOrderResponse
} from '@/types/dashboard';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useCart } from './useCart';

/**
 * Fetch all orders for the current user
 * Note: Will be implemented with Stripe integration
 */
export function useOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async (): Promise<OrderWithItems[]> => {
      if (!user) throw new Error('User not authenticated');
      // Placeholder until orders table exists
      return [];
    },
    enabled: !!user
  });
}

/**
 * Fetch a single order by ID
 */
export function useOrder(orderId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async (): Promise<OrderWithItems | null> => {
      if (!user) throw new Error('User not authenticated');
      return null;
    },
    enabled: !!user && !!orderId
  });
}

/**
 * Fetch order items for a specific order
 */
export function useOrderItems(orderId: string) {
  return useQuery({
    queryKey: ['order-items', orderId],
    queryFn: async (): Promise<OrderItem[]> => {
      return [];
    },
    enabled: !!orderId
  });
}

/**
 * Create a new order from cart items
 * Note: Will be replaced with Stripe checkout
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { clearCart } = useCart();

  return useMutation({
    mutationFn: async (input: CreateOrderInput): Promise<CreateOrderResponse> => {
      if (!user) throw new Error('User not authenticated');
      throw new Error('Stripe checkout not yet configured');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      clearCart();
      toast.success('Order created successfully!');
    },
    onError: (error: Error) => {
      console.error('Create order error:', error);
      toast.error(`Failed to create order: ${error.message}`);
    }
  });
}

/**
 * Download a product from an order item
 */
export function useDownloadProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (orderItemId: string): Promise<string> => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke('get-download', {
        body: { orderItemId }
      });

      if (error) {
        throw new Error(error.message || 'Download failed');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.signedUrl) {
        throw new Error('No download URL received');
      }

      // Open the signed URL in a new tab to start download
      window.open(data.signedUrl, '_blank');
      
      return data.signedUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-items'] });
      toast.success('Download started!');
    },
    onError: (error: Error) => {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download product');
    }
  });
}

/**
 * Update order status (admin only)
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
      throw new Error('Order management not yet configured');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error: Error) => {
      console.error('Update order status error:', error);
      toast.error(`Failed to update order status: ${error.message}`);
    }
  });
}
