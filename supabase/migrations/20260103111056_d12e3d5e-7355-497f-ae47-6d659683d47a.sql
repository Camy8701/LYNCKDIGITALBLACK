-- Add new columns to products table for enhanced product page
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS page_count integer,
ADD COLUMN IF NOT EXISTS word_count integer,
ADD COLUMN IF NOT EXISTS file_size text,
ADD COLUMN IF NOT EXISTS file_type text,
ADD COLUMN IF NOT EXISTS whats_inside text[],
ADD COLUMN IF NOT EXISTS license_terms text[],
ADD COLUMN IF NOT EXISTS gallery_images text[];