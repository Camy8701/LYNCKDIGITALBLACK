-- =====================================================
-- LYNCK DIGITAL - Dashboard Extensions (SAFE VERSION)
-- =====================================================
-- Adds wishlist, download tracking, payment methods, and extended profiles
-- Compatible with Stripe orders schema
-- Safe to re-run - uses DROP IF EXISTS for all objects
-- =====================================================

-- =====================================================
-- 1. DOWNLOAD LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_download_logs_order_item_id ON public.download_logs(order_item_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_user_id ON public.download_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_created_at ON public.download_logs(created_at DESC);

-- =====================================================
-- 2. WISHLISTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  notes TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON public.wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_created_at ON public.wishlists(created_at DESC);

-- =====================================================
-- 3. SAVED PAYMENT METHODS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.saved_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  is_default BOOLEAN NOT NULL DEFAULT false,
  billing_name TEXT,
  billing_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_user_id ON public.saved_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_stripe_pm_id ON public.saved_payment_methods(stripe_payment_method_id);

-- =====================================================
-- 4. EXTEND PROFILES TABLE
-- =====================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS address_street TEXT,
  ADD COLUMN IF NOT EXISTS address_city TEXT,
  ADD COLUMN IF NOT EXISTS address_state TEXT,
  ADD COLUMN IF NOT EXISTS address_zip TEXT,
  ADD COLUMN IF NOT EXISTS address_country TEXT;

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_payment_methods ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. DROP EXISTING POLICIES (SAFE)
-- =====================================================
-- Download logs policies
DROP POLICY IF EXISTS "Users can view own download logs" ON public.download_logs;
DROP POLICY IF EXISTS "Users can create download logs" ON public.download_logs;
DROP POLICY IF EXISTS "Admins can view all download logs" ON public.download_logs;

-- Wishlist policies
DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Users can add to own wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Users can update own wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Users can delete from own wishlist" ON public.wishlists;

-- Payment methods policies
DROP POLICY IF EXISTS "Users can view own payment methods" ON public.saved_payment_methods;
DROP POLICY IF EXISTS "Users can add own payment methods" ON public.saved_payment_methods;
DROP POLICY IF EXISTS "Users can update own payment methods" ON public.saved_payment_methods;
DROP POLICY IF EXISTS "Users can delete own payment methods" ON public.saved_payment_methods;

-- =====================================================
-- 7. RLS POLICIES - DOWNLOAD LOGS
-- =====================================================
CREATE POLICY "Users can view own download logs"
  ON public.download_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create download logs"
  ON public.download_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all download logs"
  ON public.download_logs FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- 8. RLS POLICIES - WISHLISTS
-- =====================================================
CREATE POLICY "Users can view own wishlist"
  ON public.wishlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
  ON public.wishlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wishlist"
  ON public.wishlists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist"
  ON public.wishlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 9. RLS POLICIES - SAVED PAYMENT METHODS
-- =====================================================
CREATE POLICY "Users can view own payment methods"
  ON public.saved_payment_methods FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add own payment methods"
  ON public.saved_payment_methods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON public.saved_payment_methods FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON public.saved_payment_methods FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 10. DROP EXISTING TRIGGERS (SAFE)
-- =====================================================
DROP TRIGGER IF EXISTS update_wishlists_updated_at ON public.wishlists;
DROP TRIGGER IF EXISTS update_saved_payment_methods_updated_at ON public.saved_payment_methods;

-- =====================================================
-- 11. CREATE UPDATE TRIGGERS
-- =====================================================
CREATE TRIGGER update_wishlists_updated_at
  BEFORE UPDATE ON public.wishlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_payment_methods_updated_at
  BEFORE UPDATE ON public.saved_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 12. DROP EXISTING FUNCTIONS (SAFE)
-- =====================================================
DROP FUNCTION IF EXISTS public.has_purchased_product(UUID, UUID);
DROP FUNCTION IF EXISTS public.get_download_url(UUID, UUID);

-- =====================================================
-- 13. HELPER FUNCTIONS
-- =====================================================

-- Function: Check if user has purchased a product
CREATE OR REPLACE FUNCTION public.has_purchased_product(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.order_items oi
    INNER JOIN public.orders o ON o.id = oi.order_id
    WHERE o.user_id = p_user_id
      AND oi.product_id = p_product_id
      AND o.status = 'completed'
  );
$$;

-- Function: Get download URL with validation
CREATE OR REPLACE FUNCTION public.get_download_url(
  p_order_item_id UUID,
  p_user_id UUID
)
RETURNS TABLE (
  download_url TEXT,
  downloads_remaining INTEGER,
  can_download BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_item RECORD;
BEGIN
  -- Fetch order item details
  SELECT
    oi.download_url,
    oi.download_count,
    oi.max_downloads,
    oi.download_expires_at,
    o.status,
    o.user_id
  INTO v_order_item
  FROM public.order_items oi
  INNER JOIN public.orders o ON o.id = oi.order_id
  WHERE oi.id = p_order_item_id;

  -- Check if order item exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT
      NULL::TEXT,
      0::INTEGER,
      FALSE::BOOLEAN,
      'Order item not found'::TEXT;
    RETURN;
  END IF;

  -- Check if user owns this order
  IF v_order_item.user_id != p_user_id THEN
    RETURN QUERY SELECT
      NULL::TEXT,
      0::INTEGER,
      FALSE::BOOLEAN,
      'Unauthorized access'::TEXT;
    RETURN;
  END IF;

  -- Check if order is completed
  IF v_order_item.status != 'completed' THEN
    RETURN QUERY SELECT
      NULL::TEXT,
      0::INTEGER,
      FALSE::BOOLEAN,
      'Order not completed'::TEXT;
    RETURN;
  END IF;

  -- Check download limit
  IF v_order_item.download_count >= v_order_item.max_downloads THEN
    RETURN QUERY SELECT
      NULL::TEXT,
      0::INTEGER,
      FALSE::BOOLEAN,
      'Download limit reached'::TEXT;
    RETURN;
  END IF;

  -- Check expiration
  IF v_order_item.download_expires_at IS NOT NULL
     AND v_order_item.download_expires_at < now() THEN
    RETURN QUERY SELECT
      NULL::TEXT,
      0::INTEGER,
      FALSE::BOOLEAN,
      'Download link expired'::TEXT;
    RETURN;
  END IF;

  -- All checks passed
  RETURN QUERY SELECT
    v_order_item.download_url::TEXT,
    (v_order_item.max_downloads - v_order_item.download_count)::INTEGER,
    TRUE::BOOLEAN,
    NULL::TEXT;
END;
$$;
