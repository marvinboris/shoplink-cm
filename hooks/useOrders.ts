'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Order } from '@/lib/types';

export function useOrders(vendorId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!vendorId) {
      setOrders([]);
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
      setOrders(data || []);
    } catch {
      setOrders([]);
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
