'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Store, MapPin, Link, Package, CheckCircle2 } from 'lucide-react';

const CITIES = [
  { value: 'douala', label: 'Douala' },
  { value: 'yaounde', label: 'Yaoundé' },
  { value: 'bafoussam', label: 'Bafoussam' },
  { value: 'dschang', label: 'Dschang' },
  { value: 'kribi', label: 'Kribi' },
  { value: 'limbe', label: 'Limbé' },
  { value: 'edea', label: 'Edéa' },
  { value: 'garoua', label: 'Garoua' },
  { value: 'maroua', label: 'Maroua' },
];

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  { id: 1, title: 'Profil', icon: <Store className="h-5 w-5" /> },
  { id: 2, title: 'Boutique', icon: <MapPin className="h-5 w-5" /> },
  { id: 3, title: 'Lien', icon: <Link className="h-5 w-5" /> },
  { id: 4, title: 'Premier produit', icon: <Package className="h-5 w-5" /> },
];

function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendorId') || '';

  // Form data
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  // Product data (for step 4)
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const progress = (currentStep / 4) * 100;

  const generateSlug = (value: string) => {
    const generated = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 30);
    setSlug(generated);
    setSlugAvailable(null);
  };

  const checkSlugAvailability = async () => {
    if (!slug || slug.length < 3) return;
    try {
      const res = await fetch(`/api/check-slug?slug=${slug}`);
      const data = await res.json();
      setSlugAvailable(data.available);
    } catch {
      setSlugAvailable(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          name,
          businessName,
          city,
          slug,
          firstProduct: {
            name: productName,
            price: parseFloat(productPrice),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
        });
        setTimeout(() => router.push('/'), 1500);
      } else {
        setError(data.error || 'Erreur');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                step.id <= currentStep ? 'text-primary' : 'text-text-3'
              }`}
            >
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                  step.id < currentStep
                    ? 'bg-primary text-white'
                    : step.id === currentStep
                    ? 'bg-primary text-white shadow-primary'
                    : 'bg-bg-elevated text-text-3'
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="text-xs font-medium hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-1.5 rounded-full" />
      </div>

      <Card className="w-full bg-bg-surface border border-border-subtle" padding="lg">
        {/* Step 1: Profile */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h2 className="font-display text-xl font-bold text-text-1">
                Présentez-vous 👋
              </h2>
              <p className="text-sm text-text-2 mt-1">
                Comment vous appellez-vous ?
              </p>
            </div>

            <Input
              label="Votre prénom"
              placeholder="Ex: Marie"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Nom de votre boutique"
              placeholder="Ex: Marie's Closet"
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                generateSlug(e.target.value);
              }}
              hint="Ce nom apparaîtra sur votre boutique"
            />

            <Select
              label="Ville"
              placeholder="Sélectionnez votre ville"
              options={CITIES}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <Button
              onClick={nextStep}
              className="w-full"
              size="lg"
              disabled={!name || !businessName || !city}
            >
              Continuer
            </Button>
          </motion.div>
        )}

        {/* Step 2: Shop Details */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h2 className="font-display text-xl font-bold text-text-1">
                Votre boutique est presque prête !
              </h2>
              <p className="text-sm text-text-2 mt-1">
                Un petit aperçu de ce qui vous attend
              </p>
            </div>

            <div className="bg-primary-soft rounded-2xl p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-primary mx-auto mb-3 flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-display font-bold text-text-1 mb-1">{businessName}</h3>
              <p className="text-sm text-text-2">{city.charAt(0).toUpperCase() + city.slice(1)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-bg-elevated rounded-xl">
                <div className="h-8 w-8 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <span className="text-sm">💰</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-1">Paiements MoMo & Orange</p>
                  <p className="text-xs text-text-3">Recevez directement sur votre mobile</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg-elevated rounded-xl">
                <div className="h-8 w-8 rounded-full bg-accent-gold/20 flex items-center justify-center">
                  <span className="text-sm">📊</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-1">Suivi des commandes</p>
                  <p className="text-xs text-text-3">Gérez tout depuis votre téléphone</p>
                </div>
              </div>
            </div>

            <Button
              onClick={nextStep}
              className="w-full"
              size="lg"
            >
              Parfait, continuons !
            </Button>
          </motion.div>
        )}

        {/* Step 3: Shop Link */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h2 className="font-display text-xl font-bold text-text-1">
                Choisissez votre lien 🔗
              </h2>
              <p className="text-sm text-text-2 mt-1">
                Votre boutique sera accessible à cette adresse
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-1">
                Lien de votre boutique
              </label>
              <div className="flex items-center rounded-2xl border border-border-subtle bg-bg-surface overflow-hidden">
                <span className="px-4 py-3 text-sm text-text-2 bg-bg-elevated border-r border-border-subtle whitespace-nowrap">
                  shoplinkcm.com/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    setSlugAvailable(null);
                  }}
                  onBlur={checkSlugAvailability}
                  placeholder="votre-boutique"
                  className="flex-1 px-4 py-3 font-body text-text-1 placeholder:text-text-3 focus:outline-none bg-transparent"
                />
              </div>
              {slugAvailable === true && (
                <p className="mt-1.5 text-sm text-accent-green flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Lien disponible !
                </p>
              )}
              {slugAvailable === false && (
                <p className="mt-1.5 text-sm text-danger">Ce lien est déjà pris</p>
              )}
            </div>

            <Button
              onClick={nextStep}
              className="w-full"
              size="lg"
              disabled={!slug || slug.length < 3 || slugAvailable === false}
            >
              Continuer
            </Button>
          </motion.div>
        )}

        {/* Step 4: First Product */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="font-display text-xl font-bold text-text-1">
                Ajoutez votre premier produit !
              </h2>
              <p className="text-sm text-text-2 mt-1">
                Vous pourrez en ajouter d&apos;autres plus tard
              </p>
            </div>

            <Badge variant="default" className="w-full justify-center py-2 bg-primary-soft text-primary border-0">
              C&apos;est gratuit et sans engagement
            </Badge>

            <Input
              label="Nom du produit"
              placeholder="Ex: Robe wax taille M"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />

            <Input
              label="Prix (FCFA)"
              type="number"
              placeholder="0"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value.replace(/\D/g, ''))}
            />

            {error && <p className="text-sm text-danger text-center">{error}</p>}

            <Button
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={!productName || !productPrice}
            >
              Créer ma boutique ! 🚀
            </Button>

            <p className="text-xs text-center text-text-3">
              Plus que {30 - parseInt(productPrice || '0')} FCFA de commission par vente en mode gratuit
            </p>
          </motion.div>
        )}
      </Card>

      {currentStep > 1 && (
        <Button variant="ghost" className="mt-4" onClick={prevStep}>
          Retour
        </Button>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="animate-pulse">Chargement...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
