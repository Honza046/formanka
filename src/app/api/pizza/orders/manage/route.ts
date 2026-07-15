import { NextResponse } from 'next/server';
import { isKitchenAuthenticated } from '@/lib/pizza-orders/auth';
import { getTodayOrders, updateOrderStatus } from '@/lib/pizza-orders/store';
import type { OrderStatus } from '@/lib/pizza-orders/types';

export async function GET() {
  if (!(await isKitchenAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 });
  }

  const orders = await getTodayOrders();
  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  if (!(await isKitchenAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 });
  }

  try {
    const { id, status } = (await request.json()) as { id: string; status: OrderStatus };
    const order = await updateOrderStatus(id, status);

    if (!order) {
      return NextResponse.json({ error: 'Objednávka nenalezena' }, { status: 404 });
    }

    // SMS vypnuto dokud neni explicitne zapnuto v .env
    if (status === 'ready' && process.env.SMS_ENABLED === 'true') {
      const { sendOrderReadySms } = await import('@/lib/pizza-orders/sms');
      const sms = await sendOrderReadySms(order);
      if (sms.error && !sms.sent) {
        console.error('[SMS]', sms.error);
      }
      return NextResponse.json({ order, sms });
    }

    return NextResponse.json({ order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Aktualizace selhala.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
