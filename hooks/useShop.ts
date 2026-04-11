'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Vendor } from '@/lib/types';

interface Shop extends Vendor {
  coverImage?: string;
  avatar?: string;
}

export function useShop(slug?: string) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShop() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error: sbError } = await supabase
          .from('vendors')
          .select('*')
          .eq('shop_slug', slug)
          .single();

        if (sbError) {
          setError(sbError.message);
          setShop(null);
        } else if (data) {
          // Map vendor data to shop format
          const shopData: Shop = {
            ...data,
            coverImage: `https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800`,
            avatar: data.avatar_url || `https://i.pravatar.cc/150?img=47`,
          };
          setShop(shopData);
        }
      } catch (e) {
        setError('Failed to fetch shop');
        setShop(null);
      }
      setLoading(false);
    }

    fetchShop();
  }, [slug]);

  return { shop, loading, error };
}
