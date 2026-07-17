'use client';

import { useEffect } from 'react';

/** Registruje service worker pro instalovatelnou kuchyňskou PWA. */
export default function KitchenServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw-kitchen.js', { scope: '/' }).catch(() => {
      /* ignore */
    });
  }, []);

  return null;
}
