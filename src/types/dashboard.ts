// =====================================================
// THE DIGITALHUB - Customer Dashboard Types
// =====================================================
// TypeScript interfaces for orders, wishlists, profiles,
// payment methods, and dashboard statistics
// =====================================================

import { Product } from "./product";

// =====================================================
// ORDER TYPES
// =====================================================

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export type PaymentMethod =
  | 'stripe'
  | 'paypal'
  | 'manual'
  | 'placeholder';

export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  full_name?: string;
  phone?: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;

  // Status and payment
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_intent_id?: string | null;

  // Financial details
  subtotal: number;
  tax: number;
  total: number;
  currency: string;

  // Billing information
  billing_address?: BillingAddress | null;

  // Notes
  customer_notes?: string | null;
  admin_notes?: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
  completed_at?: string | null;

  // Relation to order items (populated by joins)
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;

  // Product snapshot (frozen at purchase time)
  product_name: string;
  product_slug: string;
  product_description?: string | null;
  product_image_url?: string | null;

  // Pricing
  unit_price: number;
  quantity: number;
  subtotal: number;

  // Download management
  download_url?: string | null;
  download_count: number;
  max_downloads: number;
  download_expires_at?: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Relation to product (populated by joins)
  product?: Product | null;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

// =====================================================
// DOWNLOAD TYPES
// =====================================================

export interface DownloadLog {
  id: string;
  order_item_id: string;
  user_id: string;
  product_id?: string | null;

  // Request metadata
  ip_address?: string | null;
  user_agent?: string | null;

  // Download details
  success: boolean;
  error_message?: string | null;

  // Timestamp
  created_at: string;
}

export interface DownloadUrlResponse {
  download_url: string | null;
  downloads_remaining: number;
  can_download: boolean;
  error_message: string | null;
}

// =====================================================
// WISHLIST TYPES
// =====================================================

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;

  // Optional metadata
  notes?: string | null;
  priority: number;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Relation to product (populated by joins)
  product?: Product | null;
}

export interface WishlistItem extends Wishlist {
  product: Product;
}

// =====================================================
// PROFILE TYPES
// =====================================================

export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: string | null;

  // Extended profile fields
  phone?: string | null;
  bio?: string | null;
  company?: string | null;
  website?: string | null;

  // Address fields
  address_street?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_zip?: string | null;
  address_country?: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateInput {
  full_name?: string;
  phone?: string;
  bio?: string;
  company?: string;
  website?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  address_country?: string;
}

// =====================================================
// PAYMENT METHOD TYPES
// =====================================================

export interface SavedPaymentMethod {
  id: string;
  user_id: string;

  // Stripe integration fields
  stripe_payment_method_id?: string | null;
  stripe_customer_id?: string | null;

  // Card details
  card_brand?: string | null;
  card_last4?: string | null;
  card_exp_month?: number | null;
  card_exp_year?: number | null;

  // Metadata
  is_default: boolean;
  billing_name?: string | null;
  billing_email?: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// =====================================================
// DASHBOARD STATISTICS TYPES
// =====================================================

export interface DashboardStats {
  total_orders: number;
  total_spent: number;
  completed_orders: number;
  pending_orders: number;
  available_downloads: number;
  wishlist_count: number;
  recent_order_date?: string | null;
}

// =====================================================
// CREATE ORDER TYPES (for checkout)
// =====================================================

export interface CreateOrderItemInput {
  product_id: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
  payment_method: PaymentMethod;
  billing_address?: BillingAddress;
  customer_notes?: string;
}

export interface CreateOrderResponse {
  order: Order;
  order_items: OrderItem[];
}

// =====================================================
// HELPER TYPES
// =====================================================

export type OrderFilterStatus = OrderStatus | 'all';

export interface OrderFilters {
  status?: OrderFilterStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
}
