import type { OrderStatus, PizzaOrder } from './types';
import { formatOrderItem, paymentMethodLabels } from './types';

export type CustomerOrderView = {
  id: string;
  status: OrderStatus;
  statusLabel: string;
  statusHint: string;
  customerName: string;
  pickupTime: string;
  items: { label: string }[];
  note?: string;
  paymentMethod: string;
};

const customerStatus: Record<
  OrderStatus,
  { label: string; hint: string }
> = {
  pending: {
    label: 'Čeká na potvrzení',
    hint: 'Kuchyně objednávku brzy zkontroluje. Po potvrzení vám stav zaktualizujeme.',
  },
  confirmed: {
    label: 'Potvrzeno, peče se',
    hint: 'Vaše pizzy se právě připravují. Přijďte prosím v domluvený čas.',
  },
  ready: {
    label: 'Hotovo k vyzvednutí',
    hint: 'Pizzy jsou připravené. Můžete si je vyzvednout v restauraci.',
  },
  completed: {
    label: 'Vyzvednuto',
    hint: 'Děkujeme za objednávku. Těšíme se na vás příště.',
  },
  rejected: {
    label: 'Zamítnuto',
    hint: 'Objednávku se nepodařilo přijmout. Zavolejte nám prosím telefonicky.',
  },
};

export function toCustomerOrderView(order: PizzaOrder): CustomerOrderView {
  const meta = customerStatus[order.status];
  return {
    id: order.id,
    status: order.status,
    statusLabel: meta.label,
    statusHint: meta.hint,
    customerName: order.customerName,
    pickupTime: order.pickupTime,
    items: order.items.map((item) => ({ label: formatOrderItem(item) })),
    note: order.note,
    paymentMethod: paymentMethodLabels[order.paymentMethod ?? 'on_site'],
  };
}

export const statusSteps: OrderStatus[] = ['pending', 'confirmed', 'ready', 'completed'];
