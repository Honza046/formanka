import { randomUUID } from 'crypto';
import type {
  CreateOrderInput,
  DailyCapacity,
  OpeningStatusSettings,
  OrderPageSettings,
  OrderStatus,
  PizzaOrder,
  PizzaStore,
  SiteAnnouncementSettings,
  WebsiteContentSettings,
} from './types';
import { activeStatuses, pizzaCount } from './types';
import { isOrderPageTimeOpen, isOrdersOpen } from './pickup-slots';
import { loadStore, saveStoreData } from './persistence';

const DEFAULT_MAX_PIZZAS = 40;

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultCapacity(): DailyCapacity {
  return {
    date: todayDate(),
    maxPizzas: DEFAULT_MAX_PIZZAS,
    acceptingOrders: true,
  };
}

function defaultOrderPage(): OrderPageSettings {
  return {
    mode: 'auto',
    manualEnabled: false,
    title: 'Objednat pizzu',
    description: 'O víkendu pro Vás děláme domácí pizzu. Vyberte pizzy, zadejte čas vyzvednutí a my vám objednávku potvrdíme.',
    closedTitle: 'Objednávky jsou zavřené',
    closedDescription: 'Online objednávky otevíráme od 17:00, nebo je může obsluha zapnout dříve v kuchyňské aplikaci.',
    pausedTitle: 'Objednávky jsou pro dnešek uzavřeny',
    pausedDescription: 'Kapacita kuchyně je naplněna nebo jsme příjem objednávek dočasně zastavili. Zkuste to prosím později.',
  };
}

function defaultOpeningStatus(): OpeningStatusSettings {
  return {
    openLabel: 'Nyní máme otevřeno',
    closedLabel: 'Nyní máme zavřeno',
    opensTodayLabel: 'Otevíráme v',
    opensAnotherDayLabel: 'Otevíráme',
    untilLabel: 'do',
  };
}

function defaultSiteAnnouncement(): SiteAnnouncementSettings {
  return {
    enabled: false,
    message: '',
    href: '',
    linkLabel: '',
    variant: 'warning',
  };
}

function defaultWebsiteContent(): WebsiteContentSettings {
  return {
    home: {
      heroEyebrow: 'Rodinná restaurace · Žeravice u Kyjova',
      heroTitle: 'Na Formance',
      heroDescription: 'Domácí pizza, catering a příjemné prostředí',
      heroPrimaryCta: 'Objednat pizzu',
      heroSecondaryCta: 'Zobrazit menu',
      introEyebrow: 'Co u nás najdete',
      introTitle: 'Restaurace, pizza a akce',
      introDescription:
        'Jsme rodinná restaurace, která se nachází v Žeravicích u Kyjova. Máme k dispozici prostory pro pořádání jakékoliv akce. Nabízíme kompletní servis včetně cateringových služeb.',
    },
    pizza: {
      heroEyebrow: 'Víkendová nabídka',
      heroTitle: 'Pizza',
      heroDescription: 'O víkendu pro Vás děláme domácí pizzu.',
      orderCta: 'Objednat online',
      contactCta: 'Máte dotaz? Kontaktujte nás',
    },
    catering: {
      heroEyebrow: 'Akce & oslavy',
      heroTitle: 'Catering & akce',
      heroDescription:
        'Máme k dispozici prostory pro pořádání jakékoliv akce. Nabízíme kompletní servis včetně cateringových služeb.',
      inquiryEyebrow: 'Nezávazně',
      inquiryTitle: 'Poptat catering',
      inquiryDescription: 'Vyplňte formulář, ozveme se s nabídkou na míru.',
    },
    kontakt: {
      heroEyebrow: 'Jsme tu pro vás',
      heroTitle: 'Kontaktujte nás',
      heroDescription: 'Máte dotaz, chcete uspořádat akci nebo objednat pizzu? Napište nám nebo zavolejte.',
      formEyebrow: 'Napište nám',
    },
  };
}

function defaultStore(): PizzaStore {
  return {
    orders: [],
    capacity: defaultCapacity(),
    orderPage: defaultOrderPage(),
    openingStatus: defaultOpeningStatus(),
    siteAnnouncement: defaultSiteAnnouncement(),
    websiteContent: defaultWebsiteContent(),
  };
}

async function ensureStore(): Promise<PizzaStore> {
  const existing = await loadStore();

  if (!existing) {
    const store = defaultStore();
    await saveStoreData(store);
    return store;
  }

  if (existing.capacity.date !== todayDate()) {
    existing.capacity = defaultCapacity();
    existing.orders = existing.orders.filter((order) => !order.pickupTime.startsWith(todayDate()));
    await saveStoreData(existing);
  }

  const nextOrderPage = { ...defaultOrderPage(), ...existing.orderPage };
  const nextOpeningStatus = { ...defaultOpeningStatus(), ...existing.openingStatus };
  const nextSiteAnnouncement = { ...defaultSiteAnnouncement(), ...existing.siteAnnouncement };
  const nextWebsiteContent = {
    ...defaultWebsiteContent(),
    ...existing.websiteContent,
    home: { ...defaultWebsiteContent().home, ...existing.websiteContent?.home },
    pizza: { ...defaultWebsiteContent().pizza, ...existing.websiteContent?.pizza },
    catering: { ...defaultWebsiteContent().catering, ...existing.websiteContent?.catering },
    kontakt: { ...defaultWebsiteContent().kontakt, ...existing.websiteContent?.kontakt },
  };

  const needsSave =
    JSON.stringify(nextOrderPage) !== JSON.stringify(existing.orderPage) ||
    JSON.stringify(nextOpeningStatus) !== JSON.stringify(existing.openingStatus) ||
    JSON.stringify(nextSiteAnnouncement) !== JSON.stringify(existing.siteAnnouncement) ||
    JSON.stringify(nextWebsiteContent) !== JSON.stringify(existing.websiteContent);

  if (needsSave) {
    existing.orderPage = nextOrderPage;
    existing.openingStatus = nextOpeningStatus;
    existing.siteAnnouncement = nextSiteAnnouncement;
    existing.websiteContent = nextWebsiteContent;
    await saveStoreData(existing);
  }

  return existing;
}

