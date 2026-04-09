'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/stores';
import {
  Search,
  MessageCircle,
  Heart,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  MapPin,
  Package,
} from 'lucide-react';

// Demo vendor
const VENDOR = {
  name: "Marie",
  businessName: "Marie's Closet",
  bio: "Boutique spécialisée en mode féminine de qualité. Livraison partout au Cameroun! 💕",
  avatar: null,
  city: "Douala",
  whatsappNumber: "+237600000000",
  instagramHandle: "mariescloset",
  isOnline: true,
  rating: 4.9,
  memberSince: 2024,
  productCount: 124,
  theme: {
    primaryColor: '#FF4D00',
    backgroundColor: '#FFF5F0',
    cardColor: '#FFFFFF',
  },
  coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
};

// Demo products
const PRODUCTS = [
  {
    id: '1',
    name: 'Robe wax taille M',
    price: 15000,
    comparePrice: 20000,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600'],
    stock: 5,
    isAvailable: true,
    category: 'Robes',
  },
  {
    id: '2',
    name: 'Kit beauté complet',
    price: 8500,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'],
    stock: 12,
    isAvailable: true,
    category: 'Beauté',
  },
  {
    id: '3',
    name: 'Pagne holson 6 yards',
    price: 12000,
    comparePrice: 15000,
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600'],
    stock: 8,
    isAvailable: true,
    category: 'Pagnes',
  },
  {
    id: '4',
    name: 'Parfum imported',
    price: 35000,
    comparePrice: 45000,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600'],
    stock: 3,
    isAvailable: true,
    category: 'Beauté',
  },
  {
    id: '5',
    name: 'Sac à main cuir',
    price: 22000,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'],
    stock: 7,
    isAvailable: true,
    category: 'Accessoires',
  },
  {
    id: '6',
    name: 'Lace wig 360 frontal',
    price: 45000,
    comparePrice: 55000,
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600'],
    stock: 2,
    isAvailable: true,
    category: 'Perruques',
  },
];

const CATEGORIES = ['Tous', 'Robes', 'Beauté', 'Pagnes', 'Accessoires', 'Perruques'];
const CITIES = ['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Kribi', 'Limbé', 'Buea'];

