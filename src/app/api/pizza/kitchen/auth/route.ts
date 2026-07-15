import { NextResponse } from 'next/server';
import {
  COOKIE_NAME,
  createKitchenToken,
  verifyKitchenPin,
} from '@/lib/pizza-orders/auth';

export async function POST(request: Request) {
  const { pin } = await request.json();

  if (!verifyKitchenPin(pin)) {
    return NextResponse.json({ error: 'Neplatný PIN' }, { status: 401 });
  }

  const token = createKitchenToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 12 * 60 * 60,
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
