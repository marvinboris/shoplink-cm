'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ArrowRight, Zap, Globe, Smartphone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base text-text-1">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-xl">ShopLink CM</span>
        </div>
        <Link href="/onboarding">
          <Button variant="outline" size="sm">Connexion</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="default" className="bg-primary/10 text-primary border-0 mb-6 px-4 py-1 text-sm font-semibold">
            Nouveau au Cameroun 🇨🇲
          </Badge>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-text-1">
            Vendez en ligne <br />
            <span className="text-primary">sans tracas.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-2 mb-10 max-w-2xl mx-auto">
            Créez votre boutique en 5 minutes, acceptez MTN MoMo et Orange Money, et commencez à vendre directement sur WhatsApp et les réseaux sociaux.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8 shadow-warm-lg" style={{ backgroundColor: 'var(--primary)' }}>
                Voir la démo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-6 bg-bg-surface rounded-3xl border border-border-subtle shadow-sm"
          >
            <div className="h-12 w-12 bg-accent-green/10 text-accent-green rounded-2xl flex items-center justify-center mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Création Éclair</h3>
            <p className="text-text-2">Votre boutique en ligne prête en quelques minutes. Aucun bagage technique requis.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="p-6 bg-bg-surface rounded-3xl border border-border-subtle shadow-sm"
          >
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Paiements Locaux</h3>
            <p className="text-text-2">Intégration native de Mobile Money (MTN & Orange) pour faciliter vos encaissements.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="p-6 bg-bg-surface rounded-3xl border border-border-subtle shadow-sm"
          >
            <div className="h-12 w-12 bg-accent-gold/10 text-accent-gold rounded-2xl flex items-center justify-center mb-4">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">Partage Facile</h3>
            <p className="text-text-2">Un lien unique pour votre catalogue. Partagez-le sur WhatsApp, Instagram ou Facebook.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}