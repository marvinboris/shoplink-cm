'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  XCircle,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  product_image?: string;
}

interface Order {
  id: string;
  vendor_id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address?: string;
  delivery_note?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  payment_method: string;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
  vendor?: {
    name: string;
    shop_slug: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'warning' | 'success' | 'danger' }> = {
  pending: { label: 'En attente', variant: 'warning' },
  paid: { label: 'Payé', variant: 'success' },
  processing: { label: 'En traitement', variant: 'default' },
  shipped: { label: 'Expédié', variant: 'default' },
  delivered: { label: 'Livré', variant: 'success' },
  cancelled: { label: 'Annulé', variant: 'danger' },
};

const PAYMENT_LABELS: Record<string, string> = {
  mtn_momo: 'MTN Mobile Money',
  orange_money: 'Orange Money',
  cash: 'Paiement à la livraison',
  wave: 'Wave',
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { addToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*, vendor: vendors(name, shop_slug)')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return;
      }

      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);

    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (!error) {
      setOrder({ ...order, status: newStatus });
      addToast('Statut mis à jour');
    } else {
      addToast('Erreur lors de la mise à jour', 'error');
    }
    setUpdating(false);
  };

  const sendWhatsApp = () => {
    if (!order?.customer_phone) return;
    const message = encodeURIComponent(
      `Bonjour ${order.customer_name}, concernant votre commande ${order.id.slice(0, 8)}...`
    );
    window.open(
      `https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${message}`,
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Commande non trouvée</p>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">
            Commande {order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-500">
            {new Date(order.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <Badge variant={statusConfig.variant} size="md">
          {statusConfig.label}
        </Badge>
      </div>

      {/* Vendor Info */}
      {order.vendor && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold">{order.vendor.name}</p>
                <a
                  href={`/boutique/${order.vendor.shop_slug}`}
                  target="_blank"
                  className="text-sm text-[#FF4D00] hover:underline flex items-center gap-1"
                >
                  Voir la boutique <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Customer Info */}
      <Card className="p-5">
        <h2 className="font-display font-bold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Client
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{order.customer_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <a href={`tel:${order.customer_phone}`} className="text-[#FF4D00] hover:underline">
              {order.customer_phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{order.customer_city}</span>
          </div>
          {order.customer_address && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{order.customer_address}</span>
            </div>
          )}
          {order.delivery_note && (
            <div className="mt-2 p-3 bg-gray-50 rounded-xl text-sm">
              <span className="text-gray-500">Note: </span>
              {order.delivery_note}
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`tel:${order.customer_phone}`)}
            >
              <Phone className="mr-2 h-4 w-4" />
              Appeler
            </Button>
            <Button size="sm" onClick={sendWhatsApp}>
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>
      </Card>

      {/* Products */}
      <Card className="p-5">
        <h2 className="font-display font-bold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Produits ({order.items?.length || 0})
        </h2>
        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <img
                src={item.product_image || 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=100'}
                alt={item.name}
                className="h-14 w-14 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} x {formatPrice(item.price)}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.quantity * item.price)}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sous-total</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Livraison</span>
            <span>{formatPrice(order.delivery_fee)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-2">
            <span>Total</span>
            <span className="text-[#FF4D00]">{formatPrice(order.total)}</span>
          </div>
        </div>
      </Card>

      {/* Payment */}
      <Card className="p-5">
        <h2 className="font-display font-bold mb-4 flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Paiement
        </h2>
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {PAYMENT_LABELS[order.payment_method] || order.payment_method}
          </span>
          {order.payment_reference && (
            <Badge variant="default" size="sm">
              Réf: {order.payment_reference}
            </Badge>
          )}
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-5">
        <h2 className="font-display font-bold mb-4">Actions</h2>
        <div className="space-y-4">
          {/* Status Change */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Changer le statut</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CONFIG)
                .filter(([key]) => key !== order.status)
                .map(([key, config]) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus(key)}
                    disabled={updating}
                  >
                    {config.label}
                  </Button>
                ))}
            </div>
          </div>

          <Button className="w-full" onClick={sendWhatsApp}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Envoyer WhatsApp au client
          </Button>

          {(order.status === 'pending' || order.status === 'paid') && (
            <Button
              variant="danger"
              className="w-full"
              onClick={() => updateStatus('cancelled')}
              disabled={updating}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Annuler la commande
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
