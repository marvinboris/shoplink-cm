import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center">
            <span className="text-xl">🛒</span>
          </div>
          <span className="font-display font-bold text-xl text-text-1">ShopLink</span>
        </div>
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-2xl bg-primary text-white font-semibold text-sm hover:bg-primary-light transition-colors"
        >
          Se connecter
        </Link>
      </header>

      {/* Hero */}
      <main className="px-6 pt-12 pb-20 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft text-primary text-sm font-medium mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Nouveau : Paiements MoMo & Orange disponibles
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-1 mb-6 leading-tight">
            Votre boutique en ligne en{' '}
            <span className="text-primary">5 minutes</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-2 mb-8 max-w-xl mx-auto">
            Créez votre boutique professionnelle. Recevez paiements MTN MoMo & Orange Money.
            Gérez tout depuis votre téléphone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-light transition-colors shadow-warm-lg flex items-center justify-center gap-2"
            >
              Créer ma boutique gratuite
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/boutique/demo"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-surface border border-border text-text-1 font-semibold text-lg hover:bg-surface-2 transition-colors flex items-center justify-center gap-2"
            >
              Voir une démo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {[
            {
              emoji: '⚡',
              title: 'Onboarding en 5 min',
              desc: 'Numéro de téléphone, nom de boutique, premier produit. C\'est tout.',
            },
            {
              emoji: '💰',
              title: 'MTN & Orange Money',
              desc: 'Recevez paiements directement sur votre mobile en temps réel.',
            },
            {
              emoji: '📱',
              title: '100% Mobile',
              desc: 'Gérez vos commandes et produits depuis votre téléphone.',
            },
            {
              emoji: '🎨',
              title: '8 Beaux Thèmes',
              desc: 'Personnalisez votre boutique pour refléter votre marque.',
            },
            {
              emoji: '📊',
              title: 'Analytics Intégrées',
              desc: 'Savoir d\'où viennent vos clients et optimiser vos ventes.',
            },
            {
              emoji: '🔗',
              title: 'QR Code Imprimable',
              desc: 'Partagez votre boutique sur les marchés et dans les marchés.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-surface rounded-3xl p-6 shadow-warm hover:shadow-warm-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="font-display font-bold text-lg text-text-1 mb-2">
                {feature.title}
              </h3>
              <p className="text-text-2">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-8 mb-6">
            {[
              { value: '10K+', label: 'Vendeurs' },
              { value: '50K+', label: 'Commandes' },
              { value: '4.9★', label: 'Note moyenne' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-outfit text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-text-3">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-text-2">
            Rejoignez les vendeuses qui ont déjà fait le switch vers ShopLink
          </p>
        </div>

        {/* Pricing Preview */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-4">
            Simple & Transparent
          </h2>
          <p className="text-text-2 text-center mb-10 max-w-xl mx-auto">
            Commencez gratuitement. Passez à Starter ou Pro quand votre business grossit.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Gratuit',
                price: '0',
                features: ['10 produits', '30 commandes/mois', 'Logo ShopLink'],
                commission: '3%',
                highlight: false,
              },
              {
                name: 'Starter',
                price: '2 000',
                period: 'FCFA/mois',
                features: ['50 produits', 'Commandes illimitées', '8 thèmes premium', 'Stats 30j'],
                commission: '1.5%',
                highlight: true,
              },
              {
                name: 'Pro',
                price: '5 000',
                period: 'FCFA/mois',
                features: ['Produits illimités', 'Commission 0%', 'Analytics avancées', 'QR Code'],
                commission: '0%',
                highlight: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-3xl p-6 ${
                  plan.highlight
                    ? 'bg-primary text-white scale-105 shadow-warm-xl'
                    : 'bg-surface shadow-warm'
                }`}
              >
                <h3 className={`font-display font-bold text-xl mb-1 ${!plan.highlight && 'text-text-1'}`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`font-outfit text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-text-1'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-text-3'}`}>
                      {' '}{plan.period}
                    </span>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-white/90' : 'text-text-2'}`}>
                      <span className={plan.highlight ? 'text-white' : 'text-success'}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className={`text-xs ${plan.highlight ? 'text-white/70' : 'text-text-3'}`}>
                  Commission: {plan.commission}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-sm">🛒</span>
            </div>
            <span className="font-display font-bold text-text-1">ShopLink CM</span>
          </div>
          <p className="text-sm text-text-3">
            © 2026 ShopLink. Le social commerce camerounais.
          </p>
        </div>
      </footer>
    </div>
  );
}
