-- Migration: Remove unused SECURITY DEFINER functions
-- Purpose: Fix Lovable AI security scan warning about unused elevated privilege functions
-- Date: 2026-01-02

-- These functions are not used anywhere in the codebase and pose an unnecessary security risk
-- They were replaced by direct RLS policies and client-side logic

-- Drop unused has_purchased_product function
DROP FUNCTION IF EXISTS public.has_purchased_product(UUID, UUID);

-- Drop unused get_download_url function
DROP FUNCTION IF EXISTS public.get_download_url(UUID);

-- Comment: Retained SECURITY DEFINER functions are:
-- 1. generate_order_number() - Essential for order creation sequence
-- 2. has_role(UUID, TEXT) - Essential for role-based authorization checks
-- 3. handle_new_user() - Essential trigger for automatic profile creation
-- All retained functions have proper search_path settings and authorization checks
