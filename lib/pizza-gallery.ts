import photos from '../public/galerie/pizza/photos.json';
import { formatPrice, pizzaMenu, type PizzaMenuItem } from '@/lib/data';

export type PizzaGallerySlot = PizzaMenuItem & {
  slug: string;
  photo: string | null;
};

export function pizzaSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Cesta pro novou fotku – uložte soubor do public/galerie/pizza/ a přidejte záznam do photos.json */
export function pizzaPhotoPath(name: string): string {
  return `/galerie/pizza/${pizzaSlug(name)}.jpg`;
}

const photoBySlug = photos as Record<string, string>;

export function getPizzaPhoto(name: string): string | null {
  return photoBySlug[pizzaSlug(name)] ?? null;
}

export const pizzaGallerySlots: PizzaGallerySlot[] = pizzaMenu.map((item) => {
  const slug = pizzaSlug(item.name);
  return {
    ...item,
    slug,
    photo: photoBySlug[slug] ?? null,
  };
});

export const pizzaGalleryWithPhoto = pizzaGallerySlots.filter((slot) => slot.photo);
export const pizzaGalleryMissingPhoto = pizzaGallerySlots.filter((slot) => !slot.photo);

export { formatPrice };
