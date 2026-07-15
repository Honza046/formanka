import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import OpeningStatusPill from '@/components/OpeningStatusPill';
import { homeHero, site } from '@/lib/data';

export default function HomeHero() {
  return (
    <section className="relative min-h-[420px] overflow-hidden sm:min-h-[480px] lg:min-h-[52vh]">
      <Image
        src={homeHero.image}
        alt={homeHero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_35%]"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-navy/35"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/25 to-transparent sm:via-navy/15"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-4 pb-10 pt-8 sm:min-h-[480px] sm:px-6 sm:pb-12 lg:min-h-[52vh] lg:px-8 lg:pb-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-light">
          Rodinná restaurace · {site.address.note}
        </p>

        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[3.25rem]">
          {site.name}
        </h1>

        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
          {site.taglineHero}
        </p>

        <div className="mt-6">
          <OpeningStatusPill variant="onDark" />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/pizza/objednat"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy shadow-sm transition hover:bg-gold-light"
          >
            Objednat pizzu
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/20"
          >
            Zobrazit menu
          </Link>
        </div>
      </div>
    </section>
  );
}
