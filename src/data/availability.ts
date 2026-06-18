import type { WeeklyDayConfig } from "@/types";

/** Horaires par défaut — La Réunion (lun fermé, mar–ven 9h–18h, sam 9h–13h) */
export const defaultWeeklyAvailability: WeeklyDayConfig[] = [
  { dayOfWeek: 1, label: "Lundi", enabled: false, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 2, label: "Mardi", enabled: true, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 3, label: "Mercredi", enabled: true, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 4, label: "Jeudi", enabled: true, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 5, label: "Vendredi", enabled: true, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 6, label: "Samedi", enabled: true, startTime: "09:00", endTime: "13:00" },
  { dayOfWeek: 7, label: "Dimanche", enabled: false, startTime: "09:00", endTime: "18:00" },
];

export const defaultBookingSettings = {
  slotDurationMinutes: 60,
  bookingHorizonDays: 28,
  minNoticeHours: 12,
};

export const dayLabels: Record<number, string> = {
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
  7: "Dimanche",
};
