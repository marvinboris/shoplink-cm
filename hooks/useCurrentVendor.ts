'use client';

import { useEffect } from 'react';
import { useVendorStore } from '@/lib/stores';
import type { Vendor } from '@/lib/types';

export function useCurrentVendor() {
  const { vendor, isAuthenticated, isLoading, setVendor, setLoading } = useVendorStore();

  useEffect(() => {
    function loadVendor() {
      if (vendor || isAuthenticated) return;

      setLoading(true);
      try {
        // Try to restore from localStorage (set during OTP verification)
        const stored = localStorage.getItem('shoplink_vendor');
        if (stored) {
          const parsed: Vendor = JSON.parse(stored);
          setVendor(parsed);
          return;
        }
      } catch {
        // ignore
      }
      setVendor(null);
    }

    loadVendor();
  }, [vendor, isAuthenticated, setVendor, setLoading]);

  return { vendor, isAuthenticated, isLoading };
}

