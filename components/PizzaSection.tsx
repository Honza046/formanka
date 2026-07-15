import Link from 'next/link';
import { ArrowRight, Phone, Pizza } from 'lucide-react';
import { pizzaInfo, pizzaMenu, site, formatPrice } from '@/lib/data';

type PizzaSectionProps = {
  compact?: boolean;
};

export default function PizzaSection({ compact = false }: PizzaSectionProps) {
  const items = compact ? pizzaMenu.slice(0, 4) : pizzaMenu;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">Víkendová nabídka</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-slate-deep sm:text-4xl">{pizzaInfo.title}</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-deep/60">{pizzaInfo.note}</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-forest">{pizzaInfo.schedule}</p>
        </div>

        <div className="rounded-3xl border border-slate-deep/5 bg-ivory p-6 shadow-sm sm:p-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((pizza) => (
              <li
                key={pizza.name}
                className="rounded-2xl border border-slate-deep/5 bg-white px-5 py-4 text-center transition-colors hover:border-forest/20"
              >
                <p className="font-medium text-slate-deep">{pizza.name}</p>
                <p className="mt-1 text-sm font-semibold text-forest">{formatPrice(pizza.price)}</p>
              </li>
            ))}
            {compact && pizzaMenu.length > 4 && (
              <li className="rounded-2xl border border-dashed border-slate-deep/10 bg-white px-5 py-4 text-center text-sm text-slate-deep/50">
                +{pizzaMenu.length - 4} dalších druhů…
              </li>
            )}
          </ul>

          <div className="mt-8 rounded-2xl bg-forest/5 p-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
              {pizzaInfo.orderLabel}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {site.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-forest px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              ))}
            </div>
          </div>

          {compact && (
            <div className="mt-6 text-center">
              <Link
                href="/pizza"
                className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:gap-3"
              >
                Celá nabídka pizzy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
