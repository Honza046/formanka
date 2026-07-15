'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteAnnouncementBar from '@/components/SiteAnnouncementBar';

export default function ConditionalSiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isKitchenApp = pathname.startsWith('/pizza/kuchyne');

  if (isKitchenApp) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteAnnouncementBar />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
