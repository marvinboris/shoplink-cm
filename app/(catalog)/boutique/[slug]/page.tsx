'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

const shop = {
  slug: "maries-closet",
  name: "Marie's Closet",
  bio: "Mode & Beauté | Livraison Douala & Yaoundé | Paiement Mobile Money ✓",
  whatsapp: "+237690000001",
  coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  avatar: "https://i.pravatar.cc/150?img=47",
}

const products = [
  { id: 1, name: "Robe wax taille M", price: 15000, comparePrice: 20000, category: "Robes", stock: 5, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400" },
  { id: 2, name: "Kit beauté complet", price: 8500, comparePrice: null, category: "Beauté", stock: 12, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400" },
  { id: 3, name: "Pagne holson 6 yards", price: 12000, comparePrice: 15000, category: "Tissus", stock: 0, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400" },
  { id: 4, name: "Parfum Chanel imported", price: 35000, comparePrice: 45000, category: "Beauté", stock: 3, image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400" },
  { id: 5, name: "Sac à main cuir", price: 22000, comparePrice: null, category: "Accessoires", stock: 8, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400" },
  { id: 6, name: "Lace wig 360 frontal", price: 45000, comparePrice: 55000, category: "Perruques", stock: 2, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400" },
]

const CATEGORIES = ['Tout', 'Robes', 'Beauté', 'Tissus', 'Accessoires', 'Perruques'];
const CITIES = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Kribi', 'Dschang', 'Limbé'];

export default function CatalogPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    city: 'Douala',
    note: '',
    paymentMethod: 'mtn_momo'
  });

  const filteredProducts = products.filter((p) => {
    return selectedCategory === 'Tout' || p.category === selectedCategory;
  });

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const url = new URL(window.location.origin + `/boutique/maries-closet/success`);
    url.searchParams.set('product', selectedProduct.name);
    url.searchParams.set('price', selectedProduct.price.toString());
    url.searchParams.set('name', checkoutForm.name);
    url.searchParams.set('city', checkoutForm.city);
    router.push(url.pathname + url.search);
  };

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Sticky WhatsApp Button */}
      <a
        href={`https://wa.me/${shop.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-50 flex items-center justify-center gap-1 font-semibold text-sm"
        style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '9999px', padding: '8px 16px', boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)' }}
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp
      </a>

      {/* Header */}
      <header className="relative">
        <div
          className="w-full h-[160px] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${shop.coverImage})` }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, white, transparent)' }}
          />
        </div>

        <div className="relative px-4 pb-4" style={{ marginTop: '-36px' }}>
          <img
            src={shop.avatar}
            alt={shop.name}
            className="h-[72px] w-[72px] rounded-full object-cover border-[3px] border-white mx-auto shadow-md"
          />
          <h1 className="font-display text-[22px] font-bold text-center mt-2 text-[#1A1A2E]">
            {shop.name}
          </h1>
          <p className="text-center text-[#6B7280] text-[14px] mt-1 px-4 leading-snug">
            {shop.bio}
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
                      onClick={() => {
                        setSelectedProduct(product);
                      }}
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