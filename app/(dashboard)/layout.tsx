'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Package, ShoppingCart, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/products', icon: Package, label: 'Produits' },
  { href: '/orders', icon: ShoppingCart, label: 'Commandes' },
  { href: '/analytics', icon: BarChart3, label: 'Stats' },
  { href: '/settings', icon: Settings, label: 'Paramètres' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] bg-bg-elevated flex flex-col">
      {/* Main content */}
      <main className="flex-1 pb-20 overflow-y-auto">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bottom-nav-safe z-50 bg-bg-surface border-t border-border-subtle" style={{ boxShadow: '0 -4px 20px rgba(26,26,46,0.06)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full relative transition-all duration-120',
                  isActive ? 'text-primary' : 'text-text-3'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <div className={cn(
                  'nav-icon flex items-center justify-center rounded-[var(--radius-sm)] transition-all duration-120',
                  isActive ? 'bg-primary-soft' : 'bg-transparent'
                )}>
                  <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                </div>
                <span className="nav-label text-[10px] font-medium mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
