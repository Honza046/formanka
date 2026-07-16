export const site = {
  name: 'Na Formance',
  tagline: 'Žeravice',
  fullName: 'Na Formance Žeravice',
  description: 'Domácí pizza, catering a příjemné prostředí. Rodinná restaurace v Žeravicích u Kyjova.',
  welcome:
    'Jsme rodinná restaurace, která se nachází v Žeravicích u Kyjova. Máme k dispozici prostory pro pořádání jakékoliv akce. Nabízíme kompletní servis včetně cateringových služeb.',
  taglineHero: 'Domácí pizza, catering a příjemné prostředí',
  ctaQuote: 'U nás si přijdou na své všichni milovníci dobrého jídla!',
  url: 'https://formankazeravice.cz',
  email: 'formankazeravice@seznam.cz',
  phones: ['+420 774 173 331', '+420 720 172 056'],
  facebook: 'https://www.facebook.com/formankazeravice',
  instagram: 'https://www.instagram.com/formanka_zeravice/',
  address: {
    street: 'Žeravice 36',
    zip: '696 47',
    city: 'Žeravice',
    region: 'okres Hodonín',
    note: 'Žeravice u Kyjova',
    country: 'Česká republika',
  },
  coordinates: {
    lat: 49.03795,
    lng: 17.10686,
  },
  mapsUrl: 'https://maps.google.com/?q=Na+Formance+Žeravice+36,+696+47+Žeravice',
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=Na+Formance+Žeravice+36,+696+47+Žeravice&hl=cs&z=16&output=embed',
  /** Odkaz na profil v Mapách — recenze i „Napsat recenzi“ */
  googleMapsPlaceUrl:
    'https://www.google.com/maps/search/?api=1&query=Na+Formance+Žeravice+36,+696+47+Žeravice',
} as const;

/** Google recenze — upravte rating podle aktuálního stavu v Mapách. */
export const googleReviews = {
  rating: 4.0,
  reviewCount: 81,
} as const;

export type GoogleReviewItem = {
  author: string;
  rating: number;
  text: string;
  relativeDate: string;
};

/** Vybrané recenze z Google Maps (iniciály a texty dle veřejných hodnocení). */
export const googleReviewItems: GoogleReviewItem[] = [
  {
    author: 'E. S.',
    rating: 5,
    text: 'Musím vyzdvihnout skvělý um vaření paní Menšíkové a její ochotu a vstřícnost. Mám bezlepkovou dietu a díky ní si užívám dovolenou i skrze jídlo. Tuto restauraci vřele doporučuji!',
    relativeDate: 'před 5 měsíci',
  },
  {
    author: 'P. C.',
    rating: 5,
    text: 'Vynikající jídlo. Dobrá a rychlá obsluha. Skvělé ceny.',
    relativeDate: 'před 3 měsíci',
  },
  {
    author: 'O. K.',
    rating: 5,
    text: 'Příjemná hospůdka, dobré jídlo, ale hlavně super personál!',
    relativeDate: 'před 2 měsíci',
  },
  {
    author: 'P. K.',
    rating: 5,
    text: 'Příjemná hospůdka a klidné posezení na zahrádce. Cestou na kole se tu rád zastavím a vezmu si kolo na zahrádku.',
    relativeDate: 'před 7 měsíci',
  },
  {
    author: 'J. S.',
    rating: 5,
    text: 'Příjemné posezení, výborné jídlo, příjemná paní servírka.',
    relativeDate: 'před 8 měsíci',
  },
  {
    author: 'P. T.',
    rating: 4,
    text: 'Velice příjemné posezení a dobré jídlo. Určitě se vrátíme.',
    relativeDate: 'před 10 měsíci',
  },
];

/** Horní info lišta — nechte null pro skrytí, nastavte objekt pro zobrazení na celém webu. */
export type SiteAnnouncement = {
  message: string;
  href?: string;
  linkLabel?: string;
  variant?: 'info' | 'warning' | 'important';
};

export const siteAnnouncement: SiteAnnouncement | null = null;

