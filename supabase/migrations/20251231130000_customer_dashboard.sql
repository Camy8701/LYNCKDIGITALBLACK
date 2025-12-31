-- =====================================================
-- LYNCK DIGITAL - Customer Dashboard Migration
-- =====================================================
-- This migration creates the complete database schema for:
-- - Orders and order items tracking
-- - Download management with security
-- - Wishlist functionality
-- - Extended user profiles
-- - Payment methods (placeholder for Stripe)
-- =====================================================

-- =====================================================
-- 1. ORDERS TABLE
-- =====================================================
-- Tracks customer orders with status, payment info, and totals
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,

  -- Order status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),

  -- Payment information
  payment_method TEXT NOT NULL DEFAULT 'placeholder' CHECK (payment_method IN ('stripe', 'paypal', 'manual', 'placeholder')),
  payment_intent_id TEXT, -- Stripe payment intent ID (for future use)

  -- Financial details
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',

  -- Billing information (stored as JSONB for flexibility)
  billing_address JSONB,

  -- Notes and metadata
  customer_notes TEXT,
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,

  -- Indexes for performance
  CONSTRAINT positive_subtotal CHECK (subtotal >= 0),
  CONSTRAINT positive_tax CHECK (tax >= 0),
  CONSTRAINT positive_total CHECK (total >= 0)
);

-- Create indexes for orders table
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- =====================================================
-- 2. ORDER ITEMS TABLE
-- =====================================================
-- Stores line items with product snapshots at time of purchase
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Product snapshot (frozen at purchase time)
  product_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  product_description TEXT,
  product_image_url TEXT,

  -- Pricing
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10, 2) NOT NULL,

  -- Download management
  download_url TEXT, -- Path to file in storage
  download_count INTEGER NOT NULL DEFAULT 0,
  max_downloads INTEGER NOT NULL DEFAULT 5,
  download_expires_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT positive_unit_price CHECK (unit_price >= 0),
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_subtotal CHECK (subtotal >= 0),
  CONSTRAINT valid_download_count CHECK (download_count >= 0)
);

-- Create indexes for order_items table
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- =====================================================
-- 3. DOWNLOAD LOGS TABLE
-- =====================================================
-- Audit trail for all product downloads
CREATE TABLE IF NOT EXISTS download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Request metadata
  ip_address INET,
  user_agent TEXT,

  -- Download details
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for download_logs table
CREATE INDEX IF NOT EXISTS idx_download_logs_order_item_id ON download_logs(order_item_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_user_id ON download_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_created_at ON download_logs(created_at DESC);

-- =====================================================
-- 4. WISHLISTS TABLE
-- =====================================================
-- User wishlist/favorites for products
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  -- Optional metadata
  notes TEXT,
  priority INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Unique constraint: one product per user in wishlist
  CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

-- Create indexes for wishlists table
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_created_at ON wishlists(created_at DESC);

-- =====================================================
-- 5. SAVED PAYMENT METHODS TABLE
-- =====================================================
-- Placeholder for future Stripe integration
CREATE TABLE IF NOT EXISTS saved_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Stripe integration fields
  stripe_payment_method_id TEXT UNIQUE,
  stripe_customer_id TEXT,

  -- Card details (last 4, brand, etc.)
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,

  -- Metadata
  is_default BOOLEAN NOT NULL DEFAULT false,
  billing_name TEXT,
  billing_email TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for saved_payment_methods table
CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_user_id ON saved_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_stripe_pm_id ON saved_payment_methods(stripe_payment_method_id);

-- =====================================================
-- 6. EXTEND PROFILES TABLE
-- =====================================================
-- Add additional profile fields for customer dashboard
ALTER TABLE profiles
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
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function: Generate unique order number (format: LYN-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  date_part TEXT;
  sequence_part TEXT;
  order_number TEXT;
  counter INTEGER := 1;
BEGIN
  -- Get today's date in YYYYMMDD format
  date_part := to_char(CURRENT_DATE, 'YYYYMMDD');

  -- Loop until we find a unique order number
  LOOP
    -- Format sequence with leading zeros (4 digits)
    sequence_part := lpad(counter::TEXT, 4, '0');

    -- Construct order number
    order_number := 'LYN-' || date_part || '-' || sequence_part;

    -- Check if this order number already exists
    IF NOT EXISTS (SELECT 1 FROM orders WHERE orders.order_number = order_number) THEN
      RETURN order_number;
    END IF;

    -- Increment counter and try again
    counter := counter + 1;
  END LOOP;
END;
$$;

-- Function: Get download URL with validation
CREATE OR REPLACE FUNCTION get_download_url(
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
AS $$
DECLARE
  v_order_item RECORD;
  v_order_status TEXT;
  v_user_owns_order BOOLEAN;
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
  FROM order_items oi
  INNER JOIN orders o ON o.id = oi.order_id
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
  v_user_owns_order := v_order_item.user_id = p_user_id;

  IF NOT v_user_owns_order THEN
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

  -- All checks passed - return download info
  RETURN QUERY SELECT
    v_order_item.download_url::TEXT,
    (v_order_item.max_downloads - v_order_item.download_count)::INTEGER,
    TRUE::BOOLEAN,
    NULL::TEXT;
END;
$$;

-- Function: Check if user has purchased a product
CREATE OR REPLACE FUNCTION has_purchased_product(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM order_items oi
    INNER JOIN orders o ON o.id = oi.order_id
    WHERE o.user_id = p_user_id
      AND oi.product_id = p_product_id
      AND o.status = 'completed'
  );
$$;

-- Function: Update order updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for orders updated_at
DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_updated_at();

-- Create trigger for order_items updated_at
DROP TRIGGER IF EXISTS trigger_order_items_updated_at ON order_items;
CREATE TRIGGER trigger_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_order_updated_at();

-- Create trigger for wishlists updated_at
DROP TRIGGER IF EXISTS trigger_wishlists_updated_at ON wishlists;
CREATE TRIGGER trigger_wishlists_updated_at
  BEFORE UPDATE ON wishlists
  FOR EACH ROW
  EXECUTE FUNCTION update_order_updated_at();

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_payment_methods ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ORDERS POLICIES
-- =====================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending orders
CREATE POLICY "Users can update own pending orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update all orders
CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- ORDER ITEMS POLICIES
-- =====================================================

-- Users can view order items for their orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can insert order items for their orders
CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update all order items
CREATE POLICY "Admins can update all order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- DOWNLOAD LOGS POLICIES
-- =====================================================

-- Users can view their own download logs
CREATE POLICY "Users can view own download logs"
  ON download_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own download logs
CREATE POLICY "Users can create download logs"
  ON download_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all download logs
CREATE POLICY "Admins can view all download logs"
  ON download_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- WISHLISTS POLICIES
-- =====================================================

-- Users can manage their own wishlist
CREATE POLICY "Users can view own wishlist"
  ON wishlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
  ON wishlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wishlist"
  ON wishlists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist"
  ON wishlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- SAVED PAYMENT METHODS POLICIES
-- =====================================================

-- Users can manage their own payment methods
CREATE POLICY "Users can view own payment methods"
  ON saved_payment_methods FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add own payment methods"
  ON saved_payment_methods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON saved_payment_methods FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON saved_payment_methods FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- All tables, functions, and policies created successfully
-- Next steps:
-- 1. Verify schema in Supabase dashboard
-- 2. Create TypeScript types
-- 3. Build React hooks for data access
-- =====================================================
