'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Package,
  ShoppingBag,
  Ban,
  CheckCircle,
  Save,
  QrCode,
} from 'lucide-react';
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
  commission_rate: number;
  mtn_number: string;
  orange_number: string;
  whatsapp_notifs: boolean;
  theme_config: {
    primaryColor?: string;
    backgroundColor?: string;
    cardColor?: string;
    fontFamily?: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  stock: number;
}

interface Order {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export default function VendorDetailPage() {
  const params = useParams();
  const vendorId = params.id as string;
  const { addToast } = useToast();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [mtnNumber, setMtnNumber] = useState('');
  const [orangeNumber, setOrangeNumber] = useState('');
  const [commissionRate, setCommissionRate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch vendor
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (vendorData) {
        setVendor(vendorData);
        setMtnNumber(vendorData.mtn_number || '');
        setOrangeNumber(vendorData.orange_number || '');
        setCommissionRate(String(vendorData.commission_rate || ''));
      }

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, price, is_available, stock')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, customer_name, total, status, created_at')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
        .limit(10);

      setProducts(productsData || []);
      setOrders(ordersData || []);
      setLoading(false);
    };

    if (vendorId) fetchData();
  }, [vendorId]);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('vendors')
      .update({
        mtn_number: mtnNumber,
        orange_number: orangeNumber,
        commission_rate: parseFloat(commissionRate) || 0,
      })
      .eq('id', vendorId);

    if (!error) {
      addToast('Modifications enregistrées');
    } else {
      addToast('Erreur lors de la sauvegarde', 'error');
    }
    setSaving(false);
  };

  const toggleSuspend = async () => {
    if (!vendor) return;
    const supabase = createClient();

    const { error } = await supabase
      .from('vendors')
      .update({ suspended: !vendor.suspended })
      .eq('id', vendorId);

    if (!error) {
      setVendor({ ...vendor, suspended: !vendor.suspended });
      addToast(vendor.suspended ? 'Vendeur réactivé' : 'Vendeur suspendu');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Vendeur non trouvé</p>
      </div>
    );
  }

  const shopUrl = `https://shoplink-cm.vercel.app/boutique/${vendor.shop_slug}`;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/vendors">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-[#1A1A2E]">{vendor.name}</h1>
          <p className="text-gray-500">Boutique {vendor.shop_slug}</p>
        </div>
        <Button
          variant={vendor.suspended ? 'secondary' : 'danger'}
          onClick={toggleSuspend}
        >
          {vendor.suspended ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Réactiver
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" />
              Suspendre
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Vendor Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <Card className="p-5">
            <h2 className="font-display font-bold mb-4">Informations</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{vendor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{vendor.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Inscrit le</p>
                  <p className="font-medium">
                    {new Date(vendor.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <QrCode className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Boutique</p>
                  <a
                    href={shopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#FF4D00] hover:underline"
                  >
                    {shopUrl}
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {/* Products */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold">Produits</h2>
              <Badge variant="default">{products.length}</Badge>
            </div>
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun produit</p>
            ) : (
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#FF4D00]/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-[#FF4D00]" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.stock} en stock</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{product.price.toLocaleString()} FCFA</p>
                      {!product.is_available && (
                        <Badge variant="danger" size="sm">Indisponible</Badge>
                      )}
                    </div>
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="text-center text-sm text-gray-500 py-2">
                    +{products.length - 5} autres produits
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Recent Orders */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold">Dernières commandes</h2>
              <Badge variant="default">{orders.length}</Badge>
            </div>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucune commande</p>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{order.total.toLocaleString()} FCFA</p>
                      <Badge
                        variant={
                          order.status === 'delivered'
                            ? 'success'
                            : order.status === 'pending'
                            ? 'warning'
                            : order.status === 'cancelled'
                            ? 'danger'
                            : 'default'
                        }
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-display font-bold mb-4">Paramètres</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Taux de commission (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  placeholder="1.5"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Numéro MTN
                </label>
                <Input
                  type="tel"
                  value={mtnNumber}
                  onChange={(e) => setMtnNumber(e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Numéro Orange
                </label>
                <Input
                  type="tel"
                  value={orangeNumber}
                  onChange={(e) => setOrangeNumber(e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
              <Button className="w-full" onClick={handleSave} isLoading={saving}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </Card>

          {/* Status */}
          <Card className="p-5">
            <h2 className="font-display font-bold mb-4">Statut du compte</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Statut</span>
                <Badge variant={vendor.suspended ? 'danger' : 'success'}>
                  {vendor.suspended ? 'Suspendu' : 'Actif'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Plan</span>
                <Badge variant="default" className="bg-purple-100 text-purple-700 border-0">
                  {vendor.plan || 'free'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">WhatsApp</span>
                <Badge variant={vendor.whatsapp_notifs ? 'success' : 'default'}>
                  {vendor.whatsapp_notifs ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
