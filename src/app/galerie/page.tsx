import type { Metadata } from 'next';
import GalerieSection from '@/components/GalerieSection';
import PageHero from '@/components/PageHero';
import { pageHeroImages } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Galerie | Na Formance Žeravice',
  description: 'Fotografie restaurace Na Formance v Žeravicích.',
};

export default function GaleriePage() {
  return (
    <main>
      <PageHero
        eyebrow="Prohlédněte si nás"
        title="Galerie"
        description="Restaurace, zahrádka a akce, které u nás pořádáme."
        image={pageHeroImages.galerie.image}
        imageAlt={pageHeroImages.galerie.imageAlt}
      />
      <GalerieSection hideHeader />
    </main>
  );
}
