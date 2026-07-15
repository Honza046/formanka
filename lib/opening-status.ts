import { openingHours } from '@/lib/data';

export type OpeningStatus = {
  isOpen: boolean;
  opensLaterToday: boolean;
  message: string;
  variant: 'open' | 'soon' | 'closed';
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

const INDEX_TO_DAY_ACC: Record<number, string> = {
  0: 'v neděli',
  1: 'v pondělí',
  2: 'v úterý',
  3: 've středu',
  4: 've čtvrtek',
  5: 'v pátek',
  6: 'v sobotu',
};

type DaySchedule = {
  dayIndex: number;
  dayLabel: string;
  openMinutes: number;
  closeMinutes: number;
  openLabel: string;
  closeLabel: string;
};

function parseHoursString(hours: string): { openMinutes: number; closeMinutes: number; openLabel: string; closeLabel: string } | null {
  const match = hours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const openH = Number(match[1]);
  const openM = Number(match[2]);
  const closeH = Number(match[3]);
  const closeM = Number(match[4]);

  return {
    openMinutes: openH * 60 + openM,
    closeMinutes: closeH * 60 + closeM,
    openLabel: `${String(openH).padStart(2, '0')}:${String(openM).padStart(2, '0')}`,
    closeLabel: `${String(closeH).padStart(2, '0')}:${String(closeM).padStart(2, '0')}`,
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

function nowInPrague(now = new Date()): Date {
  return new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Prague' }));
}

export function getOpeningStatus(now = new Date()): OpeningStatus {
  const pragueNow = nowInPrague(now);
  const dayIndex = pragueNow.getDay();
  const nowMinutes = pragueNow.getHours() * 60 + pragueNow.getMinutes();

  const today = schedule.find((entry) => entry.dayIndex === dayIndex);

  if (today) {
    if (nowMinutes >= today.openMinutes && nowMinutes < today.closeMinutes) {
      return {
        isOpen: true,
        opensLaterToday: false,
        variant: 'open',
        message: `Nyní máme otevřeno · do ${today.closeLabel}`,
      };
    }

    if (nowMinutes < today.openMinutes) {
      return {
        isOpen: false,
        opensLaterToday: true,
        variant: 'soon',
        message: `Dnes otevíráme v ${today.openLabel}`,
      };
    }
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextIndex = (dayIndex + offset) % 7;
    const next = schedule.find((entry) => entry.dayIndex === nextIndex);
    if (!next) continue;

    return {
      isOpen: false,
      opensLaterToday: false,
      variant: 'closed',
      message: `Nyní máme zavřeno · otevíráme ${INDEX_TO_DAY_ACC[nextIndex]} v ${next.openLabel}`,
    };
  }

  return {
    isOpen: false,
    opensLaterToday: false,
    variant: 'closed',
    message: 'Nyní máme zavřeno',
  };
}
