import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wishlist, WishlistItem } from '@/types/dashboard';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

/**
 * Fetch the current user's wishlist with product details
 * Note: Wishlist table pending creation
 */
export function useWishlist() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async (): Promise<WishlistItem[]> => {
      if (!user) throw new Error('User not authenticated');
      // Placeholder until wishlists table exists
      return [];
    },
    enabled: !!user
  });
}

/**
 * Check if a specific product is in the user's wishlist
 */
export function useIsInWishlist(productId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wishlist-item', user?.id, productId],
    queryFn: async (): Promise<boolean> => {
      if (!user) return false;
      return false;
    },
    enabled: !!user && !!productId
  });
}

/**
 * Get wishlist item details for a specific product
 */
export function useWishlistItem(productId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wishlist-item-detail', user?.id, productId],
    queryFn: async (): Promise<Wishlist | null> => {
      if (!user) return null;
      return null;
    },
    enabled: !!user && !!productId
  });
}

/**
 * Add a product to the wishlist
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      notes,
      priority = 0
    }: {
      productId: string;
      notes?: string;
      priority?: number
    }) => {
      if (!user) throw new Error('Please sign in to add items to your wishlist');
      throw new Error('Wishlist feature coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-item'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Added to wishlist');
    },
    onError: (error: Error) => {
      console.error('Add to wishlist error:', error);
      toast.error(error.message || 'Failed to add to wishlist');
    }
  });
}

/**
 * Remove a product from the wishlist
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('User not authenticated');
      throw new Error('Wishlist feature coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-item'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Removed from wishlist');
    },
    onError: (error: Error) => {
      console.error('Remove from wishlist error:', error);
      toast.error('Failed to remove from wishlist');
    }
  });
}

/**
 * Toggle a product in/out of the wishlist
 */
export function useToggleWishlist() {
  const { user } = useAuth();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  return {
    toggle: async (productId: string) => {
      if (!user) {
        toast.error('Please sign in to add items to your wishlist');
        return;
      }
      toast.info('Wishlist feature coming soon');
    },
    isLoading: addToWishlist.isPending || removeFromWishlist.isPending
  };
}

/**
 * Update wishlist item (notes, priority)
 */
export function useUpdateWishlistItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      notes,
      priority
    }: {
      productId: string;
      notes?: string;
      priority?: number
    }) => {
      if (!user) throw new Error('User not authenticated');
      throw new Error('Wishlist feature coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-item'] });
      toast.success('Wishlist item updated');
    },
    onError: (error: Error) => {
      console.error('Update wishlist item error:', error);
      toast.error('Failed to update wishlist item');
    }
  });
}

/**
 * Clear entire wishlist
 */
export function useClearWishlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      throw new Error('Wishlist feature coming soon');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-item'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Wishlist cleared');
    },
    onError: (error: Error) => {
      console.error('Clear wishlist error:', error);
      toast.error('Failed to clear wishlist');
    }
  });
}
