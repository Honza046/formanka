import { unstable_noStore as noStore } from 'next/cache';
import HomeHero from '@/components/HomeHero';
import HeroBento from '@/components/HeroBento';
import HomePizzaTeaser from '@/components/HomePizzaTeaser';
import GalerieSection from '@/components/GalerieSection';
import HomeLocationSection from '@/components/HomeLocationSection';
import GoogleReviewsSection from '@/components/GoogleReviewsSection';
import { getStore } from '@/lib/pizza-orders/store';

export default async function HomePage() {
  noStore();
  const store = await getStore();
  const content = store.websiteContent.home;

  return (
    <main>
      <HomeHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        primaryCta={content.heroPrimaryCta}
        secondaryCta={content.heroSecondaryCta}
        openingStatusSettings={store.openingStatus}
      />
      <HeroBento
        eyebrow={content.introEyebrow}
        title={content.introTitle}
        description={content.introDescription}
      />
      <HomePizzaTeaser />
      <GalerieSection compact />
      <HomeLocationSection />
      <GoogleReviewsSection />
    </main>
  );
}
