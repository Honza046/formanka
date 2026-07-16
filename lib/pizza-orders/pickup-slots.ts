import { getPragueClock, isPizzaDayInPrague, pragueWallTimeToDate } from '@/lib/prague-time';

const START_HOUR = 17;
const END_HOUR = 22;
const SLOT_MINUTES = 15;

export function startHourLabel(): string {
  return `${String(START_HOUR).padStart(2, '0')}:00`;
}

function roundUpMinutes(totalMinutes: number): number {
  const remainder = totalMinutes % SLOT_MINUTES;
  if (remainder === 0) return totalMinutes;
  return totalMinutes + (SLOT_MINUTES - remainder);
}

/** Generuje sloty 17:00–22:00 po 15 min v Europe/Prague; minulé časy se neukazují. */
export function getPickupSlots(now = new Date()): { value: string; label: string }[] {
  if (!isPizzaDay(now) && !isDevOrdersOpen()) {
    return [];
  }

  const clock = getPragueClock(now);
  const startMinutes = START_HOUR * 60;
  const endMinutes = END_HOUR * 60;

  if (clock.nowMinutes >= endMinutes) {
    return [];
  }

  let cursorMinutes = clock.nowMinutes > startMinutes ? roundUpMinutes(clock.nowMinutes) : startMinutes;
  if (cursorMinutes > endMinutes) {
    return [];
  }

  const slots: { value: string; label: string }[] = [];

  while (cursorMinutes <= endMinutes) {
    const hour = Math.floor(cursorMinutes / 60);
    const minute = cursorMinutes % 60;
    const slotDate = pragueWallTimeToDate(clock.year, clock.month, clock.day, hour, minute);

    slots.push({
      value: slotDate.toISOString(),
      label: slotDate.toLocaleString('cs-CZ', {
        timeZone: 'Europe/Prague',
        weekday: 'short',
        day: 'numeric',
        month: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    cursorMinutes += SLOT_MINUTES;
  }

  return slots;
}

export function isPizzaDay(date = new Date()): boolean {
  return isPizzaDayInPrague(date);
}

export function isDevOrdersOpen(): boolean {
  return (
    process.env.PIZZA_ORDERS_ALWAYS_OPEN === 'true' ||
    process.env.NODE_ENV === 'development'
  );
}

export function isOrdersOpen(): boolean {
  return isPizzaDay() || isDevOrdersOpen();
}

export function isOrderPageTimeOpen(now = new Date()): boolean {
  if (isDevOrdersOpen()) return true;
  if (!isPizzaDay(now)) return false;

  const { nowMinutes } = getPragueClock(now);
  return nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60;
}
