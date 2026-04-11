'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Package,
} from 'lucide-react';

interface AnalyticsData {
  totalVendors: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  avgOrderValue: number;
  topVendors: Array<{
    id: string;
    name: string;
    ordersCount: number;
    revenue: number;
  }>;
  ordersByStatus: Record<string, number>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  recentActivity: Array<{
    type: 'order' | 'vendor' | 'product';
    description: string;
    timestamp: string;
  }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      const supabase = createClient();

      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch vendors
      const { count: vendorCount } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true });

      // Fetch products
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString());

      const orders = ordersData || [];
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Orders by status
      const ordersByStatus: Record<string, number> = {};
      orders.forEach((o) => {
        ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
      });

      // Top vendors by orders
      const vendorStats: Record<string, { name: string; ordersCount: number; revenue: number }> = {};
      orders.forEach((o) => {
        const vendorName = (o.vendor as unknown as { name: string })?.name || 'Unknown';
        if (!vendorStats[o.vendor_id]) {
          vendorStats[o.vendor_id] = { name: vendorName, ordersCount: 0, revenue: 0 };
        }
        vendorStats[o.vendor_id].ordersCount++;
        vendorStats[o.vendor_id].revenue += o.total || 0;
      });

      const topVendors = Object.entries(vendorStats)
        .map(([id, stats]) => ({ id, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Revenue by day
      const revenueByDay: Record<string, { revenue: number; orders: number }> = {};
      orders.forEach((o) => {
        const date = o.created_at.split('T')[0];
        if (!revenueByDay[date]) {
          revenueByDay[date] = { revenue: 0, orders: 0 };
        }
        revenueByDay[date].revenue += o.total || 0;
        revenueByDay[date].orders++;
      });

      const revenueByDayArray = Object.entries(revenueByDay)
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Recent activity (last 10 orders)
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*, vendor: vendors(name)')
        .order('created_at', { ascending: false })
        .limit(10);

      const recentActivity = (recentOrders || []).map((o) => ({
        type: 'order' as const,
        description: `Nouvelle commande de ${o.customer_name} - ${(o.total || 0).toLocaleString()} FCFA`,
        timestamp: o.created_at,
      }));

      setData({
        totalVendors: vendorCount || 0,
        totalOrders,
        totalRevenue,
        totalProducts: productCount || 0,
        avgOrderValue,
        topVendors,
        ordersByStatus,
        revenueByDay: revenueByDayArray,
        recentActivity,
      });

      setLoading(false);
    };

    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Analytics</h1>
          <p className="text-gray-500 mt-1">Statistiques de la plateforme</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={period === '7d' ? 'primary' : 'default'} className="cursor-pointer" onClick={() => setPeriod('7d')}>7 jours</Badge>
          <Badge variant={period === '30d' ? 'primary' : 'default'} className="cursor-pointer" onClick={() => setPeriod('30d')}>30 jours</Badge>
          <Badge variant={period === '90d' ? 'primary' : 'default'} className="cursor-pointer" onClick={() => setPeriod('90d')}>90 jours</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Vendeurs</p>
              <p className="font-display text-3xl font-bold mt-1">{data?.totalVendors}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Commandes</p>
              <p className="font-display text-3xl font-bold mt-1">{data?.totalOrders}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenus</p>
              <p className="font-display text-3xl font-bold mt-1">
                {(data?.totalRevenue || 0).toLocaleString()} FCFA
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Panier moyen</p>
              <p className="font-display text-3xl font-bold mt-1">
                {(data?.avgOrderValue || 0).toLocaleString()} FCFA
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <Card className="p-5">
          <h2 className="font-display font-bold mb-4">Top Vendeurs</h2>
          {data?.topVendors.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune donnée</p>
          ) : (
            <div className="space-y-3">
              {data?.topVendors.map((vendor, index) => (
                <div key={vendor.id} className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-300 w-8">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-gray-500">{vendor.ordersCount} commandes</p>
                  </div>
                  <p className="font-bold text-[#FF4D00]">
                    {vendor.revenue.toLocaleString()} FCFA
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Orders by Status */}
        <Card className="p-5">
          <h2 className="font-display font-bold mb-4">Commandes par statut</h2>
          <div className="space-y-3">
            {Object.entries(data?.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      status === 'delivered'
                        ? 'success'
                        : status === 'pending'
                        ? 'warning'
                        : status === 'cancelled'
                        ? 'danger'
                        : 'default'
                    }
                  >
                    {status}
                  </Badge>
                  <span className="text-gray-500">{count} commandes</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full flex-1 max-w-32">
                  <div
                    className="h-2 bg-[#FF4D00] rounded-full"
                    style={{
                      width: `${(count / (data?.totalOrders || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue Chart (Simple bar representation) */}
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-display font-bold mb-4">Revenus par jour</h2>
          {data?.revenueByDay.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune donnée</p>
          ) : (
            <div className="flex items-end gap-1 h-40">
              {data?.revenueByDay.map((day) => {
                const maxRevenue = Math.max(...(data?.revenueByDay.map((d) => d.revenue) || [1]));
                const height = (day.revenue / maxRevenue) * 100;

                return (
                  <div
                    key={day.date}
                    className="flex-1 bg-[#FF4D00] rounded-t relative group"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}: {day.revenue.toLocaleString()} FCFA
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{data?.revenueByDay[0]?.date ? new Date(data.revenueByDay[0].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '-'}</span>
            <span>{data?.revenueByDay[data.revenueByDay.length - 1]?.date ? new Date(data.revenueByDay[data.revenueByDay.length - 1].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '-'}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