export function reservedPizzas(orders: PizzaOrder[], date = todayDate()): number {
  return orders
    .filter(
      (order) =>
        order.pickupTime.startsWith(date) && activeStatuses().includes(order.status),
    )
    .reduce((sum, order) => sum + pizzaCount(order.items), 0);
}

export function remainingPizzas(store: PizzaStore): number {
  const used = reservedPizzas(store.orders, store.capacity.date);
  return Math.max(0, store.capacity.maxPizzas - used);
}

export async function getStore(): Promise<PizzaStore & { remaining: number }> {
  const store = await ensureStore();
  return { ...store, remaining: remainingPizzas(store) };
}

export async function createOrder(input: CreateOrderInput): Promise<PizzaOrder> {
  const store = await ensureStore();

  const orderPageOpen =
    store.orderPage.mode === 'manual' ? store.orderPage.manualEnabled : isOrderPageTimeOpen();

  if (!orderPageOpen) {
    throw new Error(store.orderPage.closedTitle);
  }

  if (!isOrdersOpen()) {
    throw new Error('Online objednávky jsou dostupné pouze pátek až neděli.');
  }

  if (!store.capacity.acceptingOrders) {
    throw new Error('Objednávky jsou momentálně pozastaveny.');
  }

  const count = pizzaCount(input.items);
  if (count < 1) {
    throw new Error('Vyberte alespoň jednu pizzu.');
  }

  const remaining = remainingPizzas(store);
  if (count > remaining) {
    throw new Error(`Dnes zbývá pouze ${remaining} pizz. Zkuste menší objednávku nebo jiný termín.`);
  }

  const order: PizzaOrder = {
    id: randomUUID().slice(0, 8),
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    pickupTime: input.pickupTime,
    items: input.items,
    note: input.note?.trim() || undefined,
    paymentMethod: input.paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  store.orders.unshift(order);
  await saveStoreData(store);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<PizzaOrder | null> {
  const store = await ensureStore();
  const order = store.orders.find((o) => o.id === id);
  if (!order) return null;

  if (status === 'confirmed') {
    const count = pizzaCount(order.items);
    const remaining = remainingPizzas(store);
    if (order.status === 'pending' && count > remaining) {
      throw new Error('Kapacita pro dnešek je naplněna.');
    }
  }

  order.status = status;
  await saveStoreData(store);
  return order;
}

export async function updateCapacity(
  updates: Partial<Pick<DailyCapacity, 'maxPizzas' | 'acceptingOrders'>>,
): Promise<DailyCapacity> {
  const store = await ensureStore();

  if (typeof updates.maxPizzas === 'number') {
    store.capacity.maxPizzas = Math.max(0, Math.min(200, updates.maxPizzas));
  }
  if (typeof updates.acceptingOrders === 'boolean') {
    store.capacity.acceptingOrders = updates.acceptingOrders;
  }

  await saveStoreData(store);
  return store.capacity;
}

export async function updateOrderPage(
  updates: Partial<OrderPageSettings>,
): Promise<OrderPageSettings> {
  const store = await ensureStore();
  store.orderPage = {
    ...defaultOrderPage(),
    ...store.orderPage,
    ...updates,
  };
  await saveStoreData(store);
  return store.orderPage;
}

export async function updateOpeningStatus(
  updates: Partial<OpeningStatusSettings>,
): Promise<OpeningStatusSettings> {
  const store = await ensureStore();
  store.openingStatus = {
    ...defaultOpeningStatus(),
    ...store.openingStatus,
    ...updates,
  };
  await saveStoreData(store);
  return store.openingStatus;
}

export async function updateSiteAnnouncement(
  updates: Partial<SiteAnnouncementSettings>,
): Promise<SiteAnnouncementSettings> {
  const store = await ensureStore();
  store.siteAnnouncement = {
    ...defaultSiteAnnouncement(),
    ...store.siteAnnouncement,
    ...updates,
  };
  await saveStoreData(store);
  return store.siteAnnouncement;
}

export async function updateWebsiteContent(
  updates: Partial<WebsiteContentSettings>,
): Promise<WebsiteContentSettings> {
  const store = await ensureStore();
  store.websiteContent = {
    ...defaultWebsiteContent(),
    ...store.websiteContent,
    ...updates,
    home: {
      ...defaultWebsiteContent().home,
      ...store.websiteContent?.home,
      ...updates.home,
    },
    pizza: {
      ...defaultWebsiteContent().pizza,
      ...store.websiteContent?.pizza,
      ...updates.pizza,
    },
    catering: {
      ...defaultWebsiteContent().catering,
      ...store.websiteContent?.catering,
      ...updates.catering,
    },
    kontakt: {
      ...defaultWebsiteContent().kontakt,
      ...store.websiteContent?.kontakt,
      ...updates.kontakt,
    },
  };
  await saveStoreData(store);
  return store.websiteContent;
}

export async function getTodayOrders(): Promise<PizzaOrder[]> {
  const store = await ensureStore();
  const date = store.capacity.date;
  return store.orders.filter((order) => order.pickupTime.startsWith(date));
}

export async function getOrderById(id: string): Promise<PizzaOrder | null> {
  const store = await ensureStore();
  return store.orders.find((order) => order.id === id) ?? null;
}
