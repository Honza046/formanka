import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Phone, Pizza } from 'lucide-react';
import PageHero from '@/components/PageHero';
import PizzaMenuCard from '@/components/PizzaMenuCard';
import { pizzaInfo, site, formatPrice, pizzaExtras, pizzaBoxPrice } from '@/lib/data';
import { pizzaGallerySlots } from '@/lib/pizza-gallery';

export const metadata: Metadata = {
  title: 'Pizza | Na Formance - Žeravice',
  description: 'Domácí pizza v Žeravicích. Objednávky pátek až neděle.',
};

export default function PizzaPage() {
  return (
    <main>
      <PageHero
        eyebrow="Víkendová nabídka"
        title={pizzaInfo.title}
        description={pizzaInfo.note}
      >
        <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-forest">
          {pizzaInfo.schedule}
        </p>
      </PageHero>

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pizzaGallerySlots.map((pizza, index) => (
              <PizzaMenuCard key={pizza.name} pizza={pizza} priority={index < 4} />
            ))}
          </ul>

          <div className="mt-10 rounded-3xl border border-slate-deep/5 bg-ivory p-6 sm:p-8">
            <h2 className="font-serif text-xl font-bold text-slate-deep">Přísady na pizzu</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-terracotta">15,-</p>
                <ul className="flex flex-wrap gap-2">
                  {pizzaExtras.filter((e) => e.price === 15).map((extra) => (
                    <li
                      key={extra.name}
                      className="rounded-full bg-white px-3 py-1 text-sm text-slate-deep shadow-sm"
                    >
                      {extra.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-terracotta">20,-</p>
                <ul className="flex flex-wrap gap-2">
                  {pizzaExtras.filter((e) => e.price === 20).map((extra) => (
                    <li
                      key={extra.name}
                      className="rounded-full bg-white px-3 py-1 text-sm text-slate-deep shadow-sm"
                    >
                      {extra.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-deep/60">
              Krabice na pizzu: {formatPrice(pizzaBoxPrice)}
            </p>
          </div>

          <div className="mt-10 space-y-4">
            <Link
              href="/pizza/objednat"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light"
            >
              <Pizza className="h-5 w-5" />
              Objednat online
            </Link>
            <div className="grid gap-4 sm:grid-cols-2">
              {site.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-deep/10 bg-white px-6 py-4 text-sm font-semibold text-slate-deep transition-colors hover:border-forest/30"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:gap-3"
            >
              Máte dotaz? Kontaktujte nás
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
