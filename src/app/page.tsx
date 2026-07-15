import HomeHero from '@/components/HomeHero';
import HeroBento from '@/components/HeroBento';
import HomePizzaTeaser from '@/components/HomePizzaTeaser';
import GalerieSection from '@/components/GalerieSection';
import HomeLocationSection from '@/components/HomeLocationSection';
import GoogleReviewsSection from '@/components/GoogleReviewsSection';

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HeroBento />
      <HomePizzaTeaser />
      <GalerieSection compact />
      <HomeLocationSection />
      <GoogleReviewsSection />
    </main>
  );
}
