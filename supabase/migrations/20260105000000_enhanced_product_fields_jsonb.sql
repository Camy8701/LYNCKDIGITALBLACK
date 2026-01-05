-- Enhanced Product Fields Migration - JSONB Version
-- This migration upgrades the product schema to use JSONB for rich metadata
-- Created: January 5, 2026

-- Check if columns exist from previous migration and drop them if they're text[] type
DO $$
BEGIN
    -- Drop old text[] columns if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'products' AND column_name = 'whats_inside'
               AND data_type = 'ARRAY') THEN
        ALTER TABLE public.products DROP COLUMN whats_inside;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'products' AND column_name = 'license_terms'
               AND data_type = 'ARRAY') THEN
        ALTER TABLE public.products DROP COLUMN license_terms;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'products' AND column_name = 'gallery_images'
               AND data_type = 'ARRAY') THEN
        ALTER TABLE public.products DROP COLUMN gallery_images;
    END IF;
END $$;

-- Add enhanced product columns with proper types
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS page_count INTEGER,
  ADD COLUMN IF NOT EXISTS word_count INTEGER,
  ADD COLUMN IF NOT EXISTS file_size TEXT,
  ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT 'PDF',
  ADD COLUMN IF NOT EXISTS whats_inside TEXT,  -- Simple text with newlines
  ADD COLUMN IF NOT EXISTS license_terms JSONB DEFAULT '[]'::jsonb,  -- Rich structure
  ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;  -- Rich structure

-- Add column comments for documentation
COMMENT ON COLUMN public.products.page_count IS 'Number of pages in the digital product (e.g., ebook pages, template pages)';
COMMENT ON COLUMN public.products.word_count IS 'Total word count for text-based products';
COMMENT ON COLUMN public.products.file_size IS 'Human-readable file size (e.g., "2.4 MB", "15.8 KB")';
COMMENT ON COLUMN public.products.file_type IS 'File format type (e.g., "PDF", "DOCX", "ZIP", "MP4")';
COMMENT ON COLUMN public.products.whats_inside IS 'Detailed description of product contents (text with newlines)';
COMMENT ON COLUMN public.products.license_terms IS 'Array of license terms as JSON: [{"text": "...", "allowed": true/false}]';
COMMENT ON COLUMN public.products.gallery_images IS 'Array of gallery images as JSON: [{"url": "...", "alt": "...", "order": 1}]';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_file_type ON public.products(file_type);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured) WHERE is_featured = true;

-- Sample data update (optional - uncomment to populate existing products)
-- UPDATE public.products
-- SET
--   page_count = 25,
--   word_count = 5000,
--   file_size = '3.2 MB',
--   file_type = 'PDF',
--   whats_inside = E'Complete guide with step-by-step instructions\nDownloadable templates and resources\nBonus cheat sheet and quick reference guide',
--   license_terms = '[
--     {"text": "Use for personal projects", "allowed": true},
--     {"text": "Use for commercial projects", "allowed": true},
--     {"text": "Modify and customize", "allowed": true},
--     {"text": "Resell or redistribute", "allowed": false}
--   ]'::jsonb,
--   gallery_images = '[]'::jsonb
-- WHERE page_count IS NULL;
