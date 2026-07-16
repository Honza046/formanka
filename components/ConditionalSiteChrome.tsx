'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function ConditionalSiteChrome({
  children,
  announcement,
  navbar,
  footer,
}: {
  children: ReactNode;
  announcement: ReactNode;
  navbar: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  const isKitchenApp = pathname.startsWith('/pizza/kuchyne');

  if (isKitchenApp) {
    return <>{children}</>;
  }

  return (
    <>
      {announcement}
      {navbar}
      {children}
      {footer}
    </>
  );
}
