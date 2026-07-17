'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
import { galleryAlt, mixedCarouselImages, type GalleryImage } from '@/lib/gallery-images';

const SPEED_PX_PER_SEC = 55;
const RESUME_MS = 1800;

const categoryLabel: Record<GalleryImage['category'], string> = {
  pizza: 'Pizza',
  catering: 'Catering & akce',
};

function CarouselSlide({ image, priority }: { image: GalleryImage; priority?: boolean }) {
  return (
    <article className="relative w-[72vw] max-w-[300px] shrink-0 sm:w-[42vw] md:w-[28vw] lg:w-[220px] lg:max-w-none">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ivory ring-1 ring-navy/5 sm:rounded-3xl">
        <Image
          src={image.file}
          alt={galleryAlt(image.alt)}
          fill
          sizes="(max-width: 640px) 72vw, (max-width: 1024px) 42vw, 220px"
          className="pointer-events-none select-none object-cover"
          priority={priority}
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 via-navy/25 to-transparent px-3 pb-3 pt-8 sm:px-4 sm:pb-4 sm:pt-10">
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-xs">
            {categoryLabel[image.category]}
          </span>
        </div>
      </div>
    </article>
  );
}

type GalleryCarouselProps = {
  images?: GalleryImage[];
  autoplay?: boolean;
};

export default function GalleryCarousel({ images: imagesProp, autoplay = true }: GalleryCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const resumeTimerRef = useRef(0);

  const images = useMemo(() => {
    const source = imagesProp ?? mixedCarouselImages();
    if (imagesProp) return source;
    return source.slice(0, 10);
  }, [imagesProp]);

  const loopImages = useMemo(() => {
    if (!autoplay || images.length === 0) return images;
    return [...images, ...images];
  }, [autoplay, images]);

  useEffect(() => {
    if (!autoplay || images.length <= 1) return;

    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = performance.now();

    const halfWidth = () => track.scrollWidth / 2;

    const normalize = () => {
      const half = halfWidth();
      if (half <= 0) return;
      while (offsetRef.current <= -half) offsetRef.current += half;
      while (offsetRef.current > 0) offsetRef.current -= half;
    };

    const apply = () => {
      normalize();
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.048);
      last = now;

      if (!pausedRef.current && !draggingRef.current) {
        offsetRef.current -= SPEED_PX_PER_SEC * dt;
        apply();
      }

      raf = window.requestAnimationFrame(tick);
    };

    const clearResume = () => {
      window.clearTimeout(resumeTimerRef.current);
    };

    const scheduleResume = () => {
      clearResume();
      resumeTimerRef.current = window.setTimeout(() => {
        pausedRef.current = false;
        last = performance.now();
      }, RESUME_MS);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      draggingRef.current = true;
      pausedRef.current = true;
      clearResume();
      dragStartXRef.current = event.clientX;
      dragStartOffsetRef.current = offsetRef.current;
      track.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      const delta = event.clientX - dragStartXRef.current;
      offsetRef.current = dragStartOffsetRef.current + delta;
      apply();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      try {
        track.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
      scheduleResume();
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);

    apply();
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      clearResume();
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', onPointerUp);
      track.removeEventListener('pointercancel', onPointerUp);
    };
  }, [autoplay, images.length]);

  if (images.length === 0) {
    return null;
  }

  if (!autoplay) {
    return (
      <div className="gallery-carousel-static w-full overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x sm:gap-4 [&::-webkit-scrollbar]:hidden">
          {images.map((image, i) => (
            <CarouselSlide key={image.file} image={image} priority={i < 3} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={viewportRef} className="gallery-carousel w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex w-max cursor-grab gap-3 touch-pan-y select-none active:cursor-grabbing sm:gap-4"
        style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)' }}
      >
        {loopImages.map((image, i) => (
          <CarouselSlide key={`${image.file}-${i}`} image={image} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
