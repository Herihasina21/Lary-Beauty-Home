import type { AvailableSlot, BookingSettingsData, WeeklyDayConfig } from "@/types";

export const SALON_TIMEZONE = "Indian/Reunion";

const weekdayMap: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Date locale YYYY-MM-DD à La Réunion */
export function reunionDateKey(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: SALON_TIMEZONE });
}

export function isoWeekdayInReunion(date: Date): number {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: SALON_TIMEZONE,
    weekday: "short",
  }).format(date);
  return weekdayMap[wd] ?? 1;
}

/** Convertit une date/heure locale Réunion en Date UTC */
export function reunionLocalToUtc(dateKey: string, timeKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  const [hh, mm] = timeKey.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh - 4, mm));
}

export function formatSlotLabel(dateKey: string, timeKey: string): string {
  const date = reunionLocalToUtc(dateKey, timeKey);
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: SALON_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatSlotLabelFromIso(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: SALON_TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function addDaysToDateKey(dateKey: string, days: number): string {
  const base = reunionLocalToUtc(dateKey, "12:00");
  base.setUTCDate(base.getUTCDate() + days);
  return reunionDateKey(base);
}

export function computeAvailableSlots(input: {
  weekly: WeeklyDayConfig[];
  settings: BookingSettingsData;
  blockedDates: string[];
  bookedSlotStarts: string[];
  now?: Date;
}): AvailableSlot[] {
  const now = input.now ?? new Date();
  const minStart = new Date(now.getTime() + input.settings.minNoticeHours * 60 * 60 * 1000);
  const blocked = new Set(input.blockedDates);
  const booked = new Set(input.bookedSlotStarts);
  const slots: AvailableSlot[] = [];

  let dateKey = reunionDateKey(now);
  for (let i = 0; i < input.settings.bookingHorizonDays; i++) {
    const probe = reunionLocalToUtc(dateKey, "12:00");
    const dow = isoWeekdayInReunion(probe);
    const dayConfig = input.weekly.find((d) => d.dayOfWeek === dow);

    if (dayConfig?.enabled && !blocked.has(dateKey)) {
      const startMin = parseTimeToMinutes(dayConfig.startTime);
      const endMin = parseTimeToMinutes(dayConfig.endTime);
      const step = input.settings.slotDurationMinutes;

      for (let t = startMin; t + step <= endMin; t += step) {
        const timeKey = minutesToTime(t);
        const startAt = reunionLocalToUtc(dateKey, timeKey).toISOString();
        if (new Date(startAt) < minStart) continue;
        if (booked.has(startAt)) continue;

        slots.push({
          startAt,
          dateKey,
          timeKey,
          label: formatSlotLabel(dateKey, timeKey),
        });
      }
    }

    dateKey = addDaysToDateKey(dateKey, 1);
  }

  return slots;
}

export function isSlotAvailable(slots: AvailableSlot[], startAt: string): boolean {
  return slots.some((s) => s.startAt === startAt);
}
