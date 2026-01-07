-- Add card_color column to products table for customizing card background colors
ALTER TABLE public.products 
ADD COLUMN card_color TEXT DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.products.card_color IS 'Custom background color class for product card (e.g., bg-vibrant-purple)';