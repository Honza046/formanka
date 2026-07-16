'use client';

import { Phone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getOpeningStatus, type OpeningStatus } from '@/lib/opening-status';
import { site } from '@/lib/data';
import type { OpeningStatusSettings } from '@/lib/pizza-orders/types';

const variantStyles: Record<OpeningStatus['variant'], { dot: string; ring: string; dotAnimation: string }> = {
  open: { dot: 'bg-emerald-500', ring: 'ring-emerald-500/20', dotAnimation: 'animate-status-dot-open' },
  soon: { dot: 'bg-red-500', ring: 'ring-red-500/20', dotAnimation: 'animate-status-dot-blink' },
  closed: { dot: 'bg-red-500', ring: 'ring-red-500/20', dotAnimation: 'animate-status-dot-blink' },
};

type OpeningStatusPillProps = {
  variant?: 'default' | 'onDark';
  settings?: Partial<OpeningStatusSettings>;
};

export default function OpeningStatusPill({ variant = 'default', settings }: OpeningStatusPillProps) {
  const [status, setStatus] = useState<OpeningStatus | null>(null);
  const [showAlternate, setShowAlternate] = useState(false);
  const [displayMessage, setDisplayMessage] = useState('Načítám otevírací dobu…');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setStatus(getOpeningStatus(new Date(), settings));
    const timer = window.setInterval(() => setStatus(getOpeningStatus(new Date(), settings)), 60_000);
    return () => window.clearInterval(timer);
  }, [settings]);

  useEffect(() => {
    setShowAlternate(false);
  }, [status?.message, status?.alternateMessage]);

  useEffect(() => {
    if (!status?.alternateMessage) return;

    const timer = window.setInterval(() => {
      setShowAlternate((current) => !current);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [status?.message, status?.alternateMessage]);

  const nextMessage = useMemo(() => {
    if (!status) return null;
    if (status.alternateMessage && showAlternate) return status.alternateMessage;
    return status.message;
  }, [status, showAlternate]);

  const displayVariant: OpeningStatus['variant'] = status?.variant === 'open' ? 'open' : 'closed';

  useEffect(() => {
    if (!nextMessage) return;
    if (nextMessage === displayMessage) return;

    setIsVisible(false);
    const timer = window.setTimeout(() => {
      setDisplayMessage(nextMessage);
      setIsVisible(true);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [nextMessage, displayMessage]);

  const widthMessage = useMemo(() => {
    const candidates = [
      settings?.closedLabel ?? 'Nyní máme zavřeno',
      status?.message,
      status?.alternateMessage,
    ].filter((value): value is string => Boolean(value));

    return candidates.reduce((longest, current) => (current.length > longest.length ? current : longest), '');
  }, [settings?.closedLabel, status?.alternateMessage, status?.message]);

  const styles = variantStyles[displayVariant];
  const onDark = variant === 'onDark';
  const pillClass = onDark
    ? 'bg-white/10 text-white/90 ring-white/20 backdrop-blur-sm hover:bg-white/15'
    : 'bg-ivory text-navy/80 ring-navy/5 hover:ring-gold/40';

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 ${styles.ring} ${pillClass}`}
        suppressHydrationWarning
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${styles.dot} ${status ? styles.dotAnimation : ''}`}
          aria-hidden
        />
        <span className="relative inline-block">
          <span className="invisible block whitespace-nowrap select-none" aria-hidden>
            {widthMessage}
          </span>
          <span
            className={`absolute inset-0 flex items-center whitespace-nowrap transition-opacity duration-300 ease-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {displayMessage}
          </span>
        </span>
      </span>

      <a
        href={`tel:${site.phones[0].replace(/\s/g, '')}`}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 transition ${pillClass}`}
      >
        <Phone className={`h-4 w-4 ${onDark ? 'text-gold-light' : 'text-gold'}`} />
        {site.phones[0]}
      </a>
    </div>
  );
}
