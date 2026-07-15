import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PizzaOrderForm from '@/components/PizzaOrderForm';
import { pizzaInfo } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Objednat pizzu | Na Formance - Žeravice',
  description: 'Online objednávka pizzy k vyzvednutí v Žeravicích.',
};

export default function PizzaOrderPage() {
  return (
    <main>
      <PageHero
        eyebrow="K vyzvednutí"
        title="Objednat pizzu"
        description={`${pizzaInfo.note} Vyberte pizzy, zadejte čas vyzvednutí a my vám objednávku potvrdíme.`}
      />

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <PizzaOrderForm />
        </div>
      </section>
    </main>
  );
}
