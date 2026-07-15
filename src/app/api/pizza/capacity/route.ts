import { NextResponse } from 'next/server';
import { isKitchenAuthenticated } from '@/lib/pizza-orders/auth';
import { getStore, updateCapacity } from '@/lib/pizza-orders/store';

export async function GET() {
  if (!(await isKitchenAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 });
  }

  const store = await getStore();
  return NextResponse.json({
    capacity: store.capacity,
    remaining: store.remaining,
    reserved: store.capacity.maxPizzas - store.remaining,
  });
}

export async function PATCH(request: Request) {
  if (!(await isKitchenAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizováno' }, { status: 401 });
  }

  const body = await request.json();
  const capacity = await updateCapacity(body);
  const store = await getStore();

  return NextResponse.json({
    capacity,
    remaining: store.remaining,
  });
}
