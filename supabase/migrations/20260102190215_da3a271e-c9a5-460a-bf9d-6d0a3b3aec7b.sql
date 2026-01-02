-- Remove unused ip_address and user_agent columns from download_logs
-- These fields are not populated by the application and pose GDPR risks
ALTER TABLE public.download_logs DROP COLUMN IF EXISTS ip_address;
ALTER TABLE public.download_logs DROP COLUMN IF EXISTS user_agent;

-- Drop unused get_download_url function (Edge Function is used instead)
DROP FUNCTION IF EXISTS public.get_download_url(UUID, UUID);

-- Drop unused has_purchased_product function if not needed
DROP FUNCTION IF EXISTS public.has_purchased_product(UUID, UUID);