export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentMethod = 'mtn_momo' | 'orange_money' | 'wave' | 'cash';

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  vendor_id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  delivery_note: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_reference: string | null;
  payment_confirmed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface CreateOrderInput {
  vendor_id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  delivery_note?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  changed_at: string;
  note?: string;
}

export interface CatalogView {
  id: string;
  vendor_id: string;
  visitor_ip_hash: string | null;
  referrer: string | null;
  products_viewed: string[];
  converted: boolean;
  created_at: string;
}
