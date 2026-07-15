import { NextResponse } from 'next/server';
import { toCustomerOrderView } from '@/lib/pizza-orders/customer-status';
import { verifyPhone } from '@/lib/pizza-orders/phone';
import { getOrderById } from '@/lib/pizza-orders/store';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const phone = new URL(request.url).searchParams.get('phone');

  if (!phone?.trim()) {
    return NextResponse.json({ error: 'Zadejte telefon pro ověření.' }, { status: 400 });
  }

  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: 'Objednávka nenalezena.' }, { status: 404 });
  }

  if (!verifyPhone(order.phone, phone)) {
    return NextResponse.json({ error: 'Neplatné telefonní číslo.' }, { status: 403 });
  }

  return NextResponse.json({ order: toCustomerOrderView(order) });
}
