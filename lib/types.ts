export interface SiteConfig {
  id: string;
  site_name: string;
  logo_url: string | null;
  whatsapp_number: string;
  whatsapp_default_message: string;
  currency: string;
  currency_symbol: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  show_prices: boolean;
  meta_title: string | null;
  meta_description: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  children?: Category[];
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  category?: Category;
  categories?: Category[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
}

export interface CarouselSlide {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  image_url_mobile: string | null;
  link_url: string | null;
  link_text: string | null;
  sort_order: number;
  is_active: boolean;
}
