'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { useToast } from '@/components/ui/toast';
import { useCurrentVendor } from '@/hooks/useCurrentVendor';
import { useOrders } from '@/hooks/useOrders';
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
import type { OrderStatus } from '@/lib/types';

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

const ALL_STATUSES: { id: OrderStatus; label: string }[] = [
  { id: 'pending', label: 'En attente' },
  { id: 'paid', label: 'Payé' },
  { id: 'processing', label: 'Traitement' },
  { id: 'shipped', label: 'Expédié' },
  { id: 'delivered', label: 'Livré' },
  { id: 'cancelled', label: 'Annulé' },
];

const PAYMENT_LABELS: Record<string, string> = {
  mtn_momo: '📱 MoMo',
  orange_money: '📱 Orange',
  cash: '💵 Cash',
  wave: '💵 Wave',
};

export default function OrdersPage() {
  const { vendor } = useCurrentVendor();
  const { orders, updateOrderStatus } = useOrders(vendor?.id);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<OrderStatus[]>([]);
  const { addToast } = useToast();

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const toggleFilter = (status: OrderStatus) => {
    setActiveFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(o.status);
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrderId) return;
    await updateOrderStatus(selectedOrderId, newStatus);
    setSelectedOrderId(null);
    addToast('Statut mis à jour');
  };

  const handleWhatsApp = () => {
    if (!selectedOrder) return;
    const message = encodeURIComponent(`Bonjour ${selectedOrder.customer_name}, concernant votre commande ${selectedOrder.id}...`);
    window.open(`https://wa.me/${selectedOrder.customer_phone || '237690000001'}?text=${message}`, '_blank');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Commandes</h1>
          <p className="text-sm text-text-3">{orders.length} commandes</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
          <Filter className="mr-2 h-4 w-4" />
          Filtrer
          {activeFilters.length > 0 && (
            <Badge variant="default" size="sm" className="ml-2 bg-primary text-white">
              {activeFilters.length}
            </Badge>
          )}
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
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-text-1">{order.customer_name}</p>
                              <p className="text-xs text-text-3">{order.customer_city}</p>
                            </div>
                            <p className="font-outfit font-bold text-primary">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <img
                                key={idx}
                                src={item.product_image || 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=100'}
                                alt={item.product_name}
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
                              {formatRelativeTime(order.created_at)}
                            </span>
                            <Badge
                              variant={
                                order.payment_method === 'cash'
                                  ? 'info'
                                  : order.payment_method === 'mtn_momo'
                                  ? 'warning'
                                  : 'success'
                              }
                              size="sm"
                            >
                              {PAYMENT_LABELS[order.payment_method] || order.payment_method}
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

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtrer par statut"
      >
        <div className="space-y-3">
          {ALL_STATUSES.map((status) => (
            <label
              key={status.id}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                activeFilters.includes(status.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-bg-elevated'
              }`}
            >
              <input
                type="checkbox"
                checked={activeFilters.includes(status.id)}
                onChange={() => toggleFilter(status.id)}
                className="sr-only"
              />
              <div
                className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                  activeFilters.includes(status.id)
                    ? 'border-primary bg-primary'
                    : 'border-border-subtle'
                }`}
              >
                {activeFilters.includes(status.id) && (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                )}
              </div>
              <span className="font-semibold text-text-1">{status.label}</span>
            </label>
          ))}
          <Button className="w-full mt-4" onClick={applyFilters}>
            Appliquer ({activeFilters.length === 0 ? 'Tous' : `${activeFilters.length} sélectionné(s)`})
          </Button>
        </div>
      </BottomSheet>

      {/* Order Detail Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        title={`Commande ${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${STATUS_COLORS[selectedOrder.status].bg}`}>
                <Clock className="h-5 w-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <p className={`font-semibold ${STATUS_COLORS[selectedOrder.status].text}`}>
                  {STATUS_COLORS[selectedOrder.status].label}
                </p>
                <p className="text-sm text-text-3">
                  {formatRelativeTime(selectedOrder.created_at)}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-bg-elevated rounded-2xl p-4">
              <h3 className="font-semibold text-text-1 mb-3">Client</h3>
              <div className="space-y-2">
                <p className="font-medium">{selectedOrder.customer_name}</p>
                <p className="text-sm text-text-2">{selectedOrder.customer_phone}</p>
                <p className="text-sm text-text-2">{selectedOrder.customer_city}</p>
                {selectedOrder.delivery_note && (
                  <p className="text-sm text-text-2">📍 {selectedOrder.delivery_note}</p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => window.open(`tel:${selectedOrder.customer_phone}`)}
                  className="flex-1 flex items-center justify-center h-9 px-4 rounded-lg border border-border-subtle text-sm font-semibold text-text-1 hover:bg-bg-elevated transition-colors bg-bg-surface"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler
                </button>
                <Button size="sm" className="flex-1" onClick={handleWhatsApp}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold text-text-1 mb-3">Produits</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.product_image || 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=100'}
                      alt={item.product_name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-text-1">{item.product_name}</p>
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
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-text-2">Livraison</span>
                <span>{formatPrice(selectedOrder.delivery_fee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-bg-elevated rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{PAYMENT_LABELS[selectedOrder.payment_method] || '💵'}</span>
                <span className="font-medium">
                  {selectedOrder.payment_method === 'mtn_momo' ? 'MTN Mobile Money'
                    : selectedOrder.payment_method === 'orange_money' ? 'Orange Money'
                    : selectedOrder.payment_method === 'wave' ? 'Wave'
                    : 'Paiement à la livraison'}
                </span>
              </div>
              {selectedOrder.payment_reference && (
                <p className="text-sm text-text-3">
                  Référence: {selectedOrder.payment_reference}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {/* Status Change */}
              <div>
                <p className="text-sm font-semibold text-text-2 mb-2">Changer le statut</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.filter(s => s.id !== selectedOrder.status).map((status) => (
                    <Button
                      key={status.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(status.id)}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* WhatsApp Button */}
              <Button className="w-full" onClick={handleWhatsApp}>
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp client
              </Button>

              {/* Cancel */}
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'paid') && (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => handleStatusChange('cancelled')}
                >
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
