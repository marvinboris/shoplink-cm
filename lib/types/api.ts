export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface OtpSendResponse {
  success: boolean;
  reference_id?: string;
  error?: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  vendor?: import('./vendor').Vendor;
  error?: string;
}

export interface PaymentInitResponse {
  success: boolean;
  checkout_url?: string;
  payment_id?: string;
  error?: string;
}

export interface DeliveryZone {
  city: string;
  fee: number;
  estimatedDays: string;
}

export interface VendorSubscription {
  id: string;
  vendor_id: string;
  plan: 'free' | 'starter' | 'pro';
  amount: number;
  payment_ref: string | null;
  status: 'active' | 'cancelled' | 'expired';
  started_at: string;
  expires_at: string;
}

export interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  activeProducts: number;
  todayVisitors: number;
  revenueChange: number;
  ordersChange: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TrafficSource {
  source: 'whatsapp' | 'instagram' | 'tiktok' | 'direct' | 'other';
  visits: number;
  conversions: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  unitsSold: number;
  revenue: number;
}
