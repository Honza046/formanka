'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { galleryAlt, mixedCarouselImages, type GalleryImage } from '@/lib/gallery-images';

const categoryLabel: Record<GalleryImage['category'], string> = {
  pizza: 'Pizza',
  catering: 'Catering & akce',
};

function CarouselSlide({ image, priority }: { image: GalleryImage; priority?: boolean }) {
  return (
    <article className="relative w-[72vw] shrink-0 sm:w-[280px] lg:w-[300px]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ivory ring-1 ring-navy/5">
        <Image
          src={image.file}
          alt={galleryAlt(image.alt)}
          fill
          sizes="(max-width: 640px) 72vw, 300px"
          className="object-cover"
          priority={priority}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 via-navy/25 to-transparent px-4 pb-4 pt-10">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            {categoryLabel[image.category]}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function GalleryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(true);
  const images = mixedCarouselImages();

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollBack(scrollLeft > 8);
    setCanScrollForward(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState, images.length]);

  const scrollBySlide = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const slide = track.querySelector<HTMLElement>('article');
    const gap = 16;
    const step = (slide?.offsetWidth ?? 300) + gap;
    track.scrollBy({ left: direction * step, behavior: 'auto' });
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, i) => (
          <CarouselSlide key={image.file} image={image} priority={i < 3} />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollBySlide(-1)}
            disabled={!canScrollBack}
            aria-label="Předchozí fotka"
            className="absolute left-0 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2.5 text-navy shadow-md ring-1 ring-navy/10 transition hover:bg-cream disabled:pointer-events-none disabled:opacity-0 sm:inline-flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBySlide(1)}
            disabled={!canScrollForward}
            aria-label="Další fotka"
            className="absolute right-0 top-1/2 z-10 hidden translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2.5 text-navy shadow-md ring-1 ring-navy/10 transition hover:bg-cream disabled:pointer-events-none disabled:opacity-0 sm:inline-flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
