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
      { name: 'Radegast Ryze Hořká 12', description: '0,5 l', price: '43 Kč' },
      { name: 'Radegast Ryze Hořká 12', description: '0,3 l', price: '33 Kč' },
      { name: 'Radegast Ryze Hořká 10', description: '0,5 l', price: '40 Kč' },
      { name: 'Radegast Ryze Hořká 10', description: '0,3 l', price: '30 Kč' },
      { name: 'Radegast 10', description: 'plechovka', price: '30 Kč' },
      { name: 'Radegast 12', description: 'plechovka', price: '35 Kč' },
      { name: 'Birell Světlý Neochucený', description: 'láhev', price: '30 Kč' },
      { name: 'Birell Pomelo Grep', description: 'láhev', price: '30 Kč' },
      { name: 'Kozina', description: '0,5 l', price: '36 Kč' },
      { name: 'Kozina', description: '0,3 l', price: '26 Kč' },
    ],
  },
  {
    name: 'Víno',
    items: [
      { name: 'Bílé víno', description: '0,2 l', price: '80 Kč' },
      { name: 'Prosecco', description: '0,7 l', price: '280 Kč' },
      { name: 'Víno', description: '0,7 l', price: '300 Kč' },
    ],
  },
  {
    name: 'Alkohol',
    items: [
      { name: 'Fernet', description: '0,04 l', price: '30 Kč' },
      { name: 'Finlandia', description: '0,04 l', price: '40 Kč' },
      { name: 'Morgan', description: '0,04 l', price: '40 Kč' },
      { name: 'Zelená', description: '0,04 l', price: '30 Kč' },
      { name: 'Zelená', description: '0,02 l', price: '15 Kč' },
      { name: 'Gin', description: '0,04 l', price: '45 Kč' },
      { name: 'Borovička', description: '0,04 l', price: '25 Kč' },
      { name: 'Becherovka', description: '0,04 l', price: '35 Kč' },
      { name: 'Rum obyčejný', description: '0,04 l', price: '30 Kč' },
      { name: 'Rum obyčejný', description: '0,02 l', price: '15 Kč' },
      { name: 'Vodka obyčejná', description: '0,04 l', price: '30 Kč' },
      { name: 'Jack Daniel’s', description: '0,04 l', price: '55 Kč' },
      { name: 'Griotte', description: '0,04 l', price: '30 Kč' },
      { name: 'Tullamore Dew', description: '0,04 l', price: '55 Kč' },
      { name: 'Jägermeister', description: '0,04 l', price: '45 Kč' },
      { name: 'Jelzin', description: '0,04 l', price: '30 Kč' },
      { name: 'Koniferum', description: '0,04 l', price: '35 Kč' },
      { name: 'Rum Republica', description: '0,04 l', price: '40 Kč' },
      { name: 'Don Papa Rum', description: '0,04 l', price: '130 Kč' },
      { name: 'Diplomatico Rum', description: '0,04 l', price: '100 Kč' },
      { name: 'Bumbu Rum', description: '0,04 l', price: '130 Kč' },
      { name: 'Rum Abuelo', description: '0,04 l', price: '70 Kč' },
      { name: 'Hendrick’s Gin', description: '0,04 l', price: '130 Kč' },
      { name: 'The Macallan Whisky', description: '0,04 l', price: '180 Kč' },
      { name: 'Dubliner Irská whisky', description: '0,04 l', price: '70 Kč' },
      { name: 'A.H. Riise Cream Rum likér', description: '0,04 l', price: '100 Kč' },
      { name: 'San Cosme Mezcal', description: '0,04 l', price: 'dle nabídky' },
      { name: 'Dos Maderas Rum', description: '0,04 l', price: '100 Kč' },
    ],
  },
  {
    name: 'Nealkoholické nápoje',
    items: [
      { name: 'Točená Citro limo', description: '0,5 l', price: '30 Kč' },
      { name: 'Točená Citro limo', description: '0,33 l', price: '20 Kč' },
      { name: 'Domácí limo', description: '0,4 l', price: '49 Kč' },
      { name: 'Domácí limo', description: '1 l', price: '89 Kč' },
      { name: 'Coca-Cola', description: 'plechovka', price: '40 Kč' },
      { name: 'Mattoni', description: 've skle', price: '27 Kč' },
      { name: 'Ice Tea', description: 'plechovka', price: '30 Kč' },
      { name: 'Relax džus', description: 've skle', price: '30 Kč' },
      { name: 'Tonic', description: 've skle', price: '30 Kč' },
      { name: 'Mirinda', description: 've skle', price: '30 Kč' },
      { name: 'Džbán s vodou', price: '35 Kč' },
      { name: 'Red Bull', description: 'plechovka', price: '60 Kč' },
    ],
  },
  {
    name: 'Káva a čaj',
    items: [
      { name: 'Presso', price: '35 Kč' },
      { name: 'Turek', price: '25 Kč' },
      { name: 'Vídeňská káva', price: '45 Kč' },
      { name: 'Cappuccino', price: '40 Kč' },
      { name: 'Caffè latte', price: '59 Kč' },
      { name: 'Čaj', price: '40 Kč' },
    ],
  },
  {
    name: 'Pochutiny',
    items: [
      { name: 'Arašídy', price: '37 Kč' },
      { name: 'Pistácie', price: '68 Kč' },
      { name: 'Arašídové křupky', price: '35 Kč' },
      { name: 'Cibulové kroužky', price: '35 Kč' },
      { name: 'Solené brambůrky', price: '35 Kč' },
      { name: 'Česnekové brambůrky', price: '35 Kč' },
    ],
  },
];

export const summerDrinksMenu: MenuCategory[] = [
  {
    name: 'Drinky',
    items: [
      { name: 'Mojito', price: '119 Kč' },
      { name: 'Hugo Spritz', price: '109 Kč' },
      { name: 'Pear Gin Fizz', price: '119 Kč' },
      { name: 'Cuba Libre', price: '109 Kč' },
      { name: 'Aperol Spritz', price: '109 Kč' },
      { name: 'Gin & Tonic', price: '109 Kč' },
    ],
  },
  {
    name: 'Káva',
    items: [
      { name: 'Káva na ledu', price: '89 Kč' },
      { name: 'Presso + Tonic', price: '89 Kč' },
      {
        name: 'Extra sirupy Monin',
        description: 'Vanilka, pistácie, skořice, bílá čokoláda, čokoláda, perníček, karamel',
        price: '+10 Kč',
      },
    ],
  },
  {
    name: 'Matcha na ledu',
    items: [
      { name: 'Matcha', price: '109 Kč' },
      { name: 'Mango Matcha', price: '119 Kč' },
      { name: 'Malinová Matcha', price: '119 Kč' },
      { name: 'Matcha Tonic', price: '119 Kč' },
      {
        name: 'Výběr mléka',
        description: 'Kravské (standard), kokosové, mandlové, ovesné',
        price: '+15 Kč',
      },
    ],
  },
];
