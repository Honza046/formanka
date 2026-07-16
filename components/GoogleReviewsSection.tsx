'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { googleReviewItems, googleReviews, site } from '@/lib/data';

const ROTATE_MS = 6500;
const FADE_MS = 220;

function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}

function Stars({
  rating,
  size = 'sm',
  className = '',
}: {
  rating: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const iconClass = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <div className={`inline-flex items-center justify-center gap-0.5 ${className}`} aria-hidden>
      {Array.from({ length: 5 }, (_, starIndex) => {
        const filled = starIndex + 1 <= Math.round(rating);

        return (
          <Star
            key={starIndex}
            className={`${iconClass} ${filled ? 'fill-gold text-gold' : 'fill-navy/10 text-navy/15'}`}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof googleReviewItems)[number] }) {
  return (
    <article className="mx-auto w-full max-w-2xl px-2 text-center sm:px-6">
      <p className="font-serif text-xl leading-relaxed text-navy/85 sm:text-2xl">
        „{review.text}"
      </p>
      <p className="mt-6 text-sm font-semibold text-navy">{review.author}</p>
      <p className="mt-1 inline-flex items-center justify-center gap-2 text-xs text-navy/40">
        <Stars rating={review.rating} />
        <span>
          {review.relativeDate} · Google
        </span>
      </p>
    </article>
  );
}

export default function GoogleReviewsSection() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [progressKey, setProgressKey] = useState(0);
  const indexRef = useRef(0);
  const transitioningRef = useRef(false);

  indexRef.current = index;

  const advance = useCallback((nextIndex: number) => {
    if (transitioningRef.current) return;

    const normalized = (nextIndex + googleReviewItems.length) % googleReviewItems.length;
    if (normalized === indexRef.current) return;

    transitioningRef.current = true;
    setIsVisible(false);

    window.setTimeout(() => {
      setIndex(normalized);
      setIsVisible(true);
      setProgressKey((key) => key + 1);
      transitioningRef.current = false;
    }, FADE_MS);
  }, []);

  const goTo = useCallback(
    (nextIndex: number) => {
      const normalized = (nextIndex + googleReviewItems.length) % googleReviewItems.length;
      if (normalized === index) return;
      advance(normalized);
    },
    [advance, index],
  );

  const goNext = useCallback(() => {
    if (transitioningRef.current || googleReviewItems.length <= 1) return;
    advance(indexRef.current + 1);
  }, [advance]);

  useEffect(() => {
    if (googleReviewItems.length <= 1) return;

    const timer = window.setTimeout(() => {
      goNext();
    }, ROTATE_MS);

    return () => window.clearTimeout(timer);
  }, [goNext, progressKey]);

  return (
    <section className="relative overflow-hidden border-y border-navy/5 bg-gradient-to-b from-cream/70 via-ivory to-cream/50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(191_160_95_/_0.08),transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Hodnocení hostů</p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-navy sm:text-4xl">Co říkají na Google</h2>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-navy/60">
          <span className="inline-flex items-center gap-2 font-serif text-2xl font-bold text-navy">
            {formatRating(googleReviews.rating)}
            <Stars rating={googleReviews.rating} size="md" />
          </span>
          <span aria-hidden>·</span>
          <span>{googleReviews.reviewCount} recenzí</span>
          <span aria-hidden>·</span>
          <a
            href={site.googleMapsPlaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-navy underline-offset-2 transition hover:text-gold hover:underline"
          >
            Zobrazit na Google
          </a>
        </div>

        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Předchozí recenze"
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 p-1 text-navy/30 transition hover:text-gold sm:inline-flex"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.75} />
          </button>

          <div
            className={`px-0 transition-all duration-300 ease-out sm:px-12 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
            aria-live="polite"
          >
            <ReviewCard review={googleReviewItems[index]} />
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Další recenze"
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 p-1 text-navy/30 transition hover:text-gold sm:inline-flex"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {googleReviewItems.map((review, dotIndex) => {
            const isActive = dotIndex === index;

            return (
              <button
                key={`${review.author}-dot`}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Recenze ${dotIndex + 1}`}
                aria-current={isActive ? 'true' : undefined}
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'relative h-2 w-8 overflow-hidden bg-navy/10'
                    : 'h-2 w-2 bg-navy/12 hover:bg-navy/25'
                }`}
              >
                {isActive && (
                  <span
                    key={progressKey}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Čas do další recenze"
                    className="review-progress-fill absolute inset-y-0 left-0 w-full rounded-full bg-gold"
                    style={{ ['--review-duration' as string]: `${ROTATE_MS}ms` }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-center text-xs text-navy/40">
          Zobrazeno několik nedávných hodnocení z Google Maps.
        </p>
      </div>
    </section>
  );
}
