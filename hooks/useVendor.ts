'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Vendor } from '@/lib/types';

interface VendorStats {
  todayRevenue: number;
  todayOrders: number;
  activeProducts: number;
  todayVisitors: number;
  revenueChange: number;
  ordersChange: number;
}

export function useVendor(vendorId?: string) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [stats, setStats] = useState<VendorStats>({
    todayRevenue: 0,
    todayOrders: 0,
    activeProducts: 0,
    todayVisitors: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendor() {
      if (!vendorId) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();

        const { data: vendorData, error: vendorError } = await supabase
          .from('vendors')
          .select('*')
          .eq('id', vendorId)
          .single();

        if (vendorError) throw vendorError;
        setVendor(vendorData);

        // Fetch stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: ordersData } = await supabase
          .from('orders')
          .select('total, created_at')
          .eq('vendor_id', vendorId)
          .gte('created_at', today.toISOString());

        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendorId)
          .eq('is_available', true);

        const { count: viewsCount } = await supabase
          .from('catalog_views')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendorId)
          .gte('created_at', today.toISOString());

        const todayRevenue = ordersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
        const todayOrders = ordersData?.length || 0;
        const activeProducts = productsCount || 0;
        const todayVisitors = viewsCount || 0;

        setStats({
          todayRevenue,
          todayOrders,
          activeProducts,
          todayVisitors,
          revenueChange: 0,
          ordersChange: 0,
        });
      } catch (error) {
        console.error('Failed to fetch vendor:', error);
      }
      setLoading(false);
    }

    fetchVendor();
  }, [vendorId]);

  const updateVendor = async (updates: Partial<Vendor>) => {
    if (!vendorId || !vendor) return;

    try {
      // Use API route for proper cookie auth
      const res = await fetch('/api/vendors/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Update failed');
      }

      const { data } = await res.json();
      if (data) setVendor(data);
    } catch (error) {
      console.error('Failed to update vendor:', error);
      throw error;
    }
  };

  return { vendor, stats, loading, updateVendor };
}
