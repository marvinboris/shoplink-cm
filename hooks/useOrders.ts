'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Order } from '@/lib/types';

const DEMO_ORDERS: Order[] = [
  { id: 'demo-1', vendor_id: 'demo', customer_name: 'Aminata B.', customer_phone: '+237 6XX XXX XXX', customer_city: 'Douala', delivery_note: null, items: [{ product_id: '1', product_name: 'Robe wax taille M', product_image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=100', price: 15000, quantity: 1 }], subtotal: 15000, delivery_fee: 1500, total: 16500, status: 'pending', payment_method: 'mtn_momo', payment_reference: null, payment_confirmed_at: null, notes: null, created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'demo-2', vendor_id: 'demo', customer_name: 'Carine M.', customer_phone: '+237 6XX XXX XXX', customer_city: 'Yaoundé', delivery_note: null, items: [{ product_id: '2', product_name: 'Kit beauté complet', product_image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100', price: 8500, quantity: 1 }, { product_id: '4', product_name: 'Parfum imported', product_image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=100', price: 35000, quantity: 1 }], subtotal: 43500, delivery_fee: 2000, total: 45500, status: 'paid', payment_method: 'orange_money', payment_reference: null, payment_confirmed_at: null, notes: null, created_at: new Date(Date.now() - 23 * 60000).toISOString() },
  { id: 'demo-3', vendor_id: 'demo', customer_name: 'Nadège T.', customer_phone: '+237 6XX XXX XXX', customer_city: 'Dschang', delivery_note: null, items: [{ product_id: '3', product_name: 'Pagne holson', product_image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=100', price: 12000, quantity: 2 }], subtotal: 24000, delivery_fee: 3500, total: 27500, status: 'processing', payment_method: 'wave', payment_reference: null, payment_confirmed_at: null, notes: null, created_at: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'demo-4', vendor_id: 'demo', customer_name: 'Grace K.', customer_phone: '+237 6XX XXX XXX', customer_city: 'Bafoussam', delivery_note: null, items: [{ product_id: '6', product_name: 'Lace wig 360', product_image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100', price: 45000, quantity: 1 }], subtotal: 45000, delivery_fee: 3500, total: 48500, status: 'shipped', payment_method: 'cash', payment_reference: null, payment_confirmed_at: null, notes: null, created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: 'demo-5', vendor_id: 'demo', customer_name: 'Sylvie A.', customer_phone: '+237 6XX XXX XXX', customer_city: 'Kribi', delivery_note: null, items: [{ product_id: '5', product_name: 'Sac à main cuir', product_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100', price: 22000, quantity: 1 }], subtotal: 22000, delivery_fee: 3500, total: 25500, status: 'delivered', payment_method: 'mtn_momo', payment_reference: null, payment_confirmed_at: null, notes: null, created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 'demo-6', vendor_id: 'demo', customer_name: 'Joseph N.', customer_phone: '+237 6XX XXX XXX', customer_city: 'Yaoundé', delivery_note: null, items: [{ product_id: '4', product_name: 'Parfum Chanel', product_image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=100', price: 35000, quantity: 1 }], subtotal: 35000, delivery_fee: 2000, total: 37000, status: 'cancelled', payment_method: 'mtn_momo', payment_reference: null, payment_confirmed_at: null, notes: null, created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString() },
];

export function useOrders(vendorId?: string) {
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!vendorId) {
      setOrders(DEMO_ORDERS);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setOrders(data.length > 0 ? data : DEMO_ORDERS);
    } catch {
      setOrders(DEMO_ORDERS);
    }
    setLoading(false);
  }, [vendorId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    if (!vendorId) return;

    try {
      const supabase = createClient();
      await supabase.from('orders').update({ status }).eq('id', orderId);
    } catch (error) {
      console.error('Failed to update order status:', error);
      fetchOrders();
    }
  };

  const createOrder = async (order: Partial<Order>): Promise<Order | null> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .insert(order as Order)
        .select()
        .single();

      if (error) throw error;
      setOrders(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Failed to create order:', error);
      return null;
    }
  };

  return { orders, loading, refetch: fetchOrders, updateOrderStatus, createOrder };
}