export default function CatalogPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { items, updateQuantity, getTotal } = useCartStore();

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    city: 'Douala',
    note: '',
    paymentMethod: 'mtn_momo'
  });

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && p.isAvailable;
  });

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/boutique/maries-closet/success`);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: VENDOR.theme.backgroundColor }}
    >
      {/* Sticky WhatsApp Button */}
      <a
        href={`https://wa.me/${VENDOR.whatsappNumber}?text=${encodeURIComponent(
          `Bonjour ${VENDOR.name}, je suis intéressé(e) par vos produits sur ShopLink!`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-50 flex items-center justify-center h-12 w-12 rounded-full"
        style={{ backgroundColor: '#25D366', boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)' }}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </a>

      {/* Header with Cover + Shop Info */}
      <header className="relative">
        {/* Cover Photo */}
        <div
          className="w-full h-40 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${VENDOR.coverImage})` }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        </div>

        {/* Shop Info */}
        <div className="relative px-4 pb-4" style={{ marginTop: '-36px' }}>
          {/* Avatar */}
          <div
            className="h-[72px] w-[72px] rounded-full flex items-center justify-center text-2xl font-bold text-white border-[3px] border-bg-surface mx-auto"
            style={{ backgroundColor: VENDOR.theme.primaryColor, boxShadow: 'var(--shadow-md)' }}
          >
            {VENDOR.name[0]}
          </div>

          {/* Name + Bio */}
          <div className="text-center mt-3">
            <div className="flex items-center justify-center gap-2">
              <h1 className="font-display text-[22px] font-bold text-text-1">
                {VENDOR.businessName}
              </h1>
              {VENDOR.isOnline && (
                <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
              )}
            </div>
            <p className="text-text-2 text-sm mt-1 line-clamp-2">{VENDOR.bio}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 mt-2 text-text-3 text-xs">
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {VENDOR.productCount} produits
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent-gold text-accent-gold" />
              {VENDOR.rating}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Membre depuis {VENDOR.memberSince}
            </span>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-3" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-bg-surface border-border-subtle"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-120"
              style={
                selectedCategory === cat
                  ? { backgroundColor: VENDOR.theme.primaryColor, color: 'white' }
                  : { backgroundColor: 'var(--bg-elevated)', color: 'var(--text-2)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <main className="px-4 pb-6">
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
                <Card
                  className={`catalog-card overflow-hidden p-0 fade-slide-up stagger-${(i % 10) + 1}`}
                  padding="none"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {product.comparePrice && (
                      <Badge
                        variant="default"
                        size="sm"
                        className="absolute top-2 left-2 bg-primary text-white font-semibold text-[11px]"
                      >
                        -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                      </Badge>
                    )}
                    {product.stock <= 2 && product.stock > 0 && (
                      <Badge
                        variant="default"
                        size="sm"
                        className="absolute top-2 right-2 bg-accent-gold-soft text-accent-gold font-semibold text-[11px]"
                      >
                        ⚡ Dernier
                      </Badge>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow flex items-center justify-center"
                    >
                      <Heart
                        className={`h-4 w-4 transition-all duration-200 ${
                          favorites.includes(product.id)
                            ? 'fill-danger text-danger scale-110'
                            : 'text-text-3'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-[10px]">
                    <p className="font-body font-semibold text-[13px] text-text-1 line-clamp-2 mb-1">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p
                        className="font-outfit font-bold text-[16px]"
                        style={{ color: VENDOR.theme.primaryColor }}
                      >
                        {formatPrice(product.price)}
                      </p>
                      {product.comparePrice && (
                        <p className="text-xs text-text-3 line-through">
                          {formatPrice(product.comparePrice)}
                        </p>
                      )}
                    </div>
                    <Button
                      className="w-full mt-2 h-9 text-sm font-semibold"
                      style={{ backgroundColor: VENDOR.theme.primaryColor }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                    >
                      Commander
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-text-2">Aucun produit trouvé</p>
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-4 right-4 z-50"
        >
          <Button
            className="w-full h-14 rounded-2xl shadow-primary press-effect"
            style={{ backgroundColor: VENDOR.theme.primaryColor }}
            onClick={() => setShowCart(true)}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Voir mon panier ({items.reduce((sum, i) => sum + i.quantity, 0)} articles)
            <span className="ml-2 font-outfit font-bold">
              {formatPrice(getTotal())}
            </span>
          </Button>
        </motion.div>
      )}

      {/* Direct Checkout Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setQuantity(1);
          setCheckoutForm({ ...checkoutForm, name: '', phone: '', note: '' });
        }}
        title="Finaliser la commande"
      >
        {selectedProduct && (
          <form onSubmit={handleCheckoutSubmit} className="space-y-6 pb-6">
            {/* Product Recap */}
            <div className="flex items-center gap-4 bg-bg-elevated p-3 rounded-2xl">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-text-1 line-clamp-1">{selectedProduct.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-outfit font-bold" style={{ color: VENDOR.theme.primaryColor }}>
                    {formatPrice(selectedProduct.price)}
                  </span>
                  <span className="text-sm text-text-3">x{quantity}</span>
                </div>
              </div>
              <div className="flex flex-col items-center bg-bg-surface rounded-lg shadow-sm border border-border-subtle">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                  className="h-7 w-8 flex items-center justify-center border-b border-border-subtle"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-7 w-8 flex items-center justify-center"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-1 mb-1">Nom complet *</label>
                <Input
                  required
                  placeholder="Ex: Aminata B."
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-1 mb-1">Téléphone *</label>
                <Input
                  required
                  type="tel"
                  placeholder="+237 6XX XXX XXX"
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-1 mb-1">Ville de livraison *</label>
                <select
                  className="w-full h-11 px-3 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  value={checkoutForm.city}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                >
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-1 mb-1">Note de livraison (Optionnel)</label>
                <Input
                  placeholder="Ex: Carrefour Ndokoti, derrière la station..."
                  value={checkoutForm.note}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, note: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-1 mb-2">Moyen de paiement *</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'mtn_momo', label: 'MTN Mobile Money', icon: '📱' },
                    { id: 'orange_money', label: 'Orange Money', icon: '📱' },
                    { id: 'cash', label: 'Paiement à la livraison', icon: '💵' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        checkoutForm.paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border-subtle bg-bg-surface hover:border-border-strong'
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
                      <span className="font-medium text-text-1">{method.label}</span>
                      {checkoutForm.paymentMethod === method.id && (
                        <div className="ml-auto h-4 w-4 rounded-full border-4 border-primary bg-white" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border-subtle pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-text-2">Sous-total</span>
                <span>{formatPrice(selectedProduct.price * quantity)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total à payer</span>
                <span style={{ color: VENDOR.theme.primaryColor }}>
                  {formatPrice(selectedProduct.price * quantity)}
                </span>
              </div>

              <Button
                type="submit"
                className="w-full text-lg h-14 rounded-xl"
                style={{ backgroundColor: VENDOR.theme.primaryColor }}
              >
                Confirmer la commande
              </Button>
            </div>
          </form>
        )}
      </BottomSheet>

      {/* Cart Bottom Sheet */}
      <BottomSheet
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        title="Mon Panier"
      >
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-text-1">{item.product.name}</p>
                <p className="text-sm text-text-2">
                  {formatPrice(item.product.price)} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="h-8 w-8 rounded-full bg-bg-elevated flex items-center justify-center press-effect"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-semibold w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="h-8 w-8 rounded-full bg-bg-elevated flex items-center justify-center press-effect"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="border-t border-border-subtle pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-text-2">Sous-total</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-text-2">Livraison</span>
              <span>À calculer</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span style={{ color: VENDOR.theme.primaryColor }}>
                {formatPrice(getTotal())}
              </span>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            style={{ backgroundColor: VENDOR.theme.primaryColor }}
            onClick={() => {
              window.location.href = `/checkout?vendor=${VENDOR.businessName.toLowerCase().replace(/\s+/g, '-')}`;
            }}
          >
            Commander maintenant
          </Button>
        </div>
      </BottomSheet>

      {/* ShopLink Footer */}
      <footer className="text-center pb-6">
        <p className="text-xs text-text-3">Propulsé par ShopLink CM</p>
      </footer>
    </div>
  );
}
