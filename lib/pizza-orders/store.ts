import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type {
  CreateOrderInput,
  DailyCapacity,
  OrderStatus,
  PizzaOrder,
  PizzaStore,
} from './types';
import { activeStatuses, pizzaCount } from './types';
import { isOrdersOpen } from './pickup-slots';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'pizza-orders.json');

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

function defaultStore(): PizzaStore {
  return { orders: [], capacity: defaultCapacity() };
}

async function ensureStore(): Promise<PizzaStore> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    const raw = await fs.readFile(STORE_FILE, 'utf-8');
    const store = JSON.parse(raw) as PizzaStore;

    if (store.capacity.date !== todayDate()) {
      store.capacity = defaultCapacity();
      store.orders = store.orders.filter((order) => !order.pickupTime.startsWith(todayDate()));
    }

    return store;
  } catch {
    const store = defaultStore();
    await saveStore(store);
    return store;
  }
}

async function saveStore(store: PizzaStore): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
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
  await saveStore(store);
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
  await saveStore(store);
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

  await saveStore(store);
  return store.capacity;
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
