import { NextResponse } from 'next/server';
import { createOrder, getStore } from '@/lib/pizza-orders/store';
import { isOrdersOpen } from '@/lib/pizza-orders/pickup-slots';

export async function GET() {
  const store = await getStore();
  return NextResponse.json({
    remaining: store.remaining,
    maxPizzas: store.capacity.maxPizzas,
    acceptingOrders: store.capacity.acceptingOrders,
    ordersOpen: isOrdersOpen(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await createOrder(body);
    const store = await getStore();

    return NextResponse.json({ order, remaining: store.remaining }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Objednávku se nepodařilo vytvořit.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
