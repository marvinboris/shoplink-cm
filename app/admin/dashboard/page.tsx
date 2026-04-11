'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalVendors: number;
  totalOrders: number;
  totalRevenue: number;
  suspendedVendors: number;
  recentOrders: number;
  recentRevenue: number;
  ordersGrowth: number;
  revenueGrowth: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
  vendor: { name: string };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch vendors count
      const { count: vendorCount } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true });

      // Fetch suspended vendors
      const { count: suspendedCount } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true })
        .eq('suspended', true);

      // Fetch orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*, vendor: vendors(name)')
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate totals
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

      // Fetch last 30 days orders for growth
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const recentCount = recentOrdersData?.length || 0;
      const recentRevenue = recentOrdersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

      setStats({
        totalVendors: vendorCount || 0,
        totalOrders,
        totalRevenue,
        suspendedVendors: suspendedCount || 0,
        recentOrders: recentCount,
        recentRevenue: recentRevenue,
        ordersGrowth: totalOrders > 0 ? Math.round((recentCount / totalOrders) * 100) : 0,
        revenueGrowth: totalRevenue > 0 ? Math.round((recentRevenue / totalRevenue) * 100) : 0,
      });

      setRecentOrders((orders || []) as RecentOrder[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Vue d&apos;ensemble de la plateforme</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Vendeurs</p>
              <p className="font-display text-3xl font-bold mt-1">{stats?.totalVendors}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          {stats?.suspendedVendors ? (
            <div className="flex items-center gap-1 mt-3 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{stats.suspendedVendors} suspendu(s)</span>
            </div>
          ) : null}
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Commandes (30j)</p>
              <p className="font-display text-3xl font-bold mt-1">{stats?.recentOrders}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-green-600">
            {stats?.ordersGrowth && stats.ordersGrowth > 0 ? (
              <>
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm">+{stats.ordersGrowth}% ce mois</span>
              </>
            ) : (
              <span className="text-sm text-gray-500">Pas de croissance</span>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenus (30j)</p>
              <p className="font-display text-3xl font-bold mt-1">
                {stats?.recentRevenue?.toLocaleString()} FCFA
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-green-600">
            {stats?.revenueGrowth && stats.revenueGrowth > 0 ? (
              <>
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm">+{stats.revenueGrowth}% ce mois</span>
              </>
            ) : (
              <span className="text-sm text-gray-500">Pas de croissance</span>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenus totaux</p>
              <p className="font-display text-3xl font-bold mt-1">
                {stats?.totalRevenue?.toLocaleString()} FCFA
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">{stats?.totalOrders} commandes</p>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Derni&apos;eres commandes</h2>
            <Link href="/admin/orders" className="text-sm text-[#FF4D00] hover:underline">
              Voir tout
            </Link>
          </div>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Aucune commande pour le moment
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Boutique</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm">{order.customer_name}</td>
                    <td className="px-5 py-4 text-sm">{(order.vendor as unknown as { name: string })?.name || '-'}</td>
                    <td className="px-5 py-4 text-sm font-semibold">{order.total?.toLocaleString()} FCFA</td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          order.status === 'delivered' ? 'success' :
                          order.status === 'pending' ? 'warning' :
                          order.status === 'cancelled' ? 'danger' : 'default'
                        }
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
