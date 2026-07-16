import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import DrinkMenuTabs from '@/components/DrinkMenuTabs';
import { pageHeroImages } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Menu | Na Formance Žeravice',
  description: 'Stálá a letní nápojová nabídka restaurace Na Formance v Žeravicích.',
};

export default function MenuPage() {
  return (
    <main>
      <PageHero
        eyebrow="Nápojový lístek"
        title="Menu"
        description="Prohlédněte si naši stálou i letní nápojovou nabídku. Aktuální ceny Vám rádi sdělíme na místě nebo po telefonu."
        image={pageHeroImages.menu.image}
        imageAlt={pageHeroImages.menu.imageAlt}
        imagePosition="right"
      >
        <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-forest">
          Nabídka se může lišit dle sezóny
        </p>
      </PageHero>

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <DrinkMenuTabs />
        </div>
      </section>
    </main>
  );
}
