'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Ban, CheckCircle, Eye } from 'lucide-react';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  shop_slug: string;
  plan: string;
  suspended: boolean;
  created_at: string;
  products_count?: number;
  orders_count?: number;
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended'>('all');

  useEffect(() => {
    const fetchVendors = async () => {
      const supabase = createClient();

      const query = supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching vendors:', error);
        return;
      }

      // Fetch products and orders count for each vendor
      const vendorsWithCounts = await Promise.all(
        (data || []).map(async (vendor) => {
          const { count: productsCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendor.id);

          const { count: ordersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendor.id);

          return {
            ...vendor,
            products_count: productsCount || 0,
            orders_count: ordersCount || 0,
          };
        })
      );

      setVendors(vendorsWithCounts);
      setLoading(false);
    };

    fetchVendors();
  }, []);

  const toggleSuspend = async (vendorId: string, currentlySuspended: boolean) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('vendors')
      .update({ suspended: !currentlySuspended })
      .eq('id', vendorId);

    if (!error) {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId ? { ...v, suspended: !currentlySuspended } : v
        )
      );
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.email.toLowerCase().includes(search.toLowerCase()) ||
      vendor.shop_slug.toLowerCase().includes(search.toLowerCase());

    if (filter === 'active') return matchesSearch && !vendor.suspended;
    if (filter === 'suspended') return matchesSearch && vendor.suspended;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
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
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">Vendeurs</h1>
          <p className="text-gray-500 mt-1">{vendors.length} vendeur(s)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher un vendeur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Tous
          </Button>
          <Button
            variant={filter === 'active' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Actifs
          </Button>
          <Button
            variant={filter === 'suspended' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('suspended')}
          >
            Suspendus
          </Button>
        </div>
      </div>

      {/* Vendors List */}
      {filteredVendors.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Aucun vendeur trouvé</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FF4D00] to-[#FF6B35] flex items-center justify-center text-white font-bold text-lg">
                  {vendor.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{vendor.name}</p>
                    {vendor.suspended && (
                      <Badge variant="danger" size="sm">
                        <Ban className="h-3 w-3 mr-1" />
                        Suspendu
                      </Badge>
                    )}
                    {vendor.plan && vendor.plan !== 'free' && (
                      <Badge variant="default" size="sm" className="bg-purple-100 text-purple-700 border-0">
                        {vendor.plan}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{vendor.email}</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-sm">
                    <span className="font-semibold">{vendor.products_count}</span>{' '}
                    <span className="text-gray-500">produits</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">{vendor.orders_count}</span>{' '}
                    <span className="text-gray-500">commandes</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/vendors/${vendor.id}`}>
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleSuspend(vendor.id, vendor.suspended)}
                    className={vendor.suspended ? 'text-green-600' : 'text-red-600'}
                  >
                    {vendor.suspended ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
