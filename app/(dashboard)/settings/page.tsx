'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { SHOP_THEMES } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import {
  Palette,
  QrCode,
  Crown,
  Share2,
  Copy,
  ExternalLink,
  ChevronRight,
  Check,
  Download,
  MessageCircle,
} from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    features: ['10 produits', '30 commandes/mois', 'Logo ShopLink'],
    commission: '3%',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 2000,
    period: 'mois',
    features: ['50 produits', 'Commandes illimitées', '8 thèmes premium', 'Stats 30j'],
    commission: '1.5%',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 5000,
    period: 'mois',
    features: ['Produits illimités', 'Commission 0%', 'Domaine custom', 'Analytics avancées'],
    commission: '0%',
    popular: true,
  },
];

const DELIVERY_ZONES = [
  { city: 'Douala', fee: 1500, days: '1-2 jours' },
  { city: 'Yaoundé', fee: 2000, days: '1-2 jours' },
  { city: 'Autres villes', fee: 3500, days: '3-5 jours' },
];

export default function SettingsPage() {
  const [currentTheme, setCurrentTheme] = useState('sunset');
  const [showThemes, setShowThemes] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Paramètres</h1>
          <p className="text-sm text-text-3">Configurez votre boutique</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.open('/boutique/maries-closet', '_blank')}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Voir ma boutique
        </Button>
      </header>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-5 text-white overflow-hidden relative" padding="none">
          <div
            className="p-5"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="default" className="bg-white/20 text-white mb-2 border-0">
                  Plan actuel
                </Badge>
                <h2 className="font-display text-2xl font-bold mb-1">Starter</h2>
                <p className="text-white/80 text-sm">
                  Expire le 15 Mai 2026
                </p>
              </div>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setShowUpgrade(true)}
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">Commission par vente</span>
                <span className="font-semibold">1.5%</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-display font-bold text-text-1 mb-3">Apparence</h2>
        <Card className="p-0 bg-bg-surface border-border-subtle" variant="default">
          <button
            className="w-full flex items-center gap-4 p-4 text-left"
            onClick={() => setShowThemes(true)}
          >
            <div className="h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Thème de la boutique</p>
              <p className="text-sm text-text-3">8 thèmes disponibles</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-full border-2 border-border-subtle"
                style={{ backgroundColor: '#FF4D00' }}
              />
              <ChevronRight className="h-5 w-5 text-text-3" />
            </div>
          </button>
        </Card>
      </motion.div>

      {/* Shop Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="font-display font-bold text-text-1 mb-3">Lien de la boutique</h2>
        <Card className="p-4 bg-bg-surface border-border-subtle" variant="default">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-bg-elevated rounded-2xl px-4 py-3">
              <p className="text-sm text-text-2">shoplinkcm.com/</p>
              <p className="font-semibold text-text-1">maries-closet</p>
            </div>
            <Button variant="outline" size="icon">
              <Copy className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="outline" className="w-full">
            <ExternalLink className="mr-2 h-5 w-5" />
            Voir ma boutique
          </Button>
        </Card>
      </motion.div>

      {/* QR Code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 bg-bg-surface border-border-subtle" variant="default">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-text-1 rounded-2xl flex items-center justify-center">
              <QrCode className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">QR Code de la boutique</p>
              <p className="text-sm text-text-3 mb-3">
                Imprimez-le pour vos marchés et flyers
              </p>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Télécharger PNG
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Delivery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="font-display font-bold text-text-1 mb-3">Livraison</h2>
        <Card className="p-0 bg-bg-surface border-border-subtle" variant="default">
          {DELIVERY_ZONES.map((zone, i) => (
            <div
              key={zone.city}
              className={`flex items-center justify-between p-4 ${i > 0 ? 'border-t border-border-subtle' : ''}`}
            >
              <div>
                <p className="font-medium">{zone.city}</p>
                <p className="text-sm text-text-3">{zone.days}</p>
              </div>
              <p className="font-semibold">{formatPrice(zone.fee)}</p>
            </div>
          ))}
        </Card>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-display font-bold text-text-1 mb-3">Méthodes de paiement</h2>
        <Card className="p-0 bg-bg-surface border-border-subtle" variant="default">
          <div className="flex items-center gap-4 p-4">
            <div className="h-12 w-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-xl font-bold">
              M
            </div>
            <div className="flex-1">
              <p className="font-medium">MTN Mobile Money</p>
              <p className="text-sm text-accent-green">Configuré</p>
            </div>
            <Badge variant="success" size="sm">
              <Check className="h-3 w-3 mr-1" />
              Actif
            </Badge>
          </div>
          <div className="border-t border-border-subtle flex items-center gap-4 p-4">
            <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-xl font-bold text-white">
              O
            </div>
            <div className="flex-1">
              <p className="font-medium">Orange Money</p>
              <p className="text-sm text-text-3">Non configuré</p>
            </div>
            <Button variant="outline" size="sm">
              Configurer
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* WhatsApp */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="p-4 bg-bg-surface border-border-subtle" variant="default">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-500 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Notifications WhatsApp</p>
              <p className="text-sm text-text-3">
                Recevez vos commandes par WhatsApp
              </p>
            </div>
            <Toggle defaultChecked />
          </div>
        </Card>
      </motion.div>

      {/* Shop Themes Bottom Sheet */}
      <BottomSheet
        isOpen={showThemes}
        onClose={() => setShowThemes(false)}
        title="Thèmes de la boutique"
      >
        <div className="grid grid-cols-2 gap-3">
          {SHOP_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setCurrentTheme(theme.id);
                setShowThemes(false);
              }}
              className={`relative p-3 rounded-2xl border-2 transition-all press-effect ${
                currentTheme === theme.id
                  ? 'border-primary shadow-primary'
                  : 'border-border-subtle hover:border-primary/50'
              }`}
            >
              <div
                className="h-20 rounded-xl mb-2"
                style={{ backgroundColor: theme.backgroundColor }}
              >
                <div className="flex items-end justify-center h-full pb-2 gap-1">
                  <div
                    className="w-6 h-8 rounded"
                    style={{ backgroundColor: theme.cardColor }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                </div>
              </div>
              <p className="font-medium text-sm text-text-1">{theme.name}</p>
              {currentTheme === theme.id && (
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Upgrade Bottom Sheet */}
      <BottomSheet
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        title="Upgrade votre plan"
      >
        <div className="space-y-4">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-4 bg-bg-surface border ${
                plan.popular ? 'border-primary border-2' : 'border-border-subtle'
              }`}
              variant="default"
            >
              {plan.popular && (
                <Badge variant="default" className="mb-2 bg-primary text-white border-0">Le plus populaire</Badge>
              )}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-text-1">{plan.name}</h3>
                <div className="text-right">
                  <p className="font-outfit font-bold text-xl">
                    {plan.price === 0 ? 'Gratuit' : `${formatPrice(plan.price)}`}
                  </p>
                  {plan.period && (
                    <p className="text-xs text-text-3">/{plan.period}</p>
                  )}
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent-green" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                <span className="text-sm text-text-2">Commission</span>
                <span className="font-semibold text-primary">{plan.commission}</span>
              </div>
              <Button
                className="w-full mt-3"
                variant={plan.id === 'starter' ? 'secondary' : 'outline'}
              >
                {plan.id === 'free' ? 'Plan actuel' : 'Choisir ce plan'}
              </Button>
            </Card>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
