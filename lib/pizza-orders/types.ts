export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'rejected';

export type PaymentMethod = 'on_site' | 'online';

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  on_site: 'Platba na místě',
  online: 'Platba online',
};

export type OrderItem = {
  pizzaName: string;
  quantity: number;
  extras?: string[];
  customization?: string;
};

export function formatOrderItem(item: OrderItem): string {
  const parts = [`${item.quantity}× ${item.pizzaName}`];
  if (item.extras?.length) {
    parts.push(`+ ${item.extras.join(', ')}`);
  }
  if (item.customization?.trim()) {
    parts.push(item.customization.trim());
  }
  return parts.join(' · ');
}

export type PizzaOrder = {
  id: string;
  customerName: string;
  phone: string;
  pickupTime: string; // ISO datetime
  items: OrderItem[];
  note?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
};

export type DailyCapacity = {
  date: string; // YYYY-MM-DD
  maxPizzas: number;
  acceptingOrders: boolean;
};

export type PizzaStore = {
  orders: PizzaOrder[];
  capacity: DailyCapacity;
};

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  pickupTime: string;
  items: OrderItem[];
  note?: string;
  paymentMethod: PaymentMethod;
};

export function pizzaCount(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function activeStatuses(): OrderStatus[] {
  return ['pending', 'confirmed', 'ready'];
}
