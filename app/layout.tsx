import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/providers/query-provider';
import './globals.css';

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
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-surface font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
