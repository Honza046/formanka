import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HOME_SURFACE_RADIUS } from '@/lib/home-layout';
import {
  formatPrice,
  homePizzaFeatured,
  pizzaInfo,
  pizzaMenu,
  pizzaOrderSteps,
} from '@/lib/data';

const featuredPizzas = homePizzaFeatured
  .map((name) => pizzaMenu.find((pizza) => pizza.name === name))
  .filter((pizza): pizza is (typeof pizzaMenu)[number] => pizza !== undefined);

export default function HomePizzaTeaser() {
  return (
    <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Víkendová nabídka</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-navy sm:text-4xl">{pizzaInfo.title}</h2>
          <p className="mx-auto mt-3 max-w-lg text-navy/60">{pizzaInfo.note}</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-navy">{pizzaInfo.schedule}</p>
        </div>

        <div className={`${HOME_SURFACE_RADIUS} border border-navy/5 bg-white p-6 shadow-sm sm:p-8`}>
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <div>
              <h3 className="font-serif text-xl font-bold text-navy">Oblíbené druhy</h3>
              <ul className="mt-5 space-y-3">
                {featuredPizzas.map((pizza) => (
                  <li
                    key={pizza.name}
                    className="flex items-start justify-between gap-4 rounded-2xl bg-cream px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-navy">{pizza.name}</p>
                      <p className="mt-0.5 text-sm text-navy/55">{pizza.description}</p>
                    </div>
                    <span className="shrink-0 font-semibold text-gold">{formatPrice(pizza.price)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/pizza/objednat"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-light sm:w-auto"
                >
                  Objednat online
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pizza"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy ring-1 ring-navy/10 transition hover:ring-gold/40 sm:w-auto"
                >
                  Celá nabídka
                </Link>
              </div>
            </div>

            <div className="border-t border-navy/5 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <h3 className="font-serif text-xl font-bold text-navy">Jak objednat pizzu</h3>
              <ol className="mt-5 space-y-5">
                {pizzaOrderSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-ivory">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-navy">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-navy/60">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
