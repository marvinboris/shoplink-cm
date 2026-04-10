'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrentVendor } from '@/hooks/useCurrentVendor';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice } from '@/lib/utils';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Period = '7j' | '30j' | '90j';

const DEMO_CHART_DATA: Record<Period, { date: string; revenue: number; orders: number }[]> = {
  '7j': [
    { date: 'Lun', revenue: 45000, orders: 5 },
    { date: 'Mar', revenue: 62000, orders: 8 },
    { date: 'Mer', revenue: 38000, orders: 4 },
    { date: 'Jeu', revenue: 75000, orders: 9 },
    { date: 'Ven', revenue: 92000, orders: 12 },
    { date: 'Sam', revenue: 115000, orders: 15 },
    { date: 'Dim', revenue: 55000, orders: 7 },
  ],
  '30j': [
    { date: 'Sem 1', revenue: 320000, orders: 42 },
    { date: 'Sem 2', revenue: 285000, orders: 38 },
    { date: 'Sem 3', revenue: 410000, orders: 55 },
    { date: 'Sem 4', revenue: 375000, orders: 48 },
  ],
  '90j': [
    { date: 'Jan', revenue: 1250000, orders: 165 },
    { date: 'Fév', revenue: 1420000, orders: 188 },
    { date: 'Mar', revenue: 1680000, orders: 215 },
  ],
};

const HOUR_HEATMAP = [
  { hour: '6h', intensity: 15 }, { hour: '7h', intensity: 20 }, { hour: '8h', intensity: 25 },
  { hour: '9h', intensity: 25 }, { hour: '10h', intensity: 45 }, { hour: '11h', intensity: 60 },
  { hour: '12h', intensity: 50 }, { hour: '13h', intensity: 30 }, { hour: '14h', intensity: 30 },
  { hour: '15h', intensity: 50 }, { hour: '16h', intensity: 60 }, { hour: '17h', intensity: 65 },
  { hour: '18h', intensity: 85 }, { hour: '19h', intensity: 100 }, { hour: '20h', intensity: 90 },
  { hour: '21h', intensity: 40 }, { hour: '22h', intensity: 30 }, { hour: '23h', intensity: 20 },
];

export default function AnalyticsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('7j');
  const { vendor } = useCurrentVendor();
  const { orders } = useOrders(vendor?.id);

  const currentData = DEMO_CHART_DATA[period];

  const { totalRevenue, totalOrders, avgOrder, topProducts } = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const revenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const orderCount = validOrders.length;
    const avg = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

    // Compute top products by quantity sold
    const productMap: Record<string, { name: string; image: string; sold: number; revenue: number }> = {};
    for (const order of validOrders) {
      for (const item of order.items) {
        if (!productMap[item.product_id]) {
          productMap[item.product_id] = {
            name: item.product_name,
            image: item.product_image || '',
            sold: 0,
            revenue: 0,
          };
        }
        productMap[item.product_id].sold += item.quantity;
        productMap[item.product_id].revenue += item.price * item.quantity;
      }
    }
    const top = Object.entries(productMap)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([id, data]) => ({ id, ...data }));

    return { totalRevenue: revenue, totalOrders: orderCount, avgOrder: avg, topProducts: top };
  }, [orders]);

  const visitors = orders.length * 4; // rough estimate

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

          {/* Bar Chart using Recharts */}
          <div style={{ height: '200px' }} className="w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E3DC" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis
                  hide={true}
                  domain={[0, period === '7j' ? 135000 : period === '30j' ? 500000 : 2000000]}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 77, 0, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(26, 26, 46, 0.08)' }}
                  formatter={(value) => [`${formatPrice(Number(value))}`, 'Revenu']}
                  labelStyle={{ fontWeight: 'bold', color: '#1A1A2E', marginBottom: '4px' }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#FF4D00"
                  radius={[6, 6, 0, 0]}
                  activeBar={{ fill: '#D93D00' }}
                />
              </BarChart>
            </ResponsiveContainer>
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
            <p className="font-outfit text-2xl font-bold">{formatPrice(avgOrder)}</p>
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
            <p className="font-outfit text-2xl font-bold">{visitors}</p>
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
            <p className="font-outfit text-2xl font-bold">3.5%</p>
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
          <p className="text-sm text-text-3 text-center py-4">
            Les données de trafic seront bientôt disponibles
          </p>
        </Card>
      </motion.div>

      {/* Peak Hours Heatmap Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-5 bg-bg-surface border-border-subtle" variant="default">
          <h3 className="font-display font-bold text-text-1 mb-4">Heures de pointe</h3>
          <div style={{ height: '200px' }} className="w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOUR_HEATMAP} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  interval={2}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(26, 26, 46, 0.08)' }}
                  formatter={(value) => [`${value} commandes`, 'Activité']}
                  labelStyle={{ fontWeight: 'bold', color: '#1A1A2E' }}
                />
                <Bar dataKey="intensity" radius={[4, 4, 0, 0]} maxBarSize={40} activeBar={{ fill: '#D93D00', opacity: 1 }}>
                  {HOUR_HEATMAP.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.intensity >= 85 ? 'var(--primary)' : `rgba(255, 77, 0, ${Math.max(0.15, entry.intensity / 100)})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm text-text-2 mt-2">
            Pic de commandes entre <span className="font-semibold text-primary">18h - 20h</span>
          </p>
        </Card>
      </motion.div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Card className="p-5 bg-bg-surface border-border-subtle" variant="default">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-text-1">Top produits</h3>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => router.push('/products')}>
              Tout voir
            </Button>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold text-text-3 w-6">#{i + 1}</span>
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=100'}
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
          ) : (
            <p className="text-sm text-text-3 text-center py-4">Aucune donnée encore</p>
          )}
        </Card>
      </motion.div>

    </div>
  );
}
