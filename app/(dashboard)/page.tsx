'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Users,
  Share2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

// Demo data
const DEMO_STATS = {
  todayRevenue: 45000,
  todayOrders: 7,
  activeProducts: 23,
  todayVisitors: 89,
  revenueChange: 12,
  ordersChange: 15,
};

const DEMO_RECENT_ORDERS = [
  {
    id: 'ORD-001',
    customer: 'Aminata B.',
    product: 'Robe wax',
    amount: 15000,
    time: 'il y a 5min',
    status: 'pending',
  },
  {
    id: 'ORD-002',
    customer: 'Carine M.',
    product: 'Kit beauté',
    amount: 8500,
    time: 'il y a 23min',
    status: 'paid',
  },
  {
    id: 'ORD-003',
    customer: 'Nadège T.',
    product: 'Pagne holson',
    amount: 12000,
    time: 'il y a 1h',
    status: 'processing',
  },
];

const ACTIVITY_FEED = [
  { icon: '📦', text: 'Nouvelle commande #ORD-001 — Aminata B.', time: '5min', color: 'primary' },
  { icon: '👁️', text: '15 visiteurs sur votre boutique', time: '12min', color: 'gold' },
  { icon: '✅', text: 'Commande #127 marquée comme livrée', time: '1h', color: 'green' },
  { icon: '💬', text: 'Nouveau message de Carine M.', time: '2h', color: 'primary' },
];

const BORDER_COLORS = {
  green: 'border-l-accent-green',
  primary: 'border-l-primary',
  gold: 'border-l-accent-gold',
};

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-text-3 text-sm">{today}</p>
          <h1 className="font-display text-2xl font-bold text-text-1">
            Marie&apos;s Closet 👋
          </h1>
        </div>
      </header>

      {/* Revenue Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="revenue-card overflow-hidden" padding="none">
          <div
            className="p-6 flex flex-col items-center justify-center text-center"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              boxShadow: 'var(--shadow-primary)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <h2 className="font-outfit text-[42px] font-bold text-white mb-2 leading-none">
              {formatPrice(DEMO_STATS.todayRevenue)}
            </h2>
            <div className="flex items-center gap-1 text-white/90 text-[15px] font-medium">
              {DEMO_STATS.revenueChange > 0 ? (
                <>
                  <TrendingUp className="h-5 w-5" />
                  <span>+{DEMO_STATS.revenueChange}% vs hier</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-5 w-5" />
                  <span>{DEMO_STATS.revenueChange}% vs hier</span>
                </>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="text-center p-4 bg-bg-surface border border-border-subtle" variant="default">
            <div className="h-10 w-10 rounded-full bg-primary-soft mx-auto mb-2 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <p className="font-outfit text-2xl font-bold text-text-1">{DEMO_STATS.todayOrders}</p>
            <p className="text-xs text-text-3">Commandes</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="text-center p-4 bg-bg-surface border border-border-subtle" variant="default">
            <div className="h-10 w-10 rounded-full bg-accent-green/10 mx-auto mb-2 flex items-center justify-center">
              <Package className="h-5 w-5 text-accent-green" />
            </div>
            <p className="font-outfit text-2xl font-bold text-text-1">{DEMO_STATS.activeProducts}</p>
            <p className="text-xs text-text-3">Produits</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="text-center p-4 bg-bg-surface border border-border-subtle" variant="default">
            <div className="h-10 w-10 rounded-full bg-accent-gold/10 mx-auto mb-2 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent-gold" />
            </div>
            <p className="font-outfit text-2xl font-bold text-text-1">{DEMO_STATS.todayVisitors}</p>
            <p className="text-xs text-text-3">Visiteurs</p>
          </Card>
        </motion.div>
      </div>

      {/* Pending Orders Alert */}
      {DEMO_RECENT_ORDERS.filter((o) => o.status === 'pending').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-bg-surface border border-danger/20" variant="default">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-danger/10 flex items-center justify-center animate-pulse">
                <ShoppingCart className="h-4 w-4 text-danger" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text-1">
                  {DEMO_RECENT_ORDERS.filter((o) => o.status === 'pending').length} commande(s) en attente
                </p>
                <p className="text-xs text-text-3">d&apos;approbation</p>
              </div>
              <Badge variant="danger" pulse>+3</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Voir les commandes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-text-1">
            Dernières commandes
          </h2>
          <Button variant="ghost" size="sm" className="text-primary">
            Tout voir
          </Button>
        </div>
        <div className="space-y-3">
          {DEMO_RECENT_ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Card className="p-4 bg-bg-surface card-hover" hover>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-bg-elevated flex items-center justify-center text-lg">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-text-1 truncate">{order.customer}</p>
                      <Badge
                        variant={
                          order.status === 'pending'
                            ? 'warning'
                            : order.status === 'paid'
                            ? 'success'
                            : 'info'
                        }
                        size="sm"
                      >
                        {order.status === 'pending'
                          ? 'En attente'
                          : order.status === 'paid'
                          ? 'Payé'
                          : 'En traitement'}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-2 truncate">{order.product}</p>
                    <p className="text-xs text-text-3">{order.time}</p>
                  </div>
                  <p className="font-outfit font-bold text-text-1">
                    {formatPrice(order.amount)}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-display text-lg font-bold text-text-1 mb-3">
          Activité récente
        </h2>
        <Card className="p-4 bg-bg-surface border border-border-subtle" variant="default">
          <div className="space-y-3">
            {ACTIVITY_FEED.map((activity, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 text-sm border-l-[3px] pl-3 rounded-r ${BORDER_COLORS[activity.color as keyof typeof BORDER_COLORS]} bg-bg-elevated`}
              >
                <span className="text-lg">{activity.icon}</span>
                <p className="flex-1 text-text-2">{activity.text}</p>
                <span className="text-text-3 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Share Button - Floating */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-24 right-4"
      >
        <Button className="rounded-full shadow-primary h-14 px-6 gap-2 press-effect">
          <Share2 className="h-5 w-5" />
          <span>Partager ma boutique</span>
        </Button>
      </motion.div>

      {/* WhatsApp Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.65 }}
        className="fixed bottom-24 left-4"
      >
        <Button
          variant="success"
          className="rounded-full shadow-warm-lg h-14 w-14 p-0 press-effect"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
