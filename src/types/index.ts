import type { LucideIcon } from "lucide-react";
import type { AppointmentStatus } from "@/lib/appointments";

export interface Service {
  id: string;
  category: string;
  name: string;
  price: number | string;
  unit?: string;
  duration?: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  services: Service[];
}

export interface BookingRule {
  id: string;
  icon: LucideIcon;
  text: string;
  highlight?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  instagramUrl: string;
  instagramDmUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
}

/** Contenu de la bannière d'accueil */
export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  promoBadge: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Section à propos */
export interface AboutContent {
  eyebrow: string;
  title: string;
  intro: string;
}

export interface SerializedAboutFeature {
  icon: string;
  title: string;
  text: string;
}

/** Catégorie sérialisable (icône en nom de string pour les Client Components) */
export interface SerializedServiceCategory {
  id: string;
  title: string;
  icon: string;
  services: Service[];
}


/** Demande de rendez-vous (message contact) */
export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  categoryId: string;
  serviceId: string | null;
  serviceLabel: string | null;
  preferredDate: string | null;
  message: string | null;
  read: boolean;
  status: AppointmentStatus;
  confirmedAt: Date | null;
  adminNotes: string | null;
  trackingToken: string;
  slotStartAt: Date | null;
  createdAt: Date;
}

export interface AvailableSlot {
  startAt: string;
  dateKey: string;
  timeKey: string;
  label: string;
}

export interface WeeklyDayConfig {
  dayOfWeek: number;
  label: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface BookingSettingsData {
  slotDurationMinutes: number;
  bookingHorizonDays: number;
  minNoticeHours: number;
}

export type { AppointmentStatus };
