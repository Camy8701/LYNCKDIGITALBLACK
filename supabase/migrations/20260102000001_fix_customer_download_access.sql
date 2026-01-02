-- Migration: Fix customer download access for purchased products
-- Purpose: Fix Lovable AI security scan error "Customers Cannot Download Purchased Products"
-- Date: 2026-01-02
-- Issue: MISSING_RLS - product-files storage bucket lacks a policy for customers to download purchased products

-- =====================================================
-- STORAGE POLICY FOR CUSTOMER DOWNLOADS
-- =====================================================

-- Allow customers to download product files they have purchased
-- This policy checks if the user has a completed order containing the product file
CREATE POLICY "Customers can download their purchased products"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'product-files'
  AND (
    -- Allow if user is admin
    public.has_role(auth.uid(), 'admin')
    OR
    -- Allow if user has purchased this product
    EXISTS (
      SELECT 1
      FROM public.order_items oi
      INNER JOIN public.orders o ON o.id = oi.order_id
      INNER JOIN public.products p ON p.id = oi.product_id
      WHERE o.user_id = auth.uid()
        AND o.status = 'completed'
        AND p.file_url = storage.objects.name
        AND storage.objects.bucket_id = 'product-files'
    )
  )
);

-- =====================================================
-- EXPLANATION
-- =====================================================
-- This policy allows two types of access to product-files:
-- 1. Admins can always access (for management)
-- 2. Authenticated customers can access files they've purchased
--
-- Security checks:
-- - Must be authenticated (TO authenticated)
-- - Must have a completed order (o.status = 'completed')
-- - Product file path must match the file being accessed (p.file_url = storage.objects.name)
-- - User must own the order (o.user_id = auth.uid())
--
-- This prevents:
-- - Unauthenticated users from downloading files
-- - Customers from downloading files they haven't purchased
-- - Access to files from pending/failed/refunded orders
