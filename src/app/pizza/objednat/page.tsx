import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import PageHero from '@/components/PageHero';
import PizzaOrderForm from '@/components/PizzaOrderForm';
import { pageHeroImages } from '@/lib/data';
import { getStore } from '@/lib/pizza-orders/store';

export const metadata: Metadata = {
  title: 'Objednat pizzu | Na Formance Žeravice',
  description: 'Online objednávka pizzy k vyzvednutí v Žeravicích.',
};

export default async function PizzaOrderPage() {
  noStore();
  const store = await getStore();
  const orderPage = store.orderPage;

  return (
    <main>
      <PageHero
        eyebrow="K vyzvednutí"
        title={orderPage.title}
        description={orderPage.description}
        image={pageHeroImages.pizza.image}
        imageAlt={pageHeroImages.pizza.imageAlt}
      />

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <PizzaOrderForm />
        </div>
      </section>
    </main>
  );
}
