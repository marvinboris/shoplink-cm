'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';

// Demo data
const REVENUE_DATA = [
  { date: 'Lun', revenue: 45000, orders: 5 },
  { date: 'Mar', revenue: 62000, orders: 8 },
  { date: 'Mer', revenue: 38000, orders: 4 },
  { date: 'Jeu', revenue: 75000, orders: 9 },
  { date: 'Ven', revenue: 92000, orders: 12 },
  { date: 'Sam', revenue: 115000, orders: 15 },
  { date: 'Dim', revenue: 55000, orders: 7 },
];

const TOP_PRODUCTS = [
  { name: 'Robe wax taille M', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100', sold: 23, revenue: 345000 },
  { name: 'Kit beauté complet', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100', sold: 18, revenue: 153000 },
  { name: 'Parfum imported', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=100', sold: 12, revenue: 420000 },
  { name: 'Lace wig 360', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100', sold: 8, revenue: 360000 },
  { name: 'Sac à main cuir', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100', sold: 6, revenue: 132000 },
];

const TRAFFIC_SOURCES = [
  { source: 'whatsapp', label: 'WhatsApp', icon: '💬', visits: 342, conversions: 28, color: 'bg-green-500' },
  { source: 'instagram', label: 'Instagram', icon: '📷', visits: 189, conversions: 12, color: 'bg-pink-500' },
  { source: 'tiktok', label: 'TikTok', icon: '🎵', visits: 156, conversions: 8, color: 'bg-black' },
  { source: 'direct', label: 'Direct', icon: '🌐', visits: 89, conversions: 15, color: 'bg-blue-500' },
];

const HOUR_HEATMAP: [string, number][] = [
  ['6h', 0], ['7h', 2], ['8h', 5], ['9h', 8], ['10h', 12], ['11h', 15],
  ['12h', 10], ['13h', 8], ['14h', 6], ['15h', 10], ['16h', 14], ['17h', 18],
  ['18h', 22], ['19h', 25], ['20h', 20], ['21h', 15], ['22h', 8], ['23h', 3],
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7j' | '30j' | '90j'>('7j');

  const totalRevenue = REVENUE_DATA.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = REVENUE_DATA.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const conversionRate = (TRAFFIC_SOURCES.reduce((sum, s) => sum + s.conversions, 0) / TRAFFIC_SOURCES.reduce((sum, s) => sum + s.visits, 0)) * 100;

  const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.revenue));

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Analytics</h1>
          <p className="text-sm text-text-3">Performance de votre boutique</p>
        </div>
        <div className="flex gap-1 bg-bg-elevated rounded-2xl p-1">
          {(['7j', '30j', '90j'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-120 press-effect ${
                period === p ? 'bg-primary text-white' : 'text-text-2 hover:text-text-1'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-5 bg-bg-surface border-border-subtle" variant="default">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-text-2 text-sm mb-1">Revenus totaux</p>
              <h2 className="font-outfit text-3xl font-bold text-text-1">
                {formatPrice(totalRevenue)}
              </h2>
            </div>
            <div className="flex items-center gap-1 text-accent-green">
              <ArrowUpRight className="h-5 w-5" />
              <span className="font-semibold">+18%</span>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-40">
            {REVENUE_DATA.map((d, i) => (
              <motion.div
                key={d.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs text-text-3 mb-1">
                    {formatPrice(d.revenue).replace('FCFA', '').trim()}
                  </span>
                  <div className="w-full bg-bg-elevated rounded-t-lg relative" style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: '8px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{ delay: i * 0.05 + 0.2, duration: 0.5 }}
                      className="absolute inset-0 bg-primary rounded-t-lg"
                    />
                  </div>
                </div>
                <span className="text-xs text-text-3">{d.date}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-bg-surface border-border-subtle" variant="default">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <span className="text-text-2 text-sm">Commandes</span>
            </div>
            <p className="font-outfit text-2xl font-bold">{totalOrders}</p>
            <div className="flex items-center gap-1 text-accent-green text-sm">
              <ArrowUpRight className="h-4 w-4" />
              +12%
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-4 bg-bg-surface border-border-subtle" variant="default">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-accent-green/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-accent-green" />
              </div>
              <span className="text-text-2 text-sm">Panier moyen</span>
            </div>
            <p className="font-outfit text-2xl font-bold">{formatPrice(avgOrderValue)}</p>
            <div className="flex items-center gap-1 text-accent-green text-sm">
              <ArrowUpRight className="h-4 w-4" />
              +8%
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-bg-surface border-border-subtle" variant="default">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-accent-gold/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-accent-gold" />
              </div>
              <span className="text-text-2 text-sm">Visiteurs</span>
            </div>
            <p className="font-outfit text-2xl font-bold">776</p>
            <div className="flex items-center gap-1 text-accent-green text-sm">
              <ArrowUpRight className="h-4 w-4" />
              +24%
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="p-4 bg-bg-surface border-border-subtle" variant="default">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-accent-green/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent-green" />
              </div>
              <span className="text-text-2 text-sm">Conversion</span>
            </div>
            <p className="font-outfit text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
            <div className="flex items-center gap-1 text-accent-green text-sm">
              <ArrowUpRight className="h-4 w-4" />
              +2%
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Traffic Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-5 bg-bg-surface border-border-subtle" variant="default">
          <h3 className="font-display font-bold text-text-1 mb-4">Sources de trafic</h3>
          <div className="space-y-4">
            {TRAFFIC_SOURCES.map((source) => {
              return (
                <div key={source.source} className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full ${source.color} flex items-center justify-center text-xl`}>
                    {source.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{source.label}</span>
                      <span className="text-sm text-text-2">{source.visits} visits</span>
                    </div>
                    <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                      <div
                        className={`h-full ${source.color} rounded-full`}
                        style={{ width: `${(source.visits / 342) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    {((source.conversions / source.visits) * 100).toFixed(0)}%
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="p-5 bg-bg-surface border-border-subtle" variant="default">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-text-1">Top produits</h3>
            <Button variant="ghost" size="sm" className="text-primary">Tout voir</Button>
          </div>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className="text-lg font-bold text-text-3 w-6">#{i + 1}</span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-1 truncate">{product.name}</p>
                  <p className="text-sm text-text-2">{product.sold} vendus</p>
                </div>
                <p className="font-outfit font-bold text-text-1">
                  {formatPrice(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Peak Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-5 bg-bg-surface border-border-subtle" variant="default">
          <h3 className="font-display font-bold text-text-1 mb-4">Heures de pointe</h3>
          <div className="grid grid-cols-6 gap-2">
            {HOUR_HEATMAP.map(([hour, intensity]) => (
              <div key={hour} className="text-center">
                <div
                  className="h-8 rounded-lg mb-1 transition-colors"
                  style={{
                    backgroundColor: `rgba(255, 77, 0, ${intensity / 25})`,
                  }}
                />
                <span className="text-xs text-text-3">{hour}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-text-2 mt-4">
            Pic de commandes entre <span className="font-semibold text-primary">18h - 20h</span>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
