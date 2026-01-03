-- Add enhanced product fields for magazine-style product pages
-- Migration created: January 3, 2026

-- Add new columns to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS page_count INTEGER,
  ADD COLUMN IF NOT EXISTS word_count INTEGER,
  ADD COLUMN IF NOT EXISTS file_size TEXT,
  ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT 'PDF',
  ADD COLUMN IF NOT EXISTS whats_inside TEXT,
  ADD COLUMN IF NOT EXISTS license_terms JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN public.products.page_count IS 'Number of pages in the digital product (e.g., ebook pages, template pages)';
COMMENT ON COLUMN public.products.word_count IS 'Total word count for text-based products';
COMMENT ON COLUMN public.products.file_size IS 'Human-readable file size (e.g., "2.4 MB", "15.8 KB")';
COMMENT ON COLUMN public.products.file_type IS 'File format type (e.g., "PDF", "DOCX", "ZIP", "MP4")';
COMMENT ON COLUMN public.products.whats_inside IS 'Detailed description of product contents, formatted as markdown or HTML';
COMMENT ON COLUMN public.products.license_terms IS 'Array of license terms/permissions as JSON objects with "text" and "allowed" fields';
COMMENT ON COLUMN public.products.gallery_images IS 'Array of additional product images as JSON objects with "url", "alt", and "order" fields';

-- Example data structure for license_terms:
-- [
--   {"text": "Use for personal projects", "allowed": true},
--   {"text": "Use for commercial projects", "allowed": true},
--   {"text": "Modify and customize", "allowed": true},
--   {"text": "Resell or redistribute", "allowed": false}
-- ]

-- Example data structure for gallery_images:
-- [
--   {"url": "https://...", "alt": "Preview 1", "order": 1},
--   {"url": "https://...", "alt": "Preview 2", "order": 2},
--   {"url": "https://...", "alt": "Preview 3", "order": 3}
-- ]

-- Update existing products with default values (optional)
-- Uncomment if you want to set defaults for existing products
-- UPDATE public.products
-- SET
--   file_type = 'PDF',
--   license_terms = '[
--     {"text": "Use for personal projects", "allowed": true},
--     {"text": "Use for commercial projects", "allowed": true},
--     {"text": "Modify and customize", "allowed": true},
--     {"text": "Resell or redistribute", "allowed": false}
--   ]'::jsonb
-- WHERE file_type IS NULL;
