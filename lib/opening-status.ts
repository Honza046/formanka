import { openingHours } from '@/lib/data';
import type { OpeningStatusSettings } from '@/lib/pizza-orders/types';
import { getPragueClock } from '@/lib/prague-time';

export type OpeningStatus = {
  isOpen: boolean;
  opensLaterToday: boolean;
  message: string;
  alternateMessage?: string;
  variant: 'open' | 'soon' | 'closed';
};

const defaultSettings: OpeningStatusSettings = {
  mode: 'auto',
  openLabel: 'Nyní máme otevřeno',
  closedLabel: 'Nyní máme zavřeno',
  opensTodayLabel: 'Otevíráme v',
  opensAnotherDayLabel: 'Otevíráme',
  untilLabel: 'do',
};

const DAY_TO_INDEX: Record<string, number> = {
  Neděle: 0,
  Pondělí: 1,
  Úterý: 2,
  Středa: 3,
  Čtvrtek: 4,
  Pátek: 5,
  Sobota: 6,
};

const INDEX_TO_DAY_SHORT: Record<number, string> = {
  0: 'ne',
  1: 'po',
  2: 'út',
  3: 'st',
  4: 'čt',
  5: 'pá',
  6: 'so',
};

type DaySchedule = {
  dayIndex: number;
  dayLabel: string;
  openMinutes: number;
  closeMinutes: number;
  openLabel: string;
  closeLabel: string;
};

function parseHoursString(
  hours: string,
): { openMinutes: number; closeMinutes: number; openLabel: string; closeLabel: string } | null {
  const match = hours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const openH = Number(match[1]);
  const openM = Number(match[2]);
  let closeH = Number(match[3]);
  const closeM = Number(match[4]);

  // 24:00 = půlnoc (konec dne)
  if (closeH === 24 && closeM === 0) {
    closeH = 24;
  }

  const closeMinutes = closeH * 60 + closeM;

  return {
    openMinutes: openH * 60 + openM,
    closeMinutes: closeMinutes === 0 ? 24 * 60 : closeMinutes,
    openLabel: `${String(openH).padStart(2, '0')}:${String(openM).padStart(2, '0')}`,
    closeLabel:
      closeH === 24 && closeM === 0
        ? '24:00'
        : `${String(closeH).padStart(2, '0')}:${String(closeM).padStart(2, '0')}`,
  };
}

function buildSchedule(): DaySchedule[] {
  const schedule: DaySchedule[] = [];

  for (const { day, hours } of openingHours) {
    const dayIndex = DAY_TO_INDEX[day];
    const parsed = parseHoursString(hours);
    if (dayIndex === undefined || !parsed) continue;

    schedule.push({ dayIndex, dayLabel: day, ...parsed });
  }

  return schedule.sort((a, b) => a.dayIndex - b.dayIndex);
}

const schedule = buildSchedule();

function findNextOpening(
  dayIndex: number,
  nowMinutes: number,
): { dayIndex: number; openLabel: string; opensLaterToday: boolean } | null {
  const today = schedule.find((entry) => entry.dayIndex === dayIndex);
  if (today && nowMinutes < today.openMinutes) {
    return {
      dayIndex,
      openLabel: today.openLabel,
      opensLaterToday: true,
    };
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextIndex = (dayIndex + offset) % 7;
    const next = schedule.find((entry) => entry.dayIndex === nextIndex);
    if (!next) continue;

    return {
      dayIndex: nextIndex,
      openLabel: next.openLabel,
      opensLaterToday: false,
    };
  }

  return null;
}

function closedStatus(
  labels: OpeningStatusSettings,
  dayIndex: number,
  nowMinutes: number,
): OpeningStatus {
  const next = findNextOpening(dayIndex, nowMinutes);

  if (next?.opensLaterToday) {
    return {
      isOpen: false,
      opensLaterToday: true,
      variant: 'soon',
      message: labels.closedLabel,
      alternateMessage: `${labels.opensTodayLabel} ${next.openLabel}`,
    };
  }

  if (next) {
    return {
      isOpen: false,
      opensLaterToday: false,
      variant: 'closed',
      message: labels.closedLabel,
      alternateMessage: `${labels.opensAnotherDayLabel} ${INDEX_TO_DAY_SHORT[next.dayIndex]} ${next.openLabel}`,
    };
  }

  return {
    isOpen: false,
    opensLaterToday: false,
    variant: 'closed',
    message: labels.closedLabel,
  };
}

function openStatus(labels: OpeningStatusSettings, today: DaySchedule | undefined): OpeningStatus {
  const until = today ? ` · ${labels.untilLabel} ${today.closeLabel}` : '';
  return {
    isOpen: true,
    opensLaterToday: false,
    variant: 'open',
    message: `${labels.openLabel}${until}`,
  };
}

export function getOpeningStatus(
  now = new Date(),
  settings: Partial<OpeningStatusSettings> = {},
): OpeningStatus {
  const labels = { ...defaultSettings, ...settings };
  const { dayIndex, nowMinutes } = getPragueClock(now);
  const today = schedule.find((entry) => entry.dayIndex === dayIndex);

  if (labels.mode === 'open') {
    return openStatus(labels, today);
  }

  if (labels.mode === 'closed') {
    return closedStatus(labels, dayIndex, nowMinutes);
  }

  if (today) {
    if (nowMinutes >= today.openMinutes && nowMinutes < today.closeMinutes) {
      return openStatus(labels, today);
    }

    if (nowMinutes < today.openMinutes) {
      return closedStatus(labels, dayIndex, nowMinutes);
    }
  }

  return closedStatus(labels, dayIndex, nowMinutes);
}
