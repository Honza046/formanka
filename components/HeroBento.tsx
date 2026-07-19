import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  ArrowRight,
  CalendarHeart,
  Instagram,
  Pizza,
  UtensilsCrossed,
  Wine,
} from 'lucide-react';
import { HOME_SURFACE_RADIUS } from '@/lib/home-layout';
import { pageHeroImages, pizzaInfo, services, site } from '@/lib/data';

const homeServices = services.slice(0, 6);

type HeroBentoProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function PhotoSurface({
  image,
  imageAlt,
  sizes,
  className = '',
  children,
}: {
  image: string;
  imageAlt: string;
  sizes: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`group relative flex flex-col justify-end overflow-hidden ${HOME_SURFACE_RADIUS} ${className}`}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes={sizes}
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/92 via-navy/55 to-navy/25" />
      <div className="relative flex h-full flex-col justify-end p-6 lg:p-7">{children}</div>
    </div>
  );
}

export default function HeroBento({ eyebrow, title, description }: HeroBentoProps) {
  return (
    <section id="uvod" className="bg-white px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">{eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy/60">{description}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
          <article className="md:col-span-2 lg:col-span-1">
            <PhotoSurface
              image="/hero.jpg"
              imageAlt={`Restaurace ${site.name}, ${site.address.note}`}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="h-full min-h-[280px] shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                  <UtensilsCrossed className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">Vítejte u nás!</h2>
                  <p className="text-sm text-white/65">{site.address.note}</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-white/80">
                Kompletní servis včetně rautů a cateringu na míru. Rádi připravíme oslavu, svatbu i
                firemní večírek.
              </p>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {homeServices.map((service) => (
                  <li
                    key={service}
                    className="flex items-start gap-2 rounded-2xl bg-white/10 px-3 py-2.5 text-sm text-white backdrop-blur-sm"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-light" />
                    {service}
                  </li>
                ))}
              </ul>

              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center gap-3 rounded-2xl bg-white/12 px-3.5 py-3 text-white ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/18"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/90 text-navy">
                  <Instagram className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">Sledujte nás na Instagramu</span>
                  <span className="block truncate text-xs text-white/65">@formanka_zeravice</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-gold-light" />
              </a>

              <Link
                href="/catering"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:gap-3 hover:text-gold-light"
              >
                Všechny služby
                <ArrowRight className="h-4 w-4" />
              </Link>
            </PhotoSurface>
          </article>

          <Link
            href="/pizza/objednat"
            className="block min-h-[280px] md:col-span-2 lg:col-span-1 lg:min-h-0"
          >
            <PhotoSurface
              image={pizzaInfo.image}
              imageAlt={pizzaInfo.imageAlt}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="h-full min-h-[280px] shadow-sm lg:min-h-full"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                <Pizza className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-bold text-white">{pizzaInfo.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{pizzaInfo.note}</p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-gold-light">
                {pizzaInfo.schedule}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3">
                Objednat online
                <ArrowRight className="h-4 w-4" />
              </span>
            </PhotoSurface>
          </Link>

          <div className="flex flex-col gap-5 md:col-span-2 lg:col-span-1">
            <Link href="/menu" className="block min-h-[180px] flex-1">
              <PhotoSurface
                image={pageHeroImages.menu.image}
                imageAlt={pageHeroImages.menu.imageAlt}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-full min-h-[180px] shadow-sm"
              >
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                  <Wine className="h-5 w-5" />
                </span>
                <h2 className="font-serif text-xl font-bold text-white">Menu</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Stálá i letní nápojová nabídka. Kompletní lístek na podstránce.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3">
                  Zobrazit menu
                  <ArrowRight className="h-4 w-4" />
                </span>
              </PhotoSurface>
            </Link>

            <Link href="/catering#poptavka" className="block min-h-[180px] flex-1">
              <PhotoSurface
                image={pageHeroImages.catering.image}
                imageAlt={pageHeroImages.catering.imageAlt}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-full min-h-[180px] shadow-sm"
              >
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-gold-light backdrop-blur-sm">
                  <CalendarHeart className="h-5 w-5" />
                </span>
                <h2 className="font-serif text-xl font-bold text-white">Catering &amp; akce</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Svatby, oslavy, firemní večírky i smuteční hostiny.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3">
                  Poptat catering
                  <ArrowRight className="h-4 w-4" />
                </span>
              </PhotoSurface>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
