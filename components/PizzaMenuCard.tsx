import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/data';
import type { PizzaGallerySlot } from '@/lib/pizza-gallery';

type PizzaMenuCardProps = {
  pizza: PizzaGallerySlot;
  priority?: boolean;
};

export default function PizzaMenuCard({ pizza, priority }: PizzaMenuCardProps) {
  return (
    <li>
      <Link
        href="/pizza/objednat"
        className="group relative flex min-h-[168px] overflow-hidden rounded-3xl bg-navy shadow-sm transition-shadow hover:shadow-md"
      >
        {pizza.photo ? (
          <>
            <Image
              src={pizza.photo}
              alt={pizza.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              priority={priority}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/75 to-navy/45" />
          </>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy-muted"
            aria-hidden
          />
        )}

        <div className="relative flex h-full w-full flex-col justify-end p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-xl font-bold text-white">{pizza.name}</h2>
            <span className="shrink-0 font-semibold text-gold-light">{formatPrice(pizza.price)}</span>
          </div>
          {pizza.description && (
            <p className="mt-2 text-sm leading-relaxed text-white/80">{pizza.description}</p>
          )}
        </div>
      </Link>
    </li>
  );
}
