import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import OpeningStatusPill from '@/components/OpeningStatusPill';
import { getOpeningStatus } from '@/lib/opening-status';
import { homeHero, site } from '@/lib/data';
import type { OpeningStatusSettings } from '@/lib/pizza-orders/types';

type HomeHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  openingStatusSettings?: Partial<OpeningStatusSettings>;
};

export default function HomeHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  openingStatusSettings,
}: HomeHeroProps) {
  const initialStatus = getOpeningStatus(new Date(), openingStatusSettings);

  return (
    <section className="relative min-h-[440px] overflow-hidden sm:min-h-[520px] lg:min-h-[58vh]">
      <Image
        src={homeHero.image}
        alt={homeHero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_35%]"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/50 to-navy/30"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/30 to-transparent sm:via-navy/15"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[440px] max-w-7xl flex-col justify-end px-4 pb-10 pt-10 sm:min-h-[520px] sm:px-6 sm:pb-14 lg:min-h-[58vh] lg:px-8 lg:pb-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-light">{eyebrow}</p>

        <p className="mt-4 font-serif text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
          {site.name}
        </p>

        <h1 className="sr-only">{title}</h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-white/85 sm:text-xl">
          {description || title}
        </p>

        <div className="mt-5">
          <OpeningStatusPill
            variant="onDark"
            settings={openingStatusSettings}
            initialStatus={initialStatus}
            showPhone={false}
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/pizza/objednat"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light"
          >
            {primaryCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/20"
          >
            {secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
