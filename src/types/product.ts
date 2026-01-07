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
  is_featured: boolean | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  // Enhanced product page fields - matching database schema (string arrays)
  page_count?: number | null;
  word_count?: number | null;
  file_size?: string | null;
  file_type?: string | null;
  whats_inside?: string[] | null;
  license_terms?: string[] | null;
  gallery_images?: string[] | null;
  card_color?: string | null;
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
