import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { unstable_noStore as noStore } from 'next/cache';
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://formanka.vercel.app');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Rodinná restaurace v Žeravicích | Na Formance Žeravice',
  description: site.description,
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: site.fullName,
    title: 'Na Formance Žeravice',
    description: site.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Restaurace Na Formance v Žeravicích',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Na Formance Žeravice',
    description: site.description,
    images: ['/og-image.jpg'],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  noStore();
  const store = await getStore();

  return (
    <html lang="cs" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-ivory font-sans text-slate-deep antialiased">
        <ConditionalSiteChrome announcement={store.siteAnnouncement}>{children}</ConditionalSiteChrome>
      </body>
    </html>
  );
}
