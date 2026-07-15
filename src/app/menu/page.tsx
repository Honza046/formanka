import type { Metadata } from 'next';
import { UtensilsCrossed } from 'lucide-react';
import PageHero from '@/components/PageHero';
import DrinkMenuTabs from '@/components/DrinkMenuTabs';

export const metadata: Metadata = {
  title: 'Menu | Na Formance - Žeravice',
  description: 'Stálá a letní nápojová nabídka restaurace Na Formance v Žeravicích.',
};

export default function MenuPage() {
  return (
    <main>
      <PageHero
        eyebrow="Nápojový lístek"
        title="Menu"
        description="Prohlédněte si naši stálou i letní nápojovou nabídku. Aktuální ceny Vám rádi sdělíme na místě nebo po telefonu."
      >
        <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-forest/10 px-4 py-2 text-sm text-forest">
          <UtensilsCrossed className="h-4 w-4" />
          Nabídka se může lišit dle sezóny
        </div>
      </PageHero>

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <DrinkMenuTabs />
        </div>
      </section>
    </main>
  );
}
