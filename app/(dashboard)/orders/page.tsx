'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import {
  Search,
  Filter,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from 'lucide-react';
import { OrderStatus } from '@/lib/types';

const ORDERS: {
  id: string;
  customer: string;
  phone: string;
  city: string;
  items: { name: string; quantity: number; price: number; image: string }[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
}[] = [
  {
    id: 'ORD-001',
    customer: 'Aminata B.',
    phone: '+237 6XX XXX XXX',
    city: 'Douala',
    items: [
      { name: 'Robe wax taille M', quantity: 1, price: 15000, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100' },
    ],
    total: 15500,
    status: 'pending',
    paymentMethod: 'mtn_momo',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'ORD-002',
    customer: 'Carine M.',
    phone: '+237 6XX XXX XXX',
    city: 'Yaoundé',
    items: [
      { name: 'Kit beauté complet', quantity: 1, price: 8500, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100' },
      { name: 'Parfum imported', quantity: 1, price: 35000, image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=100' },
    ],
    total: 44000,
    status: 'paid',
    paymentMethod: 'orange_money',
    createdAt: new Date(Date.now() - 23 * 60000).toISOString(),
  },
  {
    id: 'ORD-003',
    customer: 'Nadège T.',
    phone: '+237 6XX XXX XXX',
    city: 'Dschang',
    items: [
      { name: 'Pagne holson', quantity: 2, price: 12000, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100' },
    ],
    total: 24500,
    status: 'processing',
    paymentMethod: 'wave',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'ORD-004',
    customer: 'Grace K.',
    phone: '+237 6XX XXX XXX',
    city: 'Bafoussam',
    items: [
      { name: 'Lace wig 360', quantity: 1, price: 45000, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100' },
    ],
    total: 45500,
    status: 'shipped',
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'ORD-005',
    customer: 'Sylvie A.',
    phone: '+237 6XX XXX XXX',
    city: 'Kribi',
    items: [
      { name: 'Sac à main cuir', quantity: 1, price: 22000, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100' },
    ],
    total: 22500,
    status: 'delivered',
    paymentMethod: 'mtn_momo',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'ORD-006',
    customer: 'Joseph N.',
    phone: '+237 6XX XXX XXX',
    city: 'Yaoundé',
    items: [
      { name: 'Parfum Chanel', quantity: 1, price: 18000, image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=100' },
    ],
    total: 18000,
    status: 'cancelled',
    paymentMethod: 'mtn_momo',
    createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  },
];

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-accent-gold/10', text: 'text-accent-gold', label: 'En attente' },
  paid: { bg: 'bg-accent-green/10', text: 'text-accent-green', label: 'Payé' },
  processing: { bg: 'bg-primary/10', text: 'text-primary', label: 'En traitement' },
  shipped: { bg: 'bg-primary/10', text: 'text-primary', label: 'Expédié' },
  delivered: { bg: 'bg-accent-green/10', text: 'text-accent-green', label: 'Livré' },
  cancelled: { bg: 'bg-danger/10', text: 'text-danger', label: 'Annulé' },
};

const COLUMNS: { id: OrderStatus; title: string; icon: React.ReactNode }[] = [
  { id: 'pending', title: 'En attente', icon: <Clock className="h-4 w-4" /> },
  { id: 'paid', title: 'Payé', icon: <CheckCircle2 className="h-4 w-4" /> },
  { id: 'processing', title: 'Traitement', icon: <Clock className="h-4 w-4" /> },
  { id: 'shipped', title: 'Expédié', icon: <Truck className="h-4 w-4" /> },
  { id: 'delivered', title: 'Livré', icon: <CheckCircle2 className="h-4 w-4" /> },
  { id: 'cancelled', title: 'Annulé', icon: <XCircle className="h-4 w-4" /> },
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const order = ORDERS.find((o) => o.id === selectedOrder);

  const filteredOrders = ORDERS.filter((o) =>
    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Commandes</h1>
          <p className="text-sm text-text-3">{ORDERS.length} commandes</p>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtrer
        </Button>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-3" />
        <Input
          placeholder="Rechercher une commande..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11"
        />
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-3 min-w-max pb-4">
          {COLUMNS.map((column) => {
            const columnOrders = filteredOrders.filter((o) => o.status === column.id);
            return (
              <div key={column.id} className="w-72 flex-shrink-0">
                <div className={`flex items-center gap-2 mb-3 px-1 ${STATUS_COLORS[column.id].text}`}>
                  {column.icon}
                  <span className="font-medium text-sm">{column.title}</span>
                  <Badge variant="default" size="sm" className="ml-auto">
                    {columnOrders.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {columnOrders.map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card
                          className={`p-3 cursor-pointer card-hover bg-bg-surface border-border-subtle ${order.status === 'cancelled' ? 'border-l-4 border-l-[#F87171]' : ''}`}
                          variant="default"
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-text-1">{order.customer}</p>
                              <p className="text-xs text-text-3">{order.city}</p>
                            </div>
                            <p className="font-outfit font-bold text-primary">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <img
                                key={idx}
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ))}
                            {order.items.length > 3 && (
                              <div className="h-10 w-10 rounded-lg bg-bg-elevated flex items-center justify-center text-xs text-text-3">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-text-3">
                              {formatRelativeTime(order.createdAt)}
                            </span>
                            <Badge
                              variant={
                                order.paymentMethod === 'cash'
                                  ? 'info'
                                  : order.paymentMethod === 'mtn_momo'
                                  ? 'warning'
                                  : 'success'
                              }
                              size="sm"
                            >
                              {order.paymentMethod === 'cash'
                                ? '💵 Cash'
                                : order.paymentMethod === 'mtn_momo'
                                ? '📱 MoMo'
                                : '📱 Orange'}
                            </Badge>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {columnOrders.length === 0 && (
                    <div className="text-center py-8 text-text-3 text-sm">
                      Aucune commande
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Detail Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Commande ${order?.id}`}
      >
        {order && (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${STATUS_COLORS[order.status].bg}`}>
                <Clock className="h-5 w-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <p className={`font-semibold ${STATUS_COLORS[order.status].text}`}>
                  {STATUS_COLORS[order.status].label}
                </p>
                <p className="text-sm text-text-3">
                  {formatRelativeTime(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-bg-elevated rounded-2xl p-4">
              <h3 className="font-semibold text-text-1 mb-3">Client</h3>
              <div className="space-y-2">
                <p className="font-medium">{order.customer}</p>
                <p className="text-sm text-text-2">{order.phone}</p>
                <p className="text-sm text-text-2">{order.city}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler
                </Button>
                <Button size="sm" className="flex-1">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold text-text-1 mb-3">Produits</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-text-1">{item.name}</p>
                      <p className="text-sm text-text-2">
                        {item.quantity}x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-border-subtle pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-text-2">Sous-total</span>
                <span>{formatPrice(order.total - 1500)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-text-2">Livraison</span>
                <span>{formatPrice(1500)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-bg-elevated rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {order.paymentMethod === 'mtn_momo'
                    ? '📱'
                    : order.paymentMethod === 'orange_money'
                    ? '📱'
                    : '💵'}
                </span>
                <span className="font-medium">
                  {order.paymentMethod === 'mtn_momo'
                    ? 'MTN Mobile Money'
                    : order.paymentMethod === 'orange_money'
                    ? 'Orange Money'
                    : 'Paiement à la livraison'}
                </span>
              </div>
              {order.paymentMethod !== 'cash' && (
                <p className="text-sm text-text-3">
                  Référence: {order.id}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {order.status === 'pending' && (
                <Button className="w-full" size="lg">
                  Confirmer le paiement
                </Button>
              )}
              {order.status === 'paid' && (
                <Button className="w-full" size="lg">
                  Commencer le traitement
                </Button>
              )}
              {order.status === 'processing' && (
                <Button className="w-full" size="lg">
                  Marquer comme expédié
                </Button>
              )}
              {order.status === 'shipped' && (
                <Button className="w-full" size="lg">
                  Confirmer la livraison
                </Button>
              )}
              {(order.status === 'pending' || order.status === 'paid') && (
                <Button variant="danger" className="w-full">
                  <XCircle className="mr-2 h-5 w-5" />
                  Annuler la commande
                </Button>
              )}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
