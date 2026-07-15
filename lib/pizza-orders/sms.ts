import type { PizzaOrder } from './types';
import { site } from '@/lib/data';

export type SmsResult = {
  sent: boolean;
  simulated?: boolean;
  error?: string;
};

/** Normalizuje české číslo na formát +420XXXXXXXXX */
export function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('420') && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 9) {
    return `+420${digits}`;
  }
  if (digits.startsWith('420') && digits.length > 12) {
    return `+420${digits.slice(3, 12)}`;
  }

  return null;
}

function readyMessage(order: PizzaOrder): string {
  const pickup = new Date(order.pickupTime).toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    `${site.name} ${site.tagline}: Vase pizza (obj. #${order.id}) je pripravena k vyzvednuti` +
    ` do ${pickup}. Tel: ${site.phones[0]}. Na shledanou!`
  );
}

async function sendViaTwilio(to: string, body: string): Promise<SmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) {
    return { sent: false, error: 'Twilio neni nakonfigurovano' };
  }

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    return { sent: false, error: `Twilio: ${detail}` };
  }

  return { sent: true };
}

async function sendViaBulkGate(to: string, body: string): Promise<SmsResult> {
  const appId = process.env.BULKGATE_APPLICATION_ID;
  const appToken = process.env.BULKGATE_APPLICATION_TOKEN;
  const sender = process.env.BULKGATE_SENDER || site.name;

  if (!appId || !appToken) {
    return { sent: false, error: 'BulkGate neni nakonfigurovano' };
  }

  const number = to.replace('+420', '');

  const response = await fetch('https://portal.bulkgate.com/api/1.0/simple/transactional', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      application_id: appId,
      application_token: appToken,
      number,
      text: body,
      country: 'cz',
      sender_id: 'gText',
      sender_id_value: sender,
    }),
  });

  const data = await response.json();

  if (!response.ok || data?.data?.status === 'error') {
    return { sent: false, error: `BulkGate: ${JSON.stringify(data)}` };
  }

  return { sent: true };
}

/** Odešle SMS zákazníkovi — v dev režimu bez provideru jen loguje. */
export async function sendOrderReadySms(order: PizzaOrder): Promise<SmsResult> {
  const normalized = normalizePhone(order.phone);
  if (!normalized) {
    return { sent: false, error: 'Neplatne telefonni cislo' };
  }

  const body = readyMessage(order);
  const provider = process.env.SMS_PROVIDER || 'console';

  if (provider === 'console' || process.env.SMS_ENABLED === 'false') {
    console.log(`[SMS → ${normalized}] ${body}`);
    return { sent: true, simulated: true };
  }

  if (provider === 'twilio') {
    return sendViaTwilio(normalized, body);
  }

  if (provider === 'bulkgate') {
    return sendViaBulkGate(normalized, body);
  }

  return { sent: false, error: `Neznamy SMS provider: ${provider}` };
}
