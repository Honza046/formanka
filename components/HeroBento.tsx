import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarHeart, Pizza, Wine } from 'lucide-react';
import { pizzaInfo, services, site } from '@/lib/data';

const homeServices = services.slice(0, 4);

type HeroBentoProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function HeroBento({ eyebrow, title, description }: HeroBentoProps) {
  return (
    <section id="uvod" className="bg-ivory px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">{eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy sm:text-4xl">{title}</h2>
          <p className="mt-4 text-navy/60">{description}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <h3 className="font-serif text-2xl font-bold text-navy">Vítejte u nás</h3>
            <p className="mt-1 text-sm text-navy/45">{site.address.note}</p>
            <ul className="mt-6 space-y-3">
              {homeServices.map((service) => (
                <li key={service} className="flex items-start gap-3 text-sm text-navy/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {service}
                </li>
              ))}
            </ul>
            <Link
              href="/catering"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:gap-3 hover:text-gold"
            >
              Všechny služby
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/pizza/objednat"
              className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-3xl"
            >
              <Image
                src={pizzaInfo.image}
                alt={pizzaInfo.imageAlt}
                fill
                sizes="(max-width: 1024px) 50vw, 28vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
              <div className="relative p-6">
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-light">
                  <Pizza className="h-3.5 w-3.5" />
                  {pizzaInfo.schedule}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">{pizzaInfo.title}</h3>
                <p className="mt-1 text-sm text-white/75">{pizzaInfo.note}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Objednat
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Link
                href="/menu"
                className="group flex items-center justify-between gap-4 border-b border-navy/10 py-4 transition hover:border-gold/40"
              >
                <span className="flex items-center gap-3">
                  <Wine className="h-5 w-5 text-gold" />
                  <span>
                    <span className="block font-serif text-lg font-bold text-navy">Menu</span>
                    <span className="text-sm text-navy/50">Nápojový lístek</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-navy/30 transition group-hover:translate-x-0.5 group-hover:text-gold" />
              </Link>
              <Link
                href="/catering#poptavka"
                className="group flex items-center justify-between gap-4 border-b border-navy/10 py-4 transition hover:border-gold/40"
              >
                <span className="flex items-center gap-3">
                  <CalendarHeart className="h-5 w-5 text-gold" />
                  <span>
                    <span className="block font-serif text-lg font-bold text-navy">Catering</span>
                    <span className="text-sm text-navy/50">Svatby a oslavy</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-navy/30 transition group-hover:translate-x-0.5 group-hover:text-gold" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
