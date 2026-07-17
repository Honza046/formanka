'use client';

import { Download, Share, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const media = window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return media || iosStandalone;
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function InstallKitchenApp({ variant = 'banner' }: { variant?: 'banner' | 'card' }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    try {
      if (localStorage.getItem('kitchen-pwa-dismissed') === '1') {
        setDismissed(true);
      }
    } catch {
      /* ignore */
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem('kitchen-pwa-dismissed', '1');
    } catch {
      /* ignore */
    }
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferred(null);
      return;
    }

    if (isIos()) {
      setShowIosHelp(true);
    }
  };

  const canPrompt = Boolean(deferred);
  const ios = isIos();

  if (!canPrompt && !ios && variant === 'banner') return null;

  const shellClass =
    variant === 'card'
      ? 'rounded-2xl border border-navy/10 bg-white p-4 text-left shadow-sm'
      : 'relative rounded-2xl border border-navy/10 bg-white px-4 py-3 shadow-sm';

  return (
    <div className={shellClass}>
      {variant === 'banner' && (
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 top-2 rounded-lg p-1.5 text-navy/40 transition hover:bg-cream hover:text-navy"
          aria-label="Zavřít"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className={variant === 'banner' ? 'pr-8' : ''}>
        <p className="text-sm font-semibold text-navy">Nainstalovat do telefonu</p>
        <p className="mt-1 text-xs leading-relaxed text-navy/55">
          Otevře se jako běžná aplikace z plochy — bez prohlížeče nahoře.
        </p>
      </div>

      {showIosHelp ? (
        <ol className="mt-3 space-y-2 text-xs text-navy/70">
          <li className="flex gap-2">
            <span className="font-semibold text-gold">1.</span>
            <span>
              Klepněte na <Share className="inline h-3.5 w-3.5 text-navy" /> Sdílet v Safari
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-gold">2.</span>
            <span>Zvolte „Na plochu“ / „Add to Home Screen“</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-gold">3.</span>
            <span>Potvrďte „Přidat“ — ikona bude logo Na Formance</span>
          </li>
        </ol>
      ) : canPrompt ? (
        <button
          type="button"
          onClick={install}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-navy py-3 text-sm font-semibold text-ivory transition hover:bg-navy-light active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />
          Nainstalovat aplikaci
        </button>
      ) : ios ? (
        <button
          type="button"
          onClick={install}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-navy py-3 text-sm font-semibold text-ivory transition hover:bg-navy-light active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />
          Jak nainstalovat na iPhone
        </button>
      ) : (
        <p className="mt-3 text-xs leading-relaxed text-navy/55">
          V Chrome klepněte na menu <span className="font-semibold text-navy">⋮</span> a zvolte
          „Nainstalovat aplikaci“ / „Install app“.
        </p>
      )}
    </div>
  );
}
