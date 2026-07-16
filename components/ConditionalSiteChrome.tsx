'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteAnnouncementBar from '@/components/SiteAnnouncementBar';
import type { SiteAnnouncementSettings } from '@/lib/pizza-orders/types';

export default function ConditionalSiteChrome({
  children,
  announcement,
}: {
  children: React.ReactNode;
  announcement: SiteAnnouncementSettings | null;
}) {
  const pathname = usePathname();
  const isKitchenApp = pathname.startsWith('/pizza/kuchyne');

  if (isKitchenApp) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteAnnouncementBar announcement={announcement} />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
