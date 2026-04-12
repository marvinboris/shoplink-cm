'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import { useShop } from '@/hooks/useShop';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/lib/types';

const CATEGORIES = ['Tout', 'Robes', 'Beauté', 'Tissus', 'Accessoires', 'Perruques'];
const CITIES = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Kribi', 'Dschang', 'Limbé'];

// Full theme definitions with all CSS variables (using design system variable names)
const SHOP_THEMES_FULL: Record<string, Record<string, string>> = {
  sunset: {
    '--primary': '#FF4D00',
    '--primary-light': '#FF6B35',
    '--primary-dark': '#D93D00',
    '--primary-soft': 'rgba(255,77,0,0.10)',
    '--bg-base': '#FFF5F0',
    '--text-1': '#1A1A2E',
    '--text-2': '#4B5563',
    '--text-3': '#9CA3AF',
    '--border-subtle': '#E8E3DC',
  },
  ocean: {
    '--primary': '#0077B6',
    '--primary-light': '#00A8E8',
    '--primary-dark': '#005A8C',
    '--primary-soft': 'rgba(0,119,182,0.10)',
    '--bg-base': '#F0F8FF',
    '--text-1': '#1A1A2E',
    '--text-2': '#4B5563',
    '--text-3': '#9CA3AF',
    '--border-subtle': '#B3D9FF',
  },
  forest: {
    '--primary': '#2D6A4F',
    '--primary-light': '#40916C',
    '--primary-dark': '#1B4332',
    '--primary-soft': 'rgba(45,106,79,0.10)',
    '--bg-base': '#F0FFF4',
    '--text-1': '#1A1A2E',
    '--text-2': '#4B5563',
    '--text-3': '#9CA3AF',
    '--border-subtle': '#D1FAE5',
  },
  royal: {
    '--primary': '#7C3AED',
    '--primary-light': '#A78BFA',
    '--primary-dark': '#5B21B6',
    '--primary-soft': 'rgba(124,58,237,0.10)',
    '--bg-base': '#FAF5FF',
    '--text-1': '#1A1A2E',
    '--text-2': '#4B5563',
    '--text-3': '#9CA3AF',
    '--border-subtle': '#DDD6FE',
  },
  rose: {
    '--primary': '#E11D48',
    '--primary-light': '#F43F5E',
    '--primary-dark': '#BE123C',
    '--primary-soft': 'rgba(225,29,72,0.10)',
    '--bg-base': '#FFF1F3',
    '--text-1': '#1A1A2E',
    '--text-2': '#4B5563',
    '--text-3': '#9CA3AF',
    '--border-subtle': '#FECDD3',
  },
  amber: {
    '--primary': '#D97706',
    '--primary-light': '#F59E0B',
    '--primary-dark': '#B45309',
    '--primary-soft': 'rgba(217,119,6,0.10)',
    '--bg-base': '#FFFBEB',
    '--text-1': '#1A1A2E',
    '--text-2': '#4B5563',
    '--text-3': '#9CA3AF',
    '--border-subtle': '#FDE68A',
  },
  midnight: {
    '--primary': '#38BDF8',
    '--primary-light': '#7DD3FC',
    '--primary-dark': '#0284C7',
    '--primary-soft': 'rgba(56,189,248,0.15)',
    '--bg-base': '#0F172A',
    '--text-1': '#F1F5F9',
    '--text-2': '#CBD5E1',
    '--text-3': '#94A3B8',
    '--border-subtle': '#334155',
  },
  emerald: {
    '--primary': '#059669',
    '--primary-light': '#10B981',
    '--primary-dark': '#047857',
    '--primary-soft': 'rgba(5,150,105,0.10)',
    '--bg-base': '#ECFDF5',
    '--text-1': '#1A1A2E',
    '--text-2': '#4B5563',
    '--text-3': '#9CA3AF',
    '--border-subtle': '#A7F3D0',
  },
};

type CatalogProduct = {
  id: string | number;
  name: string;
  price: number;
  comparePrice: number | null;
  category: string | null;
  stock: number;
  image: string;
};

function mapProduct(p: Product): CatalogProduct {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    comparePrice: p.compare_price,
    category: p.category,
    stock: p.stock_count ?? 0,
    image: p.images?.[0] || 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=400',
  };
}

