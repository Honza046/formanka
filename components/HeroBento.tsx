import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CalendarHeart,
  Pizza,
  UtensilsCrossed,
  Wine,
} from 'lucide-react';
import { HOME_SURFACE_RADIUS } from '@/lib/home-layout';
import { pizzaInfo, services, site } from '@/lib/data';

const cardBase = `flex flex-col ${HOME_SURFACE_RADIUS} p-6 shadow-sm transition-shadow hover:shadow-md lg:p-7`;
const cardLink = `group ${cardBase} justify-between`;
const homeServices = services.slice(0, 4);

type HeroBentoProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function HeroBento({ eyebrow, title, description }: HeroBentoProps) {
  return (
    <section id="uvod" className="bg-white px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">{eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy/60">{description}</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
            <article className={`${cardBase} border border-navy/5 bg-white md:col-span-2 lg:col-span-1`}>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy/5 text-navy">
                  <UtensilsCrossed className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-navy">Vítejte u nás!</h2>
                  <p className="text-sm text-navy/50">{site.address.note}</p>
                </div>
              </div>

              <div className="flex-1">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {homeServices.map((service) => (
                    <li
                      key={service}
                      className="flex items-start gap-2 rounded-2xl bg-cream px-3 py-2.5 text-sm text-navy"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {service}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/catering"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:gap-3 hover:text-gold"
                >
                  Všechny služby
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            <Link
              href="/pizza/objednat"
              className={`group relative flex min-h-[280px] flex-col justify-end overflow-hidden ${HOME_SURFACE_RADIUS} md:col-span-2 lg:col-span-1 lg:min-h-0`}
            >
              <Image
                src={pizzaInfo.image}
                alt={pizzaInfo.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/45 to-navy/15" />

              <div className="relative p-6 lg:p-8">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
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
              </div>
            </Link>

            <div className="flex flex-col gap-5 md:col-span-2 lg:col-span-1">
              <Link href="/menu" className={`${cardLink} flex-1 border border-navy/5 bg-white`}>
                <div>
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-navy/5 text-navy">
                    <Wine className="h-5 w-5" />
                  </span>
                  <h2 className="font-serif text-xl font-bold text-navy">Menu</h2>
                  <p className="mt-2 text-sm leading-relaxed text-navy/60">
                    Stálá i letní nápojová nabídka. Kompletní lístek na podstránce.
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy group-hover:gap-3">
                  Zobrazit menu
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>

              <Link href="/catering#poptavka" className={`${cardLink} flex-1 bg-navy text-ivory hover:shadow-lg`}>
                <div>
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-gold-light">
                    <CalendarHeart className="h-5 w-5" />
                  </span>
                  <h2 className="font-serif text-xl font-bold">Catering &amp; akce</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/70">
                    Svatby, oslavy, firemní večírky i smuteční hostiny.
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3">
                  Poptat catering
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
