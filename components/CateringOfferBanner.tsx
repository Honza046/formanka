'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cateringInfo, offerIntro, services } from '@/lib/data';
import { cateringSpotlightImages, galleryAlt } from '@/lib/gallery-images';

export default function CateringOfferBanner() {
  const images = cateringSpotlightImages();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-slate-deep sm:min-h-[360px] sm:rounded-3xl">
      {images.length > 0 && (
        <div className="absolute inset-0 lg:left-[38%]">
          {images.map((image, imageIndex) => (
            <Image
              key={image.file}
              src={image.file}
              alt={galleryAlt(image.alt)}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={`object-cover transition-opacity duration-1000 ease-in-out ${
                imageIndex === index ? 'opacity-100' : 'opacity-0'
              }`}
              priority={imageIndex === 0}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-deep via-slate-deep/80 to-slate-deep/55 sm:bg-gradient-to-r sm:from-slate-deep sm:via-slate-deep/88 sm:to-slate-deep/15" />
        </div>
      )}

      <div className="relative z-10 p-5 text-ivory sm:p-8 lg:max-w-[54%] lg:p-10">
        <h2 className="font-serif text-xl font-bold sm:text-2xl">{offerIntro.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ivory/80 sm:mt-4 sm:text-base">
          {cateringInfo.rauts}
        </p>
        <ul className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-2">
          {services.slice(2).map((service) => (
            <li key={service} className="flex items-center gap-2 text-sm text-ivory/90">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-muted" />
              {service}
            </li>
          ))}
        </ul>
        <Link
          href="#poptavka"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-navy transition hover:bg-gold-light sm:mt-6 sm:w-auto"
        >
          Poptat catering
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