export default function CatalogPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const router = useRouter();

  const { shop, loading } = useShop(slug);
  const { products } = useProducts(shop?.id, { availableOnly: false });

  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    city: 'Douala',
    note: '',
    paymentMethod: 'mtn_momo',
  });

  const catalogProducts = products.map(mapProduct);

  const filteredProducts = catalogProducts.filter((p) => {
    return selectedCategory === 'Tout' || p.category === selectedCategory;
  });

  // Apply theme from localStorage or vendor config
  useEffect(() => {
    if (!shop) return;

    // Get theme ID from localStorage (stored as theme ID like "sunset", "ocean", etc.)
    const savedThemeId = localStorage.getItem('shopTheme');
    let themeVars: Record<string, string> | null = null;

    if (savedThemeId && SHOP_THEMES_FULL[savedThemeId]) {
      themeVars = SHOP_THEMES_FULL[savedThemeId];
    } else if (shop.theme_config?.primaryColor) {
      // Fall back to creating theme from vendor's theme_config
      themeVars = {
        '--primary': shop.theme_config.primaryColor,
        '--primary-light': shop.theme_config.primaryColor,
        '--primary-dark': shop.theme_config.primaryColor,
        '--primary-soft': shop.theme_config.primaryColor + '20',
        '--bg-base': shop.theme_config.backgroundColor || '#FFF5F0',
        '--text-1': '#1A1A2E',
        '--text-2': '#4B5563',
        '--text-3': '#9CA3AF',
        '--border-subtle': '#E8E3DC',
      };
    } else {
      // Default theme
      themeVars = SHOP_THEMES_FULL['sunset'];
    }

    // Apply all theme variables
    if (themeVars) {
      const root = document.documentElement;
      Object.entries(themeVars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Cleanup: remove all theme variables on unmount
      return () => {
        Object.keys(themeVars!).forEach((key) => {
          root.style.removeProperty(key);
        });
      };
    }
  }, [shop, slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="animate-pulse text-text-2">Chargement...</div>
      </div>
    );
  }

  // Not found state
  if (!shop && slug) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="font-display text-2xl font-bold text-text-1 mb-2">Boutique introuvable</h1>
        <p className="text-text-2 text-center mb-6">
          Cette boutique n&apos;existe pas ou a été supprimée.
        </p>
        <a href="/" className="text-primary font-semibold hover:underline">
          Retour à l&apos;accueil
        </a>
      </div>
    );
  }

  // Empty catalog when no shop selected
  if (!shop && !slug) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🛍️</div>
        <h1 className="font-display text-2xl font-bold text-text-1 mb-2">Bienvenue sur ShopLink CM</h1>
        <p className="text-text-2 text-center mb-6">
          Trouvez des boutiques près de chez vous
        </p>
        <a href="/login" className="text-primary font-semibold hover:underline">
          Se connecter pour créer ma boutique
        </a>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !shop?.id) return;

    const deliveryFees: Record<string, number> = {
      'Douala': 1500,
      'Yaoundé': 2000,
    };
    const deliveryFee = deliveryFees[checkoutForm.city] || 3500;
    const total = selectedProduct.price + deliveryFee;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id: shop.id,
          customer_name: checkoutForm.name,
          customer_phone: checkoutForm.phone,
          customer_city: checkoutForm.city,
          delivery_note: checkoutForm.note || null,
          items: [{ product_id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, quantity: 1 }],
          subtotal: selectedProduct.price,
          delivery_fee: deliveryFee,
          total,
          payment_method: checkoutForm.paymentMethod === 'cash' ? 'cash' : checkoutForm.paymentMethod,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Erreur lors de la commande');
        return;
      }

      const orderRef = data.data?.reference || `ORD-${Date.now().toString(36).toUpperCase()}`;
      const url = new URL(window.location.origin + `/boutique/${slug}/success`);
      url.searchParams.set('product', selectedProduct.name);
      url.searchParams.set('price', selectedProduct.price.toString());
      url.searchParams.set('name', checkoutForm.name);
      url.searchParams.set('city', checkoutForm.city);
      url.searchParams.set('ref', orderRef);
      router.push(url.pathname + url.search);
    } catch {
      alert('Erreur lors de la commande');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-bg-base">
      {/* Sticky WhatsApp Button */}
      {shop?.whatsapp_number && (
      <a
        href={`https://wa.me/${shop.whatsapp_number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-50 flex items-center justify-center gap-1 font-semibold text-sm"
        style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '9999px', padding: '8px 16px', boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)' }}
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp
      </a>
      )}

      {/* Header */}
      <header className="relative">
        <div
          className="w-full h-[160px] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${shop?.coverImage || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800'})` }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, white, transparent)' }}
          />
        </div>

        <div className="relative px-4 pb-4" style={{ marginTop: '-36px' }}>
          <img
            src={shop?.avatar || 'https://i.pravatar.cc/150?img=47'}
            alt={shop?.name || "Boutique"}
            className="h-[72px] w-[72px] rounded-full object-cover border-[3px] border-white mx-auto shadow-md"
          />
          <h1 className="font-display text-[22px] font-bold text-center mt-2 text-[#1A1A2E]">
            {shop?.name || "Boutique"}
          </h1>
          <p className="text-center text-[#6B7280] text-[14px] mt-1 px-4 leading-snug">
            {shop?.bio || ''}
          </p>
        </div>
      </header>

      {/* Categories */}
      <div className="px-4 pb-2 overflow-x-auto flex gap-2" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="whitespace-nowrap transition-all duration-120 flex-shrink-0"
            style={{
              backgroundColor: selectedCategory === cat ? '#FF4D00' : '#F0EDE8',
              color: selectedCategory === cat ? 'white' : '#4B5563',
              borderRadius: '9999px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <main className="p-4 pt-2 pb-24">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  className="bg-white rounded-2xl overflow-hidden shadow-sm fade-slide-up h-full flex flex-col"
                >
                  <div className="relative aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      style={{ filter: product.stock === 0 ? 'grayscale(100%)' : 'none' }}
                      loading="lazy"
                    />
                    {product.stock === 0 ? (
                      <div
                        className="absolute top-2 left-2 px-2 py-0.5 rounded font-semibold text-[11px]"
                        style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                      >
                        Rupture
                      </div>
                    ) : product.comparePrice ? (
                      <div
                        className="absolute top-2 left-2 px-2 py-0.5 rounded font-semibold text-[11px]"
                        style={{ backgroundColor: '#FF4D00', color: 'white' }}
                      >
                        PROMO
                      </div>
                    ) : null}

                    {product.stock <= 2 && product.stock > 0 && (
                      <div
                        className="absolute top-2 right-2 px-2 py-0.5 rounded font-semibold text-[11px]"
                        style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
                      >
                        ⚡ Dernier
                      </div>
                    )}
                  </div>
                  <div className="p-[10px] flex-1 flex flex-col justify-between">
                    <div className="mb-2">
                      <p className="font-semibold text-[13px] text-[#1A1A2E] line-clamp-2 mb-1" style={{ minHeight: '39px' }}>
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-outfit font-bold text-[16px] text-[#1A1A2E]">
                          {formatPrice(product.price)}
                        </p>
                        {product.comparePrice && (
                          <p className="text-[12px] text-[#9CA3AF] line-through">
                            {formatPrice(product.comparePrice)}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      className="w-full h-[36px] rounded-lg font-semibold text-[14px] transition-opacity"
                      style={{
                        backgroundColor: '#FF4D00',
                        color: 'white',
                        opacity: product.stock === 0 ? 0.4 : 1,
                        cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                      }}
                      disabled={product.stock === 0}
                      onClick={() => setSelectedProduct(product)}
                    >
                      Commander
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Direct Checkout Bottom Sheet */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-xl"
              style={{ borderRadius: '24px 24px 0 0', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="flex justify-center mt-[12px]">
                <div className="h-1 w-8 rounded-full bg-[#E5E7EB]" />
              </div>

              <div className="flex-1 overflow-y-auto p-4 pb-6">
                <form onSubmit={handleCheckoutSubmit}>
                  {/* Product Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-[#1A1A2E] leading-snug">{selectedProduct.name}</p>
                      <p className="font-outfit font-bold text-[#FF4D00]">{formatPrice(selectedProduct.price)}</p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-[#E5E7EB] mb-4" />

                  {/* Vos informations */}
                  <p className="text-[12px] uppercase font-bold text-[#9CA3AF] mb-3">Vos informations</p>

                  <div className="space-y-3 mb-6">
                    <input
                      required
                      placeholder="Nom complet *"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      className="w-full h-11 px-3 rounded-[8px] bg-[#F8F6F2] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Téléphone (+237) *"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      className="w-full h-11 px-3 rounded-[8px] bg-[#F8F6F2] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                    />
                    <select
                      required
                      className="w-full h-11 px-3 rounded-[8px] bg-[#F8F6F2] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF4D00]"
                      value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                    >
                      {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <textarea
                      placeholder="Note de livraison (Quartier, point de repère...)"
                      rows={2}
                      className="w-full p-3 rounded-[8px] bg-[#F8F6F2] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF4D00] resize-none"
                      value={checkoutForm.note}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, note: e.target.value })}
                    />
                  </div>

                  {/* Mode de paiement */}
                  <p className="text-[12px] uppercase font-bold text-[#9CA3AF] mb-3">Mode de paiement</p>
                  <div className="space-y-2 mb-6">
                    {[
                      { id: 'mtn_momo', label: 'MTN MoMo', icon: '📱' },
                      { id: 'orange_money', label: 'Orange Money', icon: '🟠' },
                      { id: 'cash', label: 'À la livraison', icon: '💵' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          checkoutForm.paymentMethod === method.id
                            ? 'border-[#FF4D00] bg-[#FFF0EB]'
                            : 'border-transparent bg-[#F8F6F2]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={checkoutForm.paymentMethod === method.id}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                          className="sr-only"
                        />
                        <span className="text-xl">{method.icon}</span>
                        <span className="font-semibold text-[#1A1A2E]">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[52px] rounded-xl font-bold text-[16px] flex items-center justify-center transition-transform active:scale-[0.98]"
                    style={{ backgroundColor: '#FF4D00', color: 'white', marginBottom: 'env(safe-area-inset-bottom)' }}
                  >
                    Confirmer la commande — {formatPrice(selectedProduct.price)}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-[11px] text-[#9CA3AF]">Propulsé par ShopLink CM</p>
      </footer>
    </div>
  );
}
