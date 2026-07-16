'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { galleryAlt, mixedCarouselImages, type GalleryImage } from '@/lib/gallery-images';

const categoryLabel: Record<GalleryImage['category'], string> = {
  pizza: 'Pizza',
  catering: 'Catering & akce',
};

function CarouselSlide({ image, priority }: { image: GalleryImage; priority?: boolean }) {
  return (
    <article className="relative w-[26vw] max-w-[220px] shrink-0 sm:w-[24vw] md:w-[22vw] lg:w-[220px]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ivory ring-1 ring-navy/5 sm:rounded-3xl">
        <Image
          src={image.file}
          alt={galleryAlt(image.alt)}
          fill
          sizes="(max-width: 640px) 28vw, 220px"
          className="object-cover"
          priority={priority}
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
  const images = useMemo(() => {
    const source = imagesProp ?? mixedCarouselImages();
    return source.slice(0, 10);
  }, [imagesProp]);
  const loopImages = useMemo(() => [...images, ...images], [images]);
  const duration = Math.max(images.length * 5.5, 32);

  if (images.length === 0) {
    return null;
  }

  if (!autoplay) {
    return (
      <div className="gallery-carousel-static w-full overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden">
          {images.map((image, i) => (
            <CarouselSlide key={image.file} image={image} priority={i < 4} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-carousel w-full overflow-hidden">
      <div
        className="gallery-marquee-track flex w-max gap-3 sm:gap-4"
        style={{ animationDuration: `${duration}s` }}
      >
        {loopImages.map((image, i) => (
          <CarouselSlide key={`${image.file}-${i}`} image={image} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
