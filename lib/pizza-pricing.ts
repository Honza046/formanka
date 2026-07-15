import {
  getExtraPrice,
  getPizzaPrice,
  lineItemTotal,
  pizzaBoxPrice,
} from '@/lib/data';
import type { OrderItem } from '@/lib/pizza-orders/types';

export function orderItemsTotal(items: OrderItem[]): number {
  const pizzas = items.reduce(
    (sum, item) => sum + lineItemTotal(item.pizzaName, item.quantity, item.extras ?? []),
    0,
  );
  const boxes = items.reduce((sum, item) => sum + item.quantity, 0) * pizzaBoxPrice;
  return pizzas + boxes;
}

export { getExtraPrice, getPizzaPrice, lineItemTotal, pizzaBoxPrice };
