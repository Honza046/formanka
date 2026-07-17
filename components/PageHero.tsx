import Image from 'next/image';
import type { ReactNode } from 'react';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  compact?: boolean;
  image?: string;
  imageAlt?: string;
  imagePosition?: 'center' | 'right';
  /** card = fotka uvnitř ohraničené lišty vedle textu, ne přes celou stránku */
  layout?: 'fullBleed' | 'card';
};

function HeroCopy({
  eyebrow,
  title,
  description,
  children,
  compact,
}: Pick<PageHeroProps, 'eyebrow' | 'title' | 'description' | 'children' | 'compact'>) {
  return (
    <>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">{eyebrow}</p>
      )}
      <h1
        className={`mt-2 font-serif font-bold text-slate-deep ${
          compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
        }`}
      >
        {title}
      </h1>
      {description && (
        <p
          className={`mt-4 max-w-2xl leading-relaxed text-slate-deep/70 ${
            compact ? 'text-base sm:text-lg' : 'text-lg'
          }`}
        >
          {description}
        </p>
      )}
      {children}
    </>
  );
}

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
  compact,
  image,
  imageAlt = '',
  imagePosition = 'right',
  layout = 'fullBleed',
}: PageHeroProps) {
  const hasImage = Boolean(image);

  if (layout === 'card' && hasImage) {
    return (
      <section className="border-b border-slate-deep/5 bg-ivory px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-navy/8 bg-white shadow-[0_8px_30px_rgb(40_48_64_/_0.06)]">
            <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div
                className={`flex flex-col justify-center ${
                  compact ? 'p-6 sm:p-7 lg:p-8' : 'p-6 sm:p-8 lg:p-10'
                }`}
              >
                <HeroCopy
                  eyebrow={eyebrow}
                  title={title}
                  description={description}
                  compact={compact}
                >
                  {children}
                </HeroCopy>
              </div>

              <div className="relative min-h-[220px] border-t border-navy/6 md:min-h-[280px] md:border-l md:border-t-0">
                <Image
                  src={image!}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover object-[center_42%]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative overflow-hidden border-b border-slate-deep/5 px-4 sm:px-6 lg:px-8 ${
        compact ? 'py-10 sm:py-12' : 'py-14 sm:py-16'
      } ${hasImage ? 'bg-ivory' : 'bg-white'}`}
    >
      {hasImage && (
        <>
          <Image
            src={image!}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className={`object-cover ${
              imagePosition === 'right' ? 'object-[center_35%] sm:object-[75%_40%]' : 'object-center'
            }`}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/92 to-ivory/45 sm:via-ivory/70 sm:to-ivory/15"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/55 to-transparent"
            aria-hidden
          />
        </>
      )}

      <div className="relative mx-auto max-w-4xl">
        <HeroCopy eyebrow={eyebrow} title={title} description={description} compact={compact}>
          {children}
        </HeroCopy>
      </div>
    </section>
  );
}
