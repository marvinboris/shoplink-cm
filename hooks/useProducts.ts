'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

export function useProducts(vendorId?: string, options?: { availableOnly?: boolean; category?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!vendorId) {
      setProducts([]);
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
      setProducts(data || []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [vendorId, options?.availableOnly, options?.category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

    if (!vendorId) return;

    try {
      const supabase = createClient();
      await supabase.from('products').update(updates).eq('id', id);
    } catch (error) {
      console.error('Failed to update product:', error);
      fetchProducts(); // Revert on error
    }
  };

  const deleteProduct = async (id: string) => {
    if (!vendorId) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('vendor_id', vendorId); // Security: only delete own products

      if (error) throw error;

      // Optimistic update
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  };

  const createProduct = async (product: Partial<Product>) => {
    if (!vendorId) return null;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .insert({ ...product, vendor_id: vendorId })
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Failed to create product:', error);
      return null;
    }
  };

  return { products, loading, refetch: fetchProducts, updateProduct, deleteProduct, createProduct };
}
