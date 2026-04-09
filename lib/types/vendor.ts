export type Plan = 'free' | 'starter' | 'pro';

export interface Vendor {
  id: string;
  phone: string;
  email: string | null;
  name: string;
  business_name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string;
  shop_slug: string;
  theme_config: ThemeConfig;
  plan: Plan;
  plan_expires_at: string | null;
  total_sales: number;
  commission_rate: number;
  whatsapp_number: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  created_at: string;
}

export interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  cardColor: string;
  fontFamily: string;
}

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  backgroundColor: string;
  cardColor: string;
  accentColor: string;
  preview: string;
}

export const SHOP_THEMES: Theme[] = [
  {
    id: 'sunset',
    name: 'Sunset',
    primaryColor: '#FF4D00',
    backgroundColor: '#FFF5F0',
    cardColor: '#FFFFFF',
    accentColor: '#FF6B35',
    preview: 'warm',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    primaryColor: '#0077B6',
    backgroundColor: '#F0F8FF',
    cardColor: '#FFFFFF',
    accentColor: '#00B4D8',
    preview: 'cool',
  },
  {
    id: 'forest',
    name: 'Forest',
    primaryColor: '#2D6A4F',
    backgroundColor: '#F0FFF4',
    cardColor: '#FFFFFF',
    accentColor: '#40916C',
    preview: 'green',
  },
  {
    id: 'royal',
    name: 'Royal',
    primaryColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
    cardColor: '#FFFFFF',
    accentColor: '#A855F7',
    preview: 'purple',
  },
  {
    id: 'rose',
    name: 'Rose',
    primaryColor: '#E11D48',
    backgroundColor: '#FFF1F3',
    cardColor: '#FFFFFF',
    accentColor: '#F43F5E',
    preview: 'pink',
  },
  {
    id: 'amber',
    name: 'Amber',
    primaryColor: '#D97706',
    backgroundColor: '#FFFBEB',
    cardColor: '#FFFFFF',
    accentColor: '#F59E0B',
    preview: 'gold',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    primaryColor: '#1E293B',
    backgroundColor: '#0F172A',
    cardColor: '#1E293B',
    accentColor: '#38BDF8',
    preview: 'dark',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primaryColor: '#059669',
    backgroundColor: '#ECFDF5',
    cardColor: '#FFFFFF',
    accentColor: '#10B981',
    preview: 'fresh',
  },
];
