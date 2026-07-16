import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import OrderTrackingView from '@/components/OrderTrackingView';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Stav objednávky | Na Formance Žeravice',
  description: 'Sledujte stav vaší objednávky pizzy.',
  robots: 'noindex, nofollow',
};

export default async function OrderTrackingPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main>
      <PageHero
        eyebrow="Objednávka pizzy"
        title="Stav objednávky"
        description="Sledujte, zda kuchyně objednávku potvrdila a kdy si můžete pizzu vyzvednout."
      />

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <OrderTrackingView orderId={id} />
      </section>
    </main>
  );
}
