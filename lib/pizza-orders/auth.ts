import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'kitchen_session';
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hodin

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
}

function secret(): string {
  const value = process.env.KITCHEN_SECRET || process.env.KITCHEN_PIN;
  if (value) return value;
  if (isProduction()) {
    throw new Error('KITCHEN_SECRET nebo KITCHEN_PIN musí být nastavené v produkci.');
  }
  return 'formanka-dev-secret';
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

export function verifyKitchenPin(pin: unknown): boolean {
  const expected = process.env.KITCHEN_PIN;
  if (!expected) {
    if (isProduction()) return false;
    return String(pin ?? '').trim() === '1234';
  }
  return String(pin ?? '').trim() === expected;
}

export function createKitchenToken(): string {
  const expires = Date.now() + TOKEN_TTL_MS;
  const payload = `${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function validateKitchenToken(token: string): boolean {
  const [expiresStr, signature] = token.split('.');
  if (!expiresStr || !signature) return false;

  const expected = sign(expiresStr);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) return false;

  return Date.now() < Number(expiresStr);
}

export async function isKitchenAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return validateKitchenToken(token);
}

export { COOKIE_NAME };
