'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

const DEMO_PRODUCTS: Product[] = [
  { id: '1', vendor_id: 'demo', name: 'Robe wax taille M', description: null, price: 15000, compare_price: 20000, images: ['https://images.unsplash.com/photo-1551803091-e20673f15770?w=400'], category: 'Robes', tags: [], stock_count: 5, track_stock: true, is_available: true, is_featured: true, order_index: 0, created_at: '' },
  { id: '2', vendor_id: 'demo', name: 'Kit beauté complet', description: null, price: 8500, compare_price: null, images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'], category: 'Beauté', tags: [], stock_count: 12, track_stock: true, is_available: true, is_featured: false, order_index: 1, created_at: '' },
  { id: '3', vendor_id: 'demo', name: 'Pagne holson 6 yards', description: null, price: 12000, compare_price: 15000, images: ['https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400'], category: 'Tissus', tags: [], stock_count: 0, track_stock: true, is_available: false, is_featured: false, order_index: 2, created_at: '' },
  { id: '4', vendor_id: 'demo', name: 'Parfum Chanel imported', description: null, price: 35000, compare_price: 45000, images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400'], category: 'Beauté', tags: [], stock_count: 3, track_stock: true, is_available: true, is_featured: true, order_index: 3, created_at: '' },
  { id: '5', vendor_id: 'demo', name: 'Sac à main cuir', description: null, price: 22000, compare_price: null, images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'], category: 'Accessoires', tags: [], stock_count: 8, track_stock: true, is_available: true, is_featured: false, order_index: 4, created_at: '' },
  { id: '6', vendor_id: 'demo', name: 'Lace wig 360 frontal', description: null, price: 45000, compare_price: 55000, images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'], category: 'Perruques', tags: [], stock_count: 2, track_stock: true, is_available: true, is_featured: false, order_index: 5, created_at: '' },
];

export function useProducts(vendorId?: string, options?: { availableOnly?: boolean; category?: string }) {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!vendorId) {
      setProducts(DEMO_PRODUCTS);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      let query = supabase
        .from('products')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('order_index');

      if (options?.availableOnly) {
        query = query.eq('is_available', true);
      }
      if (options?.category && options.category !== 'Tout') {
        query = query.eq('category', options.category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data.length > 0 ? data : DEMO_PRODUCTS);
    } catch {
      setProducts(DEMO_PRODUCTS);
    }
    setLoading(false);
  }, [vendorId, options?.availableOnly, options?.category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

    if (!vendorId) return; // Demo mode

    try {
      const supabase = createClient();
      await supabase.from('products').update(updates).eq('id', id);
    } catch (error) {
      console.error('Failed to update product:', error);
      fetchProducts(); // Revert on error
    }
  };

  return { products, loading, refetch: fetchProducts, updateProduct };
}
