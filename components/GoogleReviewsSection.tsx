'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { googleReviewItems, googleReviews, site } from '@/lib/data';

const ROTATE_MS = 6500;
const FADE_MS = 220;

function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',');
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const iconClass = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <div className="flex items-center gap-0.5" aria-hidden>
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

function avatarColor(name: string): string {
  const palette = [
    'bg-navy text-ivory',
    'bg-gold text-navy',
    'bg-forest text-ivory',
    'bg-cream text-navy ring-1 ring-navy/10',
  ];

  return palette[name.charCodeAt(0) % palette.length];
}

function ReviewCard({ review }: { review: (typeof googleReviewItems)[number] }) {
  return (
    <article className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-navy/5 bg-white p-6 shadow-[0_8px_30px_rgb(40_48_64_/_0.06)] sm:p-8">
      <Quote
        className="pointer-events-none absolute -right-2 -top-1 h-16 w-16 text-gold/10 sm:h-20 sm:w-20"
        strokeWidth={1}
        aria-hidden
      />

      <div className="relative flex items-start gap-3.5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ${avatarColor(review.author)}`}
          aria-hidden
        >
          {review.author.charAt(0)}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-semibold text-navy">{review.author}</p>
          <p className="mt-0.5 text-xs text-navy/45">Recenze na Google</p>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2.5">
        <Stars rating={review.rating} size="md" />
        <span className="text-xs text-navy/40">·</span>
        <span className="text-xs text-navy/45">{review.relativeDate}</span>
      </div>

      <p className="relative mt-5 font-serif text-lg leading-relaxed text-navy/80 sm:text-xl">
        „{review.text}"
      </p>
    </article>
  );
}

export default function GoogleReviewsSection() {
  const fullStars = Math.floor(googleReviews.rating);
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const wasPausedRef = useRef(false);
  const pausedRef = useRef(false);
  const indexRef = useRef(0);
  const transitioningRef = useRef(false);

  pausedRef.current = paused;
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

  const handleProgressComplete = useCallback(() => {
    if (pausedRef.current || transitioningRef.current || googleReviewItems.length <= 1) return;
    advance((indexRef.current + 1) % googleReviewItems.length);
  }, [advance]);

  useEffect(() => {
    if (wasPausedRef.current && !paused) {
      setProgressKey((key) => key + 1);
    }
    wasPausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (paused || googleReviewItems.length <= 1) return;

    const timer = window.setTimeout(() => {
      handleProgressComplete();
    }, ROTATE_MS);

    return () => window.clearTimeout(timer);
  }, [handleProgressComplete, paused, progressKey]);

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

        <div className="mx-auto mt-8 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <div
            className="flex flex-1 items-center gap-4 rounded-2xl border border-navy/5 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-sm"
            aria-label={`Hodnocení ${formatRating(googleReviews.rating)} z 5`}
          >
            <span className="font-serif text-4xl font-bold leading-none text-navy">
              {formatRating(googleReviews.rating)}
            </span>
            <div className="h-10 w-px bg-navy/10" aria-hidden />
            <div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, starIndex) => {
                  const filled = starIndex + 1 <= fullStars;

                  return (
                    <Star
                      key={starIndex}
                      className={`h-5 w-5 ${filled ? 'fill-gold text-gold' : 'fill-navy/10 text-navy/15'}`}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  );
                })}
              </div>
              <p className="mt-1 text-xs font-medium text-navy/55">{googleReviews.reviewCount} recenzí</p>
            </div>
          </div>

          <a
            href={site.googleMapsPlaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-navy/10 bg-white/90 px-5 py-4 text-sm font-semibold text-navy shadow-sm backdrop-blur-sm transition hover:border-gold/40 hover:bg-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8f9fa] text-sm font-bold text-[#4285F4] ring-1 ring-navy/8">
              G
            </span>
            Zobrazit vše na Google
          </a>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
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
                    className={`review-progress-fill absolute inset-y-0 left-0 w-full rounded-full bg-gold ${paused ? '[animation-play-state:paused]' : ''}`}
                    style={{ ['--review-duration' as string]: `${ROTATE_MS}ms` }}
                  />
                )}
              </button>
            );
          })}
        </div>
        </div>

        <p className="mt-5 text-center text-xs text-navy/40">
          Zobrazeno několik nedávných hodnocení z Google Maps.
        </p>
      </div>
    </section>
  );
}
