'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import GalleryCarousel from '@/components/GalleryCarousel';
import {
  galleryCategories,
  galleryCatering,
  galleryPizza,
  type GalleryCategory,
} from '@/lib/gallery-images';

type GalerieSectionProps = {
  compact?: boolean;
  hideHeader?: boolean;
};

function CategoryTabs({
  active,
  onChange,
  pizzaCount,
  cateringCount,
}: {
  active: GalleryCategory;
  onChange: (category: GalleryCategory) => void;
  pizzaCount: number;
  cateringCount: number;
}) {
  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2">
      {galleryCategories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
            active === cat.id
              ? 'bg-forest text-white shadow-sm'
              : 'bg-white text-slate-deep/70 ring-1 ring-slate-deep/10 hover:bg-ivory'
          }`}
        >
          {cat.label}
          <span className="ml-2 text-xs font-normal opacity-70">
            ({cat.id === 'pizza' ? pizzaCount : cateringCount})
          </span>
        </button>
      ))}
    </div>
  );
}

export default function GalerieSection({ compact = false, hideHeader = false }: GalerieSectionProps) {
  const [active, setActive] = useState<GalleryCategory>('catering');
  const pizzaPhotos = galleryPizza;
  const cateringPhotos = galleryCatering;

  if (compact) {
    return (
      <section id="galerie" className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Prohlédněte si nás</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-navy sm:text-4xl">Galerie</h2>
            <p className="mx-auto mt-3 max-w-lg text-navy/60">Pizza z pece, catering a akce u nás v Žeravicích.</p>
          </div>

          <GalleryCarousel />

          <div className="mt-8 text-center">
            <Link
              href="/galerie"
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:gap-3 hover:text-gold"
            >
              Celá galerie
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const activeCategory = galleryCategories.find((c) => c.id === active)!;
  const activeImages = active === 'pizza' ? pizzaPhotos : cateringPhotos;

  return (
    <section id="galerie" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {!hideHeader && (
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">Prohlédněte si nás</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-slate-deep sm:text-4xl">Galerie</h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-deep/60">
              Restaurace, zahrádka a akce, které u nás pořádáme.
            </p>
          </div>
        )}

        <CategoryTabs
          active={active}
          onChange={setActive}
          pizzaCount={pizzaPhotos.length}
          cateringCount={cateringPhotos.length}
        />

        <div className="mb-6 text-center">
          <h3 className="font-serif text-2xl font-bold text-slate-deep">{activeCategory.label}</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-deep/60">{activeCategory.description}</p>
        </div>

        <GalleryCarousel key={active} images={activeImages} autoplay={false} />

        {active === 'pizza' && (
          <p className="mt-8 text-center text-sm text-slate-deep/50">
            Kompletní nabídka pizz včetně popisů najdete na{' '}
            <Link href="/pizza" className="font-semibold text-forest hover:underline">
              stránce Pizza
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
