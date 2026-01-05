export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_class: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  image_url: string | null;
  file_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  // Enhanced product page fields
  page_count?: number | null;
  word_count?: number | null;
  file_size?: string | null;
  file_type?: string | null;
  whats_inside?: string | null; // Text with newlines
  license_terms?: Array<{ text: string; allowed: boolean }> | null; // JSONB array
  gallery_images?: Array<{ url: string; alt: string; order: number }> | null; // JSONB array
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string | null;
  categoryName: string | null;
  quantity: number;
  addedAt: string;
}

export interface CartStorage {
  items: CartItem[];
  lastUpdated: string;
  version: number;
}
