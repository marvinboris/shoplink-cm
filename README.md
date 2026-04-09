# ShopLink CM

> SaaS de gestion & paiement pour le social commerce Camerounais

## Quick Start

### Prerequisites

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Africa's Talking (pour SMS)
- Compte CinetPay ou Campay (pour paiements)

### Installation

```bash
# Cloner le projet
git clone <repo-url>
cd shoplink-cm

# Installer les dépendances
npm install

# Variables d'environnement
cp .env.example .env.local
```

### Configuration des variables d'environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Africa's Talking (SMS)
AFRICASTALKING_API_KEY=your-api-key
AFRICASTALKING_USERNAME=your-username

# CinetPay (Paiements)
CINETPAY_API_KEY=your-api-key
CINETPAY_SITE_ID=your-site-id
CINETPAY_WEBHOOK_SECRET=your-webhook-secret

# Campay (Fallback paiements)
CAMPAY_USERNAME=your-username
CAMPAY_PASSWORD=your-password

# Cloudinary (Images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Revalidation ISR
REVALIDATE_SECRET=your-revalidation-secret
```

### Database Setup

1. Créez un projet sur [Supabase](https://supabase.com)
2. Exécutez la migration SQL dans `supabase/migrations/001_initial_schema.sql`
3. Activez Row Level Security (RLS) sur toutes les tables
4. Configurez les policies selon le schema

### Development

```bash
npm run dev
```

L'app sera disponible sur http://localhost:3000

### Build

```bash
npm run build
npm start
```

## Architecture

```
shoplink-cm/
├── app/
│   ├── (auth)/          # Pages d'authentification
│   ├── (dashboard)/     # Dashboard vendeur
│   ├── (catalog)/      # Catalogue public
│   └── api/            # API routes
├── components/
│   ├── ui/             # Design system
│   ├── dashboard/       # Composants dashboard
│   └── catalog/         # Composants catalogue
├── lib/
│   ├── types/           # Types TypeScript
│   ├── supabase/        # Client Supabase
│   ├── stores/          # Zustand stores
│   └── hooks/           # TanStack Query hooks
└── public/              # Assets statiques
```

## Features

- [x] Auth OTP par SMS
- [x] Onboarding 4 étapes
- [x] Dashboard avec stats temps réel
- [x] Gestion produits (CRUD)
- [x] Catalogue public avec 8 thèmes
- [x] Flow commande complet
- [x] Kanban commandes
- [x] Analytics (Recharts)
- [x] Paramètres boutique
- [x] Upgrade abonnement
- [x] PWA ready

## Stack Technique

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
- **State**: Zustand, TanStack Query
- **Paiements**: CinetPay, Campay
- **SMS**: Africa's Talking
- **Images**: Cloudinary
- **Analytics**: Recharts

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

Configurez les variables d'environnement dans le dashboard Vercel.

### Supabase

Les Edge Functions sont déployées automatiquement avec le projet Supabase.

## TODO

- [ ] Tests E2E avec Playwright
- [ ] Intégration Stripe pour paiements internationaux
- [ ] WhatsApp Business API integration
- [ ] Import catalogue WhatsApp Business
- [ ] Multi-langue (EN/FR)
- [ ] Push notifications

## License

MIT
