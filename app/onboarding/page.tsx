'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, Store, UploadCloud, Smartphone, ArrowLeft, MessageCircle } from 'lucide-react';

const CITIES = ['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Kribi', 'Limbé', 'Buea'];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    name: '',
    shopName: '',
    city: 'Douala',
    slug: '',
    productName: '',
    productPrice: ''
  });

  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  // Auto-check slug
  useEffect(() => {
    if (formData.slug.length > 2) {
      const timer = setTimeout(() => {
        // Mock validation: "maries-closet" is taken, others are available
        setSlugAvailable(formData.slug !== 'maries-closet');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSlugAvailable(null);
    }
  }, [formData.slug]);

  // Auto-generate slug from shop name
  useEffect(() => {
    if (step === 3 && !formData.slug && formData.shopName) {
      setFormData(prev => ({
        ...prev,
        slug: prev.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }));
    }
  }, [step, formData.shopName, formData.slug]);

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleFinish = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-border-subtle bg-bg-surface">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <span className="font-display font-bold">ShopLink CM</span>
        </div>
        {step < 5 && (
          <span className="text-sm font-semibold text-text-3">Étape {step}/4</span>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* STEP 1: Phone + OTP */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-bg-surface p-6 rounded-3xl shadow-sm border border-border-subtle"
              >
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">Bienvenue ! 👋</h2>
                <p className="text-text-2 mb-6">Commençons par sécuriser votre compte.</p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Numéro de téléphone</label>
                    <Input
                      placeholder="+237 6XX XXX XXX"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  {formData.phone.length > 8 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-sm font-semibold mb-1">Code de vérification</label>
                      <Input
                        placeholder="123456"
                        maxLength={6}
                        value={formData.otp}
                        onChange={e => setFormData({...formData, otp: e.target.value})}
                      />
                      <p className="text-xs text-text-3 mt-1">Entrez n&apos;importe quel code à 6 chiffres pour la démo.</p>
                    </motion.div>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={formData.otp.length < 6}
                  onClick={nextStep}
                >
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* STEP 2: Profile & Shop */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-bg-surface p-6 rounded-3xl shadow-sm border border-border-subtle"
              >
                <h2 className="font-display text-2xl font-bold mb-2">Parlez-nous de vous</h2>
                <p className="text-text-2 mb-6">Ces informations seront visibles par vos clients.</p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Votre nom complet</label>
                    <Input
                      placeholder="Ex: Marie Claire"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nom de la boutique</label>
                    <Input
                      placeholder="Ex: Marie's Closet"
                      value={formData.shopName}
                      onChange={e => setFormData({...formData, shopName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Ville principale</label>
                    <select
                      className="w-full h-11 px-3 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    >
                      {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="px-4" onClick={prevStep}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    disabled={!formData.name || !formData.shopName}
                    onClick={nextStep}
                  >
                    Suivant
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Slug */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-bg-surface p-6 rounded-3xl shadow-sm border border-border-subtle"
              >
                <h2 className="font-display text-2xl font-bold mb-2">Votre lien unique</h2>
                <p className="text-text-2 mb-6">C&apos;est ce lien que vous partagerez à vos clients.</p>

                <div className="mb-8">
                  <div className="flex items-center bg-bg-elevated rounded-[var(--radius-sm)] border border-border-default overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                    <span className="pl-3 text-text-3 text-sm">shoplink.cm/</span>
                    <input
                      className="flex-1 h-11 px-2 bg-transparent text-text-1 focus:outline-none font-medium"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                    />
                  </div>
                  <div className="h-6 mt-1 flex items-center">
                    {slugAvailable === true && <span className="text-xs text-accent-green flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Lien disponible</span>}
                    {slugAvailable === false && <span className="text-xs text-danger">⚠️ Ce lien est déjà pris</span>}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="px-4" onClick={prevStep}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    disabled={slugAvailable !== true}
                    onClick={nextStep}
                  >
                    Suivant
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: First Product */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-bg-surface p-6 rounded-3xl shadow-sm border border-border-subtle"
              >
                <h2 className="font-display text-2xl font-bold mb-2">Ajoutez un produit</h2>
                <p className="text-text-2 mb-6">Créez votre première offre en quelques secondes.</p>

                <div className="space-y-4 mb-8">
                  <div className="h-32 rounded-2xl border-2 border-dashed border-border-strong flex flex-col items-center justify-center bg-bg-elevated cursor-pointer hover:bg-bg-hover transition-colors">
                    <UploadCloud className="h-8 w-8 text-text-3 mb-2" />
                    <span className="text-sm font-semibold text-text-2">Ajouter une photo</span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nom du produit</label>
                    <Input
                      placeholder="Ex: Robe d'été fleurie"
                      value={formData.productName}
                      onChange={e => setFormData({...formData, productName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Prix (FCFA)</label>
                    <Input
                      type="number"
                      placeholder="Ex: 15000"
                      value={formData.productPrice}
                      onChange={e => setFormData({...formData, productPrice: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" className="px-4" onClick={prevStep}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    disabled={!formData.productName || !formData.productPrice}
                    onClick={handleFinish}
                  >
                    Ouvrir ma boutique 🚀
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Success & Celebration */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-bg-surface p-8 rounded-3xl shadow-sm border border-border-subtle text-center"
              >
                <div className="w-20 h-20 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-accent-green" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-2">Félicitations !</h2>
                <p className="text-text-2 mb-8">
                  Votre boutique <strong className="text-text-1">{formData.shopName}</strong> est maintenant en ligne et prête à recevoir des commandes.
                </p>

                <div className="bg-bg-elevated p-4 rounded-2xl mb-8 flex items-center justify-between border border-border-default">
                  <span className="text-sm font-medium truncate pr-4">shoplink.cm/{formData.slug}</span>
                  <Badge variant="default" className="bg-primary/10 text-primary border-0">Copier</Badge>
                </div>

                <div className="space-y-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Découvrez ma nouvelle boutique en ligne : https://shoplink.cm/${formData.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white font-semibold"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Partager sur WhatsApp
                  </a>
                  
                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      Aller au tableau de bord
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
