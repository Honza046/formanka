import Image from 'next/image';
import { pizzaGallerySlots, type PizzaGallerySlot } from '@/lib/pizza-gallery';

function PizzaCard({ pizza, priority }: { pizza: PizzaGallerySlot; priority?: boolean }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-deep/5 bg-navy shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-square">
        {pizza.photo ? (
          <Image
            src={pizza.photo}
            alt={pizza.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy-muted"
            aria-hidden
          />
        )}
      </div>

      <div className="p-4">
        <h4 className="font-serif text-lg font-bold leading-tight text-white">{pizza.name}</h4>
        <p className="mt-1.5 text-sm leading-relaxed text-white/70">{pizza.description}</p>
      </div>
    </article>
  );
}

type PizzaGalleryGridProps = {
  limit?: number;
  priorityCount?: number;
};

export default function PizzaGalleryGrid({ limit, priorityCount = 4 }: PizzaGalleryGridProps) {
  const slots = limit ? pizzaGallerySlots.slice(0, limit) : pizzaGallerySlots;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {slots.map((pizza, i) => (
        <PizzaCard key={pizza.slug} pizza={pizza} priority={i < priorityCount} />
      ))}
    </div>
  );
}
