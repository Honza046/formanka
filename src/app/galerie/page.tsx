import type { Metadata } from 'next';
import GalerieSection from '@/components/GalerieSection';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Galerie | Na Formance - Žeravice',
  description: 'Fotografie restaurace Na Formance v Žeravicích.',
};

export default function GaleriePage() {
  return (
    <main>
      <PageHero
        eyebrow="Prohlédněte si nás"
        title="Galerie"
        description="Restaurace, zahrádka a akce, které u nás pořádáme."
      />
      <GalerieSection hideHeader />
    </main>
  );
}