// Příklad aktivace:
// export const siteAnnouncement = {
//   message: 'Dnes nepečeme pizzu. Restaurace je otevřena dle běžné otevírací doby.',
//   variant: 'warning',
//   href: '/pizza',
//   linkLabel: 'Více informací',
// } satisfies SiteAnnouncement;

export const homeHero = {
  image: '/hero.jpg',
  imageAlt: 'Restaurace Na Formance v Žeravicích, pohled na budovu zvenku',
} as const;

export const navLinks = [
  { label: 'Domů', href: '/' },
  { label: 'Pizza', href: '/pizza' },
  { label: 'Menu', href: '/menu' },
  { label: 'Catering', href: '/catering' },
  { label: 'Galerie', href: '/galerie' },
  { label: 'Kontakt', href: '/kontakt' },
] as const;

export const openingHours = [
  { day: 'Pondělí', hours: 'Zavřeno' },
  { day: 'Úterý', hours: 'Zavřeno' },
  { day: 'Středa', hours: '17:00 – 24:00' },
  { day: 'Čtvrtek', hours: '17:00 – 24:00' },
  { day: 'Pátek', hours: '17:00 – 24:00' },
  { day: 'Sobota', hours: '17:00 – 24:00' },
  { day: 'Neděle', hours: '17:00 – 22:00' },
] as const;

export const services = [
  'Restaurace s kapacitou 100 osob',
  'Letní zahrádka s kapacitou více jak 40 osob',
  'Oslavy narozenin',
  'Svatby',
  'Smuteční hostiny',
  'Firemní večírky',
  'Rauty a catering',
] as const;

export const offerIntro = {
  title: 'Naše nabídka',
  pizza: 'Specializujeme se na výrobu domácí pizzy.',
  catering:
    'Rauty na přání, obložené mísy, mini-burgříky, řízečky, saláty a mnoho dalšího dle domluvy a přání.',
} as const;

export const pizzaInfo = {
  title: 'Pizza',
  note: 'O víkendu pro Vás děláme domácí pizzu.',
  schedule: 'Pátek až neděle',
  orderLabel: 'Objednávky na čísle:',
  image: '/galerie/instagram/030_DSIuqtJjv5P.jpg',
  imageAlt: 'Neapolská pizza z italské pece, Na Formance Žeravice',
} as const;

export const pageHeroImages = {
  pizza: {
    image: pizzaInfo.image,
    imageAlt: pizzaInfo.imageAlt,
  },
  menu: {
    image: '/menu-drinks.jpg',
    imageAlt: 'Točené pivo a nápoje v restauraci Na Formance Žeravice',
  },
  catering: {
    image: '/galerie/instagram/034_DQh4smpCHne.jpg',
    imageAlt: 'Catering a raut v Na Formance Žeravice',
  },
  galerie: {
    image: '/galerie/instagram/019_DUwFcvzDr3z.jpg',
    imageAlt: 'Restaurace Na Formance Žeravice',
  },
  kontakt: {
    image: homeHero.image,
    imageAlt: homeHero.imageAlt,
  },
} as const;

export const homePizzaFeatured = ['Margherita', 'Šunková', 'Rukolová'] as const;

export const pizzaOrderSteps = [
  {
    title: 'Vyberte pizzu',
    description: 'Prohlédněte si nabídku a vyberte si oblíbenou kombinaci.',
  },
  {
    title: 'Objednejte',
    description: 'Online přes web nebo telefonicky, pátek až neděle.',
  },
  {
    title: 'Vyzvedněte u nás',
    description: 'Pizzu pro Vás připravíme čerstvou z italské pece.',
  },
] as const;

export type PizzaMenuItem = {
  name: string;
  description: string;
  price: number;
};

export type PizzaExtra = {
  name: string;
  price: number;
};

