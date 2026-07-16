import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { unstable_noStore as noStore } from 'next/cache';
import { Analytics } from '@vercel/analytics/next';
import ConditionalSiteChrome from '@/components/ConditionalSiteChrome';
import { site } from '@/lib/data';
import { getStore } from '@/lib/pizza-orders/store';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rodinná restaurace v Žeravicích | Na Formance Žeravice',
  description: site.description,
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  noStore();
  const store = await getStore();

  return (
    <html lang="cs" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-ivory font-sans text-slate-deep antialiased">
        <ConditionalSiteChrome announcement={store.siteAnnouncement}>{children}</ConditionalSiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
