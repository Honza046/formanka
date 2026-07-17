import type { Metadata, Viewport } from 'next';
import KitchenDashboard from '@/components/KitchenDashboard';

export const metadata: Metadata = {
  title: 'Kuchyně | Na Formance',
  description: 'Aplikace pro pizzera, správa objednávek.',
  robots: 'noindex, nofollow',
  applicationName: 'Kuchyně Na Formance',
  manifest: '/kitchen.webmanifest',
  icons: {
    icon: [
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo.jpg', type: 'image/jpeg', sizes: '984x984' },
    ],
    apple: [{ url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Kuchyně',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'Kuchyně | Na Formance',
    description: 'Aplikace pro pizzera, správa objednávek.',
    images: [{ url: '/logo.jpg', width: 984, height: 984, alt: 'Na Formance' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#283040',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function KitchenPage() {
  return (
    <main className="min-h-screen bg-ivory">
      <KitchenDashboard />
    </main>
  );
}
