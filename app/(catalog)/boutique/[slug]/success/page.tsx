'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

export default function SuccessPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();

  const product = searchParams.get('product') || 'Produit inconnu';
  const priceStr = searchParams.get('price');
  const price = priceStr ? parseInt(priceStr) : 0;
  const name = searchParams.get('name') || 'Client';
  const city = searchParams.get('city') || 'Douala';
  const orderRef = searchParams.get('ref') || '';

  const orderNumber = orderRef || `ORD-${Math.floor(100 + Math.random() * 900).toString()}`;

  useEffect(() => {
    // Confetti
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Animated Checkmark */}
      <motion.div
        className="w-[80px] h-[80px] mb-6 flex items-center justify-center relative"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="40"
            cy="40"
            r="38"
            stroke="#00C48C"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.path
            d="M25 40L35 50L55 30"
            stroke="#00C48C"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.5 }}
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center w-full max-w-sm"
      >
        <h1 className="font-display font-bold text-[#1A1A2E] mb-2" style={{ fontSize: '24px' }}>
          Commande confirmée ! 🎉
        </h1>
        <p className="mb-8" style={{ color: '#6B7280' }}>
          Commande <span className="font-semibold">#ORD-{orderNumber}</span>
        </p>

        {/* Récapitulatif Card */}
        <div className="bg-[#F8F6F2] p-5 rounded-2xl mb-8 text-left border border-[#E5E7EB]">
          <h2 className="text-[12px] uppercase font-bold text-[#9CA3AF] mb-3">Récapitulatif</h2>
          
          <div className="space-y-3 text-[14px]">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Produit</span>
              <span className="font-semibold text-[#1A1A2E] max-w-[150px] truncate">{product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Montant</span>
              <span className="font-bold text-[#FF4D00]">{formatPrice(price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Client</span>
              <span className="font-medium text-[#1A1A2E] max-w-[150px] truncate">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Ville</span>
              <span className="font-medium text-[#1A1A2E]">{city}</span>
            </div>
          </div>
        </div>

        <Link href={`/boutique/${params.slug}`}>
          <Button
            className="w-full h-[52px] rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            style={{ backgroundColor: '#FF4D00', color: 'white' }}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voir d&apos;autres produits
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}