export const pizzaMenu: PizzaMenuItem[] = [
  {
    name: 'Pizza Pane',
    description: 'Pizza spirály s bazalkovým pestem a parmazánem',
    price: 89,
  },
  {
    name: 'Margherita',
    description: 'Rajčatové sugo, mozzarella, čerstvá bazalka',
    price: 159,
  },
  {
    name: 'Šunková',
    description: 'Rajčatové sugo, mozzarella, šunka',
    price: 169,
  },
  {
    name: 'Salámová',
    description: 'Rajčatové sugo, mozzarella, salám',
    price: 169,
  },
  {
    name: 'Mexicana',
    description: 'Rajčatové sugo, mozzarella, chorizo, feferonky, červená cibule, kukuřice',
    price: 179,
  },
  {
    name: 'Rukolová',
    description: 'Rajčatové sugo, mozzarella, rukola, prosciutto, rajčata',
    price: 179,
  },
  {
    name: 'Hawaii',
    description: 'Smetanový základ, mozzarella, šunka, ananas',
    price: 169,
  },
  {
    name: 'Paradiso',
    description: 'Smetanový základ, mozzarella, slanina, hermelín, kukuřice',
    price: 179,
  },
  {
    name: 'Funghi',
    description: 'Rajčatové sugo, mozzarella, šunka, žampiony',
    price: 169,
  },
  {
    name: 'Quattro formaggi',
    description: 'Rajčatové sugo, mozzarella, niva, parmazán, hermelín',
    price: 179,
  },
  {
    name: 'Americana',
    description: 'Smetanový základ, mozzarella, šunka, kukuřice, žampiony',
    price: 169,
  },
  {
    name: 'Tuňáková',
    description: 'Rajčatové sugo, mozzarella, kousky tuňáka, červená cibule',
    price: 179,
  },
];

export const pizzaExtras: PizzaExtra[] = [
  { name: 'Šunka', price: 15 },
  { name: 'Rajčata', price: 15 },
  { name: 'Žampiony', price: 15 },
  { name: 'Salám', price: 15 },
  { name: 'Feferonky', price: 15 },
  { name: 'Kukuřice', price: 15 },
  { name: 'Slanina', price: 15 },
  { name: 'Červená cibule', price: 15 },
  { name: 'Ananas', price: 15 },
  { name: 'Rukola', price: 15 },
  { name: 'Hermelín', price: 20 },
  { name: 'Tuňák', price: 20 },
  { name: 'Prosciutto', price: 20 },
  { name: 'Chorizo', price: 20 },
  { name: 'Niva', price: 20 },
  { name: 'Parmazán', price: 20 },
  { name: 'Mozzarella', price: 20 },
];

export const pizzaBoxPrice = 10;

export function formatPrice(amount: number): string {
  return `${amount},-`;
}

export function getPizzaPrice(name: string): number {
  return pizzaMenu.find((p) => p.name === name)?.price ?? 0;
}

export function getExtraPrice(name: string): number {
  return pizzaExtras.find((e) => e.name === name)?.price ?? 0;
}

export function lineItemTotal(
  pizzaName: string,
  quantity: number,
  extraNames: string[] = [],
): number {
  const base = getPizzaPrice(pizzaName);
  const extras = extraNames.reduce((sum, extra) => sum + getExtraPrice(extra), 0);
  return (base + extras) * quantity;
}

export const cateringInfo = {
  title: 'Catering & akce',
  intro:
    'Máme k dispozici prostory pro pořádání jakékoliv akce. Nabízíme kompletní servis včetně cateringových služeb.',
  rauts:
    'Rauty na přání, obložené mísy, mini-burgříky, řízečky, saláty a mnoho dalšího dle domluvy a přání.',
} as const;

export const cateringEvents = [
  {
    title: 'Oslava narozenin',
    description: 'Rodinné oslavy v příjemném prostředí s domácí kuchyní.',
  },
  {
    title: 'Svatba',
    description: 'Kompletní servis pro Váš svatební den včetně rautu a cateringu.',
  },
  {
    title: 'Smuteční hostina',
    description: 'Důstojné občerstvení v klidném prostředí.',
  },
  {
    title: 'Firemní večírek',
    description: 'Prostory pro firemní akce, večírky a setkání.',
  },
  {
    title: 'Raut a catering',
    description: 'Obložené mísy, mini-burgříky, řízečky, saláty a další dle domluvy.',
  },
] as const;

