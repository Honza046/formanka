'use client';

import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getOpeningStatus, type OpeningStatus } from '@/lib/opening-status';
import { site } from '@/lib/data';

const variantStyles: Record<OpeningStatus['variant'], { dot: string; ring: string }> = {
  open: { dot: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
  soon: { dot: 'bg-gold', ring: 'ring-gold/25' },
  closed: { dot: 'bg-red-500', ring: 'ring-red-500/20' },
};

type OpeningStatusPillProps = {
  variant?: 'default' | 'onDark';
};

export default function OpeningStatusPill({ variant = 'default' }: OpeningStatusPillProps) {
  const [status, setStatus] = useState<OpeningStatus | null>(null);

  useEffect(() => {
    setStatus(getOpeningStatus());
    const timer = window.setInterval(() => setStatus(getOpeningStatus()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const styles = status ? variantStyles[status.variant] : variantStyles.closed;
  const onDark = variant === 'onDark';
  const pillClass = onDark
    ? 'bg-white/10 text-white/90 ring-white/20 backdrop-blur-sm hover:bg-white/15'
    : `bg-ivory text-navy/80 ring-navy/5 hover:ring-gold/40`;

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 ${styles.ring} ${pillClass}`}
        suppressHydrationWarning
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} aria-hidden />
        <span>{status?.message ?? 'Načítám otevírací dobu…'}</span>
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
