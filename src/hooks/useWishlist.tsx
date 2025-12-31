import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Wishlist, WishlistItem } from '@/types/dashboard';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// =====================================================
// QUERY HOOKS
// =====================================================

/**
 * Fetch the current user's wishlist with product details
 */
export function useWishlist() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async (): Promise<WishlistItem[]> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          product:products(
            *,
            category:categories(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out items with null products (in case product was deleted)
      const validItems = (data || []).filter(item => item.product !== null) as WishlistItem[];

      return validItems;
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

      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
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

      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!productId
  });
}

// =====================================================
// MUTATION HOOKS
// =====================================================

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

      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          product_id: productId,
          notes,
          priority
        })
        .select()
        .single();

      if (error) {
        // Check for unique constraint violation
        if (error.code === '23505') {
          throw new Error('Product is already in your wishlist');
        }
        throw error;
      }

      return data;
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

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
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
  const { data: isInWishlist } = useIsInWishlist;
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  return {
    toggle: async (productId: string) => {
      if (!user) {
        toast.error('Please sign in to add items to your wishlist');
        return;
      }

      // Check current wishlist status
      const { data: exists } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (exists) {
        removeFromWishlist.mutate(productId);
      } else {
        addToWishlist.mutate({ productId });
      }
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

      const updates: Partial<Wishlist> = {};
      if (notes !== undefined) updates.notes = notes;
      if (priority !== undefined) updates.priority = priority;

      const { data, error } = await supabase
        .from('wishlists')
        .update(updates)
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
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

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
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
