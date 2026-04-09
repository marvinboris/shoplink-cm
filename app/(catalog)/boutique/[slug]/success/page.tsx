'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SuccessPage({ params }: { params: { slug: string } }) {
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF4D00', '#00C48C', '#FFB800']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF4D00', '#00C48C', '#FFB800']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-bg-surface flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-24 h-24 rounded-full bg-accent-green/10 flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="h-12 w-12 text-accent-green" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="font-display text-3xl font-bold text-text-1 mb-2">
          Commande confirmée ! 🎉
        </h1>
        <p className="text-text-2 mb-8 max-w-sm mx-auto">
          Votre commande a bien été enregistrée. Le vendeur vous contactera bientôt pour la livraison.
        </p>

        <div className="bg-bg-elevated p-6 rounded-2xl mb-8 text-left max-w-sm mx-auto w-full">
          <h2 className="font-semibold mb-4 border-b border-border-subtle pb-2">Récapitulatif</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-2">Statut</span>
              <span className="font-medium text-accent-green">En attente</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-2">Paiement</span>
              <span className="font-medium">MTN Mobile Money</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-2">Date</span>
              <span className="font-medium">Aujourd&apos;hui</span>
            </div>
          </div>
        </div>

        <Link href={`/boutique/${params.slug}`}>
          <Button className="w-full max-w-sm" size="lg" style={{ backgroundColor: '#FF4D00' }}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voir d&apos;autres produits
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
