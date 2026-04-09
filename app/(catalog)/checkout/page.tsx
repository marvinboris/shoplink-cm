'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useCartStore } from '@/lib/stores';
import { formatPrice } from '@/lib/utils';
import {
  Check,
  MessageCircle,
  CreditCard,
  Truck,
  Package,
  ArrowLeft,
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Informations', icon: Package },
  { id: 2, title: 'Livraison', icon: Truck },
  { id: 3, title: 'Paiement', icon: CreditCard },
];

const PAYMENT_METHODS = [
  { id: 'mtn_momo', name: 'MTN Mobile Money', icon: '📱', color: '#FFCC00' },
  { id: 'orange_money', name: 'Orange Money', icon: '📱', color: '#FF6600' },
  { id: 'wave', name: 'Wave', icon: '📱', color: '#1DC8FF' },
  { id: 'cash', name: 'Paiement à la livraison', icon: '💵', color: '#25D366' },
];

const CITIES = [
  { value: 'douala', label: 'Douala' },
  { value: 'yaounde', label: 'Yaoundé' },
  { value: 'dschang', label: 'Dschang' },
  { value: 'bafoussam', label: 'Bafoussam' },
  { value: 'kribi', label: 'Kribi' },
  { value: 'limbe', label: 'Limbé' },
  { value: 'garoua', label: 'Garoua' },
  { value: 'maroua', label: 'Maroua' },
];

const DELIVERY_FEES: Record<string, number> = {
  douala: 1500,
  yaounde: 2000,
  default: 3500,
};

function CheckoutContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  searchParams.get('vendor'); // for future use

  const { items, getTotal, clearCart } = useCartStore();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('');

  const deliveryFee = DELIVERY_FEES[customerInfo.city] || DELIVERY_FEES.default;
  const total = getTotal() + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.city || !paymentMethod) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate order reference
    const ref = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderRef(ref);

    // Clear cart and show success
    clearCart();
    setIsSuccess(true);

    // Fire confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
    });

    setIsProcessing(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="h-24 w-24 rounded-full bg-accent-green mx-auto mb-6 flex items-center justify-center"
          >
            <Check className="h-12 w-12 text-white" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-text-1 mb-2">
            Commande confirmée !
          </h1>
          <p className="text-text-2 mb-6">
            Votre commande #{orderRef} a été passée avec succès.
          </p>

          <Card className="text-left p-4 mb-6 bg-bg-surface border border-border-subtle" variant="default">
            <h3 className="font-semibold mb-3">Prochaine étape</h3>
            <p className="text-sm text-text-2 mb-4">
              Le vendeur va confirmer votre commande et vous contacter pour les détails de livraison.
            </p>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Ma commande #${orderRef} est confirmée ! Merci ${customerInfo.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-semibold"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle className="h-5 w-5" />
              Informer le vendeur sur WhatsApp
            </a>
          </Card>

          <Button variant="outline" onClick={() => router.push('/')}>
            Retour à l&apos;accueil
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh p-4 pb-20">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-bg-surface shadow-sm flex items-center justify-center border border-border-subtle"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-xl font-bold">Finaliser la commande</h1>
      </header>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-accent-green text-white'
                      : isActive
                      ? 'bg-primary text-white'
                      : 'bg-bg-elevated text-text-3'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    isActive ? 'text-primary font-medium' : 'text-text-3'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-8 sm:w-16 mx-2 ${
                    currentStep > step.id ? 'bg-accent-green' : 'border-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Customer Info */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="p-4 bg-bg-surface border border-border-subtle" variant="default">
            <h2 className="font-semibold mb-4">Vos informations</h2>
            <div className="space-y-4">
              <Input
                label="Nom complet"
                placeholder="Ex: Marie Fouda"
                value={customerInfo.name}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, name: e.target.value })
                }
              />
              <Input
                label="Téléphone"
                type="tel"
                placeholder="6XX XXX XXX"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    phone: e.target.value.replace(/\D/g, ''),
                  })
                }
              />
            </div>
          </Card>

          <Button
            className="w-full"
            size="lg"
            disabled={!customerInfo.name || !customerInfo.phone}
            onClick={() => setCurrentStep(2)}
          >
            Continuer
          </Button>
        </motion.div>
      )}

      {/* Step 2: Delivery */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="p-4 bg-bg-surface border border-border-subtle" variant="default">
            <h2 className="font-semibold mb-4">Adresse de livraison</h2>
            <div className="space-y-4">
              <Select
                label="Ville"
                placeholder="Sélectionnez votre ville"
                options={CITIES}
                value={customerInfo.city}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, city: e.target.value })
                }
              />
              <Input
                label="Adresse (optionnel)"
                placeholder="Quartier, rue..."
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, address: e.target.value })
                }
              />
              <Input
                label="Notes (optionnel)"
                placeholder="Instructions de livraison..."
                value={customerInfo.notes}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, notes: e.target.value })
                }
              />
            </div>
          </Card>

          <Card className="p-4 bg-bg-elevated border-0" variant="default">
            <div className="flex justify-between mb-2">
              <span className="text-text-2">Frais de livraison</span>
              <span className="font-semibold">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Retour
            </Button>
            <Button
              className="flex-1"
              size="lg"
              disabled={!customerInfo.city}
              onClick={() => setCurrentStep(3)}
            >
              Choisir le paiement
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="p-4 bg-bg-surface border border-border-subtle" variant="default">
            <h2 className="font-semibold mb-4">Méthode de paiement</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all press-effect ${
                    paymentMethod === method.id
                      ? 'border-primary bg-primary-ultra-soft'
                      : 'border-border-subtle hover:border-primary/50'
                  }`}
                >
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: method.color + '20' }}
                  >
                    {method.icon}
                  </div>
                  <span className="flex-1 font-medium text-left">{method.name}</span>
                  {paymentMethod === method.id && (
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-4 bg-bg-surface border border-border-subtle" variant="default">
            <h2 className="font-semibold mb-4">Récapitulatif</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-text-2">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border-subtle pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-2">Sous-total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-2">Livraison</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Retour
            </Button>
            <Button
              className="flex-1"
              size="lg"
              isLoading={isProcessing}
              disabled={!paymentMethod}
              onClick={handlePlaceOrder}
            >
              {isProcessing ? 'Traitement...' : 'Confirmer la commande'}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen gradient-mesh" />}>
      <CheckoutContent />
    </Suspense>
  );
}
