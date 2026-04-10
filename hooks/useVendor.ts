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

const DEMO_STATS: VendorStats = {
  todayRevenue: 45000,
  todayOrders: 7,
  activeProducts: 23,
  todayVisitors: 89,
  revenueChange: 12,
  ordersChange: 15,
};

export function useVendor(vendorId?: string) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [stats, setStats] = useState<VendorStats>(DEMO_STATS);
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
        const { data: ordersData } = await supabase
          .from('orders')
          .select('total, created_at')
          .eq('vendor_id', vendorId)
          .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

        const { data: productsData } = await supabase
          .from('products')
          .select('id')
          .eq('vendor_id', vendorId)
          .eq('is_available', true);

        const { data: viewsData } = await supabase
          .from('catalog_views')
          .select('id')
          .eq('vendor_id', vendorId)
          .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

        const todayRevenue = ordersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
        const todayOrders = ordersData?.length || 0;
        const activeProducts = productsData?.length || 0;
        const todayVisitors = viewsData?.length || 0;

        setStats({
          todayRevenue,
          todayOrders,
          activeProducts,
          todayVisitors,
          revenueChange: 12,
          ordersChange: 15,
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
      const supabase = createClient();
      const { data, error } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', vendorId)
        .select()
        .single();

      if (error) throw error;
      setVendor(data);
    } catch (error) {
      console.error('Failed to update vendor:', error);
    }
  };

  return { vendor, stats, loading, updateVendor };
}
