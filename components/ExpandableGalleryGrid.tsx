'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { galleryAlt, type GalleryImage } from '@/lib/gallery-images';

type ExpandableGalleryGridProps = {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  initialRows?: number;
  priorityCount?: number;
  fadeBackgroundClass?: string;
};

const columnClass: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
};

export default function ExpandableGalleryGrid({
  images,
  columns = 4,
  initialRows = 1,
  priorityCount = 4,
  fadeBackgroundClass = 'from-ivory',
}: ExpandableGalleryGridProps) {
  const [expanded, setExpanded] = useState(false);

  const alignedCount = Math.floor(images.length / columns) * columns;
  const alignedImages = images.slice(0, alignedCount || images.length);
  const initialCount = initialRows * columns;
  const peekCount = columns;
  const collapsedVisible = Math.min(alignedImages.length, initialCount + peekCount);
  const canExpand = alignedImages.length > initialCount;

  if (alignedImages.length === 0) {
    return null;
  }

  return (
    <>
      <div className="relative">
        <div
          className={
            expanded || !canExpand
              ? undefined
              : 'max-h-[min(920px,85vh)] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]'
          }
        >
          <div className={`grid gap-3 sm:gap-4 ${columnClass[columns]}`}>
            {(expanded ? alignedImages : alignedImages.slice(0, collapsedVisible)).map((image, i) => (
              <div
                key={image.file}
                className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ivory ring-1 ring-slate-deep/5"
              >
                <Image
                  src={image.file}
                  alt={galleryAlt(image.alt)}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="rounded-3xl object-contain"
                  priority={i < priorityCount}
                />
              </div>
            ))}
          </div>
        </div>

        {!expanded && canExpand && (
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t ${fadeBackgroundClass} via-ivory/90 to-transparent`}
            aria-hidden
          />
        )}
      </div>

      {canExpand && (
        <div className="relative z-10 mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-forest/90"
          >
            {expanded ? 'Zobrazit méně' : `Ukázat vše (${alignedImages.length} fotek)`}
            <ArrowRight className={`h-4 w-4 transition-transform ${expanded ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        </div>
      )}
    </>
  );
}
