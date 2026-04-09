import { create } from 'zustand';
import { Vendor } from '@/lib/types';

interface VendorStore {
  vendor: Vendor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setVendor: (vendor: Vendor | null) => void;
  setLoading: (loading: boolean) => void;
  clearVendor: () => void;
}

export const useVendorStore = create<VendorStore>((set) => ({
  vendor: null,
  isAuthenticated: false,
  isLoading: true,
  setVendor: (vendor) => set({ vendor, isAuthenticated: !!vendor, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clearVendor: () => set({ vendor: null, isAuthenticated: false, isLoading: false }),
}));