export const cateringEventTypes = [
  'Oslava narozenin',
  'Svatba',
  'Smuteční hostina',
  'Firemní večírek',
  'Raut a catering',
  'Jiné',
] as const;

export const cateringVenueOptions = [
  'Restaurace (do 100 osob)',
  'Letní zahrádka (40+ osob)',
  'Restaurace i zahrádka',
  'Máme vlastní',
] as const;

export const cateringMenuOptions = [
  'Obložené mísy',
  'Mini-burgříky',
  'Řízečky a hlavní chody',
  'Saláty',
  'Domácí pizza',
  'Nápojový servis',
  'Dezerty',
] as const;

export const guestCountRanges = [
  { value: 'do-30', label: 'Do 30 hostů' },
  { value: '30-60', label: '30 až 60 hostů' },
  { value: '60-100', label: '60 až 100 hostů' },
  { value: '100+', label: 'Více než 100' },
] as const;

export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export const permanentDrinksMenu: MenuCategory[] = [
  {
    name: 'Pivo',
    items: [
      { name: 'Pivo točené', description: '0,5 l', price: 'dle nabídky' },
      { name: 'Pivo točené', description: '0,3 l', price: 'dle nabídky' },
      { name: 'Nealkoholické pivo', description: '0,5 l', price: 'dle nabídky' },
    ],
  },
  {
    name: 'Víno',
    items: [
      { name: 'Bílé víno', description: '0,2 l', price: 'dle nabídky' },
      { name: 'Červené víno', description: '0,2 l', price: 'dle nabídky' },
    ],
  },
  {
    name: 'Nealko',
    items: [
      { name: 'Kofola', description: '0,3 l / 0,5 l', price: 'dle nabídky' },
      { name: 'Džus', description: '0,25 l', price: 'dle nabídky' },
      { name: 'Minerální voda', description: '0,33 l', price: 'dle nabídky' },
    ],
  },
  {
    name: 'Teplé nápoje',
    items: [
      { name: 'Espresso', price: 'dle nabídky' },
      { name: 'Cappuccino', price: 'dle nabídky' },
      { name: 'Čaj', price: 'dle nabídky' },
      { name: 'Grog', price: 'dle nabídky' },
    ],
  },
  {
    name: 'Destiláty',
    items: [
      { name: 'Fernet', description: '4 cl', price: 'dle nabídky' },
      { name: 'Becherovka', description: '4 cl', price: 'dle nabídky' },
      { name: 'Slivovice', description: '4 cl', price: 'dle nabídky' },
      { name: 'Hruškovice', description: '4 cl', price: 'dle nabídky' },
    ],
  },
];

export const summerDrinksMenu: MenuCategory[] = [
  {
    name: 'Letní limonády',
    items: [
      { name: 'Domácí limonáda', description: 'Máta & citrón, 0,4 l', price: 'dle nabídky' },
      { name: 'Domácí limonáda', description: 'Malina & bazalka, 0,4 l', price: 'dle nabídky' },
      { name: 'Domácí limonáda', description: 'Zázvor & pomeranč, 0,4 l', price: 'dle nabídky' },
    ],
  },
  {
    name: 'Osvěžující nápoje',
    items: [
      { name: 'Radler', description: '0,5 l', price: 'dle nabídky' },
      { name: 'Aperol Spritz', description: '0,3 l', price: 'dle nabídky' },
      { name: 'Hugo', description: '0,3 l', price: 'dle nabídky' },
    ],
  },
  {
    name: 'Nealko',
    items: [
      { name: 'Ledový čaj', description: '0,4 l', price: 'dle nabídky' },
      { name: 'Fresh džus', description: 'Pomeranč / jablko, 0,3 l', price: 'dle nabídky' },
    ],
  },
];
