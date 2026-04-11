'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Truck,
  Package,
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  vendor_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_fee: number;
  created_at: string;
  updated_at: string;
  vendor: {
    name: string;
    shop_slug: string;
  };
}

const STATUS_CONFIG = {
  pending: { label: 'En attente', variant: 'warning' as const, icon: Package },
  processing: { label: 'En préparation', variant: 'default' as const, icon: Package },
  shipped: { label: 'Expédiée', variant: 'default' as const, icon: Truck },
  delivered: { label: 'Livrée', variant: 'success' as const, icon: CheckCircle },
  cancelled: { label: 'Annulée', variant: 'danger' as const, icon: XCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('orders')
        .select('*, vendor: vendors(name, shop_slug)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.vendor?.name?.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && order.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Commandes</h1>
        <p className="text-gray-500 mt-1">{orders.length} commande(s)</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher une commande..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={statusFilter === 'all' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Tous
          </Button>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <Button
              key={key}
              variant={statusFilter === key ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(key)}
            >
              {config.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Aucune commande trouvée</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const status = STATUS_CONFIG[order.status];
            const StatusIcon = status.icon;

            return (
              <Card key={order.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <StatusIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">
                          {order.vendor?.name || 'Boutique'} •{' '}
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Badge variant={status.variant} size="sm">
                        {status.label}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} produit(s)
                      </p>
                      <p className="font-bold text-[#FF4D00]">
                        {(order.total || 0).toLocaleString()} FCFA
                      </p>
                    </div>
                    {order.customer_address && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {order.customer_address}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
