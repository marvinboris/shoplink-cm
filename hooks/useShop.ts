'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Vendor } from '@/lib/types';

const DEMO_SHOP = {
  slug: 'maries-closet',
  name: "Marie's Closet",
  bio: 'Mode & Beauté | Livraison Douala & Yaoundé | Paiement Mobile Money ✓',
  whatsapp: '+237690000001',
  coverImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
  avatar: 'https://i.pravatar.cc/150?img=47',
};

export function useShop(slug?: string) {
  const [shop, setShop] = useState<(Vendor & typeof DEMO_SHOP) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShop() {
      if (!slug) {
        // Use demo shop
        setShop(DEMO_SHOP as Vendor & typeof DEMO_SHOP);
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
          // Fallback to demo
          setShop(DEMO_SHOP as Vendor & typeof DEMO_SHOP);
        } else {
          setShop({ ...data, ...DEMO_SHOP });
        }
      } catch {
        setShop(DEMO_SHOP as Vendor & typeof DEMO_SHOP);
      }
      setLoading(false);
    }

    fetchShop();
  }, [slug]);

  return { shop, loading, error };
}
