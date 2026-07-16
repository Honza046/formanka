import manifest from '../public/galerie/instagram/manifest.json';

export type GalleryCategory = 'pizza' | 'catering';

export type GalleryImage = {
  file: string;
  shortcode: string;
  width: number;
  height: number;
  alt: string;
  category: GalleryCategory;
};

/** Instagram příspěvky s pizzou – ostatní jde do cateringu / akcí. */
const PIZZA_SHORTCODES = new Set(['DE8S_mCKH7A', 'DSIuqtJjv5P']);

const PIZZA_KEYWORDS = [
  'pizza',
  'pizzu',
  'pizzy',
  'pec na pizzu',
  'neapolsk',
  'sacarforni',
  'rozvoz pizz',
];

function detectCategory(entry: (typeof manifest)[number]): GalleryCategory {
  if (PIZZA_SHORTCODES.has(entry.shortcode)) {
    return 'pizza';
  }
  const text = entry.alt.toLowerCase();
  if (PIZZA_KEYWORDS.some((kw) => text.includes(kw))) {
    return 'pizza';
  }
  return 'catering';
}

export const galleryImages: GalleryImage[] = manifest.map((entry) => ({
  ...entry,
  category: detectCategory(entry),
}));

export const galleryPizza = galleryImages.filter((img) => img.category === 'pizza');
export const galleryCatering = galleryImages.filter((img) => img.category === 'catering');

export function uniqueByShortcode(images: GalleryImage[]): GalleryImage[] {
  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.shortcode)) return false;
    seen.add(img.shortcode);
    return true;
  });
}

/** Střídání pizza / catering fotek pro homepage karusel. */
export function mixedCarouselImages(): GalleryImage[] {
  const pizza = uniqueByShortcode(galleryPizza);
  const catering = uniqueByShortcode(galleryCatering);
  const mixed: GalleryImage[] = [];
  const max = Math.max(pizza.length, catering.length);

  for (let i = 0; i < max; i++) {
    if (i < pizza.length) mixed.push(pizza[i]);
    if (i < catering.length) mixed.push(catering[i]);
  }

  return mixed;
}

export function cateringSpotlightImages(): GalleryImage[] {
  return uniqueByShortcode(galleryCatering).slice(0, 3);
}

export function galleryAlt(alt: string): string {
  return alt.split('\n')[0].trim() || 'Na Formance Žeravice';
}

export const galleryCategories: { id: GalleryCategory; label: string; description: string }[] = [
  {
    id: 'pizza',
    label: 'Pizza',
    description: 'Neapolská pizza z italské pece, čerstvé suroviny a pečení na dřevo.',
  },
  {
    id: 'catering',
    label: 'Catering & akce',
    description: 'Svatební hostiny, rauty, oslavy a akce, které u nás pořádáme.',
  },
];
