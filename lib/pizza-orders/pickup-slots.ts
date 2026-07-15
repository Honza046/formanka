const START_HOUR = 17;
const END_HOUR = 22;
const SLOT_MINUTES = 15;

function roundUpToSlot(date: Date): Date {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);
  const remainder = rounded.getMinutes() % SLOT_MINUTES;
  if (remainder !== 0) {
    rounded.setMinutes(rounded.getMinutes() + (SLOT_MINUTES - remainder));
  }
  return rounded;
}

/** Generuje sloty 17:00–22:00 po 15 min; minulé časy se neukazují. V dev režimu i ve všední dny. */
export function getPickupSlots(now = new Date()): { value: string; label: string }[] {
  if (!isPizzaDay(now) && !isDevOrdersOpen()) {
    return [];
  }

  const start = new Date(now);
  start.setHours(START_HOUR, 0, 0, 0);

  const end = new Date(now);
  end.setHours(END_HOUR, 0, 0, 0);

  if (now >= end) {
    return [];
  }

  const earliest = roundUpToSlot(now > start ? now : start);

  const slots: { value: string; label: string }[] = [];
  const cursor = new Date(earliest);

  while (cursor <= end) {
    slots.push({
      value: cursor.toISOString(),
      label: cursor.toLocaleString('cs-CZ', {
        weekday: 'short',
        day: 'numeric',
        month: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
    cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
  }

  return slots;
}

export function isPizzaDay(date = new Date()): boolean {
  const day = date.getDay();
  return day === 0 || day === 5 || day === 6;
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
