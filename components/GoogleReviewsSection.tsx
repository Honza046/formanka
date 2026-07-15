import { Star } from 'lucide-react';
import { googleReviews, site } from '@/lib/data';

function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}

export default function GoogleReviewsSection() {
  const fullStars = Math.floor(googleReviews.rating);
  const hasHalf = googleReviews.rating - fullStars >= 0.25 && googleReviews.rating - fullStars < 0.75;

  return (
    <section className="border-y border-navy/5 bg-cream/60 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex items-center justify-center gap-1" aria-label={`Hodnocení ${formatRating(googleReviews.rating)} z 5`}>
          {Array.from({ length: 5 }, (_, index) => {
            const starIndex = index + 1;
            const filled = starIndex <= fullStars;
            const half = !filled && hasHalf && starIndex === fullStars + 1;

            return (
              <Star
                key={starIndex}
                className={`h-5 w-5 ${
                  filled
                    ? 'fill-gold text-gold'
                    : half
                      ? 'fill-gold/45 text-gold'
                      : 'fill-navy/10 text-navy/15'
                }`}
                strokeWidth={1.5}
                aria-hidden
              />
            );
          })}
        </div>

        <p className="mt-3 text-sm text-navy/70">
          <span className="font-semibold text-navy">{formatRating(googleReviews.rating)}</span>
          {googleReviews.reviewCount !== null && (
            <> · {googleReviews.reviewCount} recenzí</>
          )}
          {' · '}
          {site.name} na Google
        </p>

        <a
          href={site.googleMapsPlaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-sm font-semibold text-navy underline decoration-gold/50 underline-offset-4 transition hover:decoration-gold"
        >
          Zobrazit recenze na Google
        </a>
      </div>
    </section>
  );
}
