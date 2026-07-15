import type { Metadata, Viewport } from 'next';
import KitchenDashboard from '@/components/KitchenDashboard';

export const metadata: Metadata = {
  title: 'Kuchyně | Na Formance',
  description: 'Aplikace pro pizzera — správa objednávek.',
  robots: 'noindex, nofollow',
  appleWebApp: {
    capable: true,
    title: 'Kuchyně',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#14532d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function KitchenPage() {
  return (
    <main className="min-h-screen bg-slate-deep">
      <KitchenDashboard />
    </main>
  );
}
