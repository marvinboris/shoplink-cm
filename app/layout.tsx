import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, DM_Sans, Outfit } from 'next/font/google';
import { Providers } from '@/components/providers/query-provider';
import './globals.css';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'ShopLink CM - Boutique en ligne pour le Cameroun',
  description:
    'Créez votre boutique en ligne en 5 minutes. Recevez paiements MTN MoMo & Orange Money. Gérez vos commandes facilement.',
  keywords: ['e-commerce', 'Cameroun', 'boutique en ligne', 'MTN MoMo', 'Orange Money', 'vente en ligne'],
  authors: [{ name: 'ShopLink CM' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ShopLink CM',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/icon-192.png', sizes: '192x192' },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FF4D00',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${bricolageGrotesque.variable} ${dmSans.variable} ${outfit.variable}`}>
      <head>
      </head>
      <body className="min-h-screen bg-surface font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
