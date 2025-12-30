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
}
