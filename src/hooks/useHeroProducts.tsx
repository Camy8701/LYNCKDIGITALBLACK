import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface HeroProductWithProduct {
  id: string;
  product_id: string;
  display_order: number;
  product: Product;
}

export function useHeroProducts() {
  return useQuery({
    queryKey: ['hero-products'],
    queryFn: async (): Promise<HeroProductWithProduct[]> => {
      const { data, error } = await supabase
        .from('hero_products')
        .select(`
          *,
          product:products(*, category:categories(*))
        `)
        .order('display_order', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return (data || []).filter(hp => hp.product !== null) as HeroProductWithProduct[];
    }
  });
}

export function useSetHeroProducts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productIds: string[]) => {
      // First, delete all existing hero products
      const { error: deleteError } = await supabase
        .from('hero_products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (deleteError) throw deleteError;
      
      // Then insert new ones with order
      if (productIds.length > 0) {
        const insertData = productIds.map((product_id, index) => ({
          product_id,
          display_order: index
        }));
        
        const { error: insertError } = await supabase
          .from('hero_products')
          .insert(insertData);
        
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-products'] });
      toast.success('Hero products updated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}
