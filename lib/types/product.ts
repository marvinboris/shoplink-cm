export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  images: string[];
  category: string | null;
  tags: string[];
  stock_count: number | null;
  track_stock: boolean;
  is_available: boolean;
  is_featured: boolean;
  order_index: number;
  created_at: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  images: string[];
  category?: string;
  tags?: string[];
  stock_count?: number;
  track_stock?: boolean;
  is_available?: boolean;
  is_featured?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  order_index?: number;
}

export interface Category {
  id: string;
  vendor_id: string;
  name: string;
  emoji: string;
  order_index: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}
