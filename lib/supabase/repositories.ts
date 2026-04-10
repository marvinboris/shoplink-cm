import { createClient } from '@/lib/supabase/client';
import type { Vendor, Product, Order, Category } from '@/lib/types';

// ============== VENDORS ==============

export async function getVendorBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('shop_slug', slug)
    .single();

  if (error) throw error;
  return data as Vendor;
}

export async function getVendorById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Vendor;
}

export async function getVendorByPhone(phone: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Vendor | null;
}

export async function createVendor(vendor: Partial<Vendor>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vendors')
    .insert(vendor)
    .select()
    .single();

  if (error) throw error;
  return data as Vendor;
}

export async function updateVendor(id: string, updates: Partial<Vendor>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vendors')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Vendor;
}

// ============== PRODUCTS ==============

export async function getProductsByVendor(vendorId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data as Product[];
}

export async function getAvailableProducts(vendorId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('vendor_id', vendorId)
    .eq('is_available', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data as Product[];
}

export async function getProductById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function createProduct(product: Partial<Product>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ============== ORDERS ==============

export async function getOrdersByVendor(vendorId: string, limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Order[];
}

export async function getOrderById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Order;
}

export async function createOrder(order: Partial<Order>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...(status === 'paid' ? { payment_confirmed_at: new Date().toISOString() } : {}),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

// ============== ANALYTICS ==============

export async function getOrderStats(vendorId: string, days: number) {
  const supabase = createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('vendor_id', vendorId)
    .gte('created_at', startDate.toISOString());

  if (error) throw error;
  return data as Order[];
}

export async function getCatalogViews(vendorId: string, days: number) {
  const supabase = createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('catalog_views')
    .select('*')
    .eq('vendor_id', vendorId)
    .gte('created_at', startDate.toISOString());

  if (error) throw error;
  return data;
}

export async function recordCatalogView(
  vendorId: string,
  visitorIpHash: string,
  referrer: string
) {
  const supabase = createClient();
  const { error } = await supabase.from('catalog_views').insert({
    vendor_id: vendorId,
    visitor_ip_hash: visitorIpHash,
    referrer,
  });
  if (error) console.error('Failed to record catalog view:', error);
}

// ============== CATEGORIES ==============

export async function getCategoriesByVendor(vendorId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data as Category[];
}
