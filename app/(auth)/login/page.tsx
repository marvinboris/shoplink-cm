'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Phone } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      setError('Entrez un numéro de téléphone valide');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/verify-otp?phone=${phone}`);
      } else {
        setError(data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary shadow-primary overflow-hidden">
          <img src="/favicon.svg" alt="ShopLink" className="h-10 w-10" />
        </div>
        <h1 className="font-display text-3xl font-bold text-text-1 mb-2">
          Bienvenue sur ShopLink
        </h1>
        <p className="text-text-2">
          Connexion ou création de compte gratuite
        </p>
      </motion.div>

      <Card className="w-full bg-bg-surface border-border-subtle" padding="lg">
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="font-display text-xl font-bold text-text-1">
              Connexion par téléphone
            </h2>
            <p className="text-sm text-text-2 mt-1">
              Nous enverrons un code par SMS
            </p>
          </div>

          <Input
            type="tel"
            label="Numéro de téléphone"
            placeholder="6XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            error={error}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            <Phone className="mr-2 h-5 w-5" />
            Recevoir mon code
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border-subtle text-center">
          <p className="text-sm text-text-3">
            Pas encore de compte ?{' '}
            <span className="text-primary font-semibold">
              Créer ma boutique gratuitement
            </span>
          </p>
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-text-3">
        En continuant, vous acceptez nos{' '}
        <span className="text-primary">Conditions d&apos;utilisation</span>
      </p>
    </div>
  );
}
