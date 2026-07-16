const TIME_ZONE = 'Europe/Prague';

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export type PragueClock = {
  year: number;
  month: number;
  day: number;
  dayIndex: number;
  hour: number;
  minute: number;
  nowMinutes: number;
  dateKey: string;
};

function partValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? '0';
}

/** Aktuální kalendářní čas v Europe/Prague. */
export function getPragueClock(now = new Date()): PragueClock {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const year = Number(partValue(parts, 'year'));
  const month = Number(partValue(parts, 'month'));
  const day = Number(partValue(parts, 'day'));
  const hour = Number(partValue(parts, 'hour'));
  const minute = Number(partValue(parts, 'minute'));
  const weekday = partValue(parts, 'weekday');

  return {
    year,
    month,
    day,
    dayIndex: WEEKDAY_TO_INDEX[weekday] ?? now.getDay(),
    hour,
    minute,
    nowMinutes: hour * 60 + minute,
    dateKey: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

/**
 * Převede nástěnné datum/čas v Europe/Prague na UTC Date.
 * Iterativně dorovná offset (CET/CEST).
 */
export function pragueWallTimeToDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const desiredAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let utcMs = desiredAsUtc;

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  for (let i = 0; i < 4; i += 1) {
    const parts = formatter.formatToParts(new Date(utcMs));
    const asUtc = Date.UTC(
      Number(partValue(parts, 'year')),
      Number(partValue(parts, 'month')) - 1,
      Number(partValue(parts, 'day')),
      Number(partValue(parts, 'hour')),
      Number(partValue(parts, 'minute')),
      0,
    );
    utcMs += desiredAsUtc - asUtc;
  }

  return new Date(utcMs);
}

export function isPizzaDayInPrague(now = new Date()): boolean {
  const { dayIndex } = getPragueClock(now);
  return dayIndex === 0 || dayIndex === 5 || dayIndex === 6;
}
