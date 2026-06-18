import { asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import {
  aboutFeatures,
  blockedDates,
  bookingHighlights,
  bookingRules,
  bookingSettings,
  contactMessages,
  serviceCategories,
  services,
  siteConfig,
  soinsNotes,
  weeklyAvailability,
} from "@/db/schema";
import { defaultBookingSettings, defaultWeeklyAvailability, dayLabels } from "@/data/availability";
import { bookingHighlights as staticHighlights, bookingQuote as staticQuote, bookingRules as staticRules } from "@/data/booking";
import { contactInfo as staticContact, FORMSPREE_FORM_ID as staticFormspreeId } from "@/data/contact";
import { servicesData as staticServices, soinsNotes as staticSoinsNotes } from "@/data/services";
import { defaultAbout, defaultAboutFeatures, defaultHero } from "@/data/home";
import { parseAppointmentStatus } from "@/lib/appointments";
import { computeAvailableSlots } from "@/lib/availability";
import { resolveIcon, iconNameFromComponent } from "@/lib/icons";
import type {
  AboutContent,
  Appointment,
  AvailableSlot,
  BookingRule,
  BookingSettingsData,
  ContactInfo,
  HeroContent,
  SerializedAboutFeature,
  SerializedServiceCategory,
  Service,
  ServiceCategory,
  WeeklyDayConfig,
} from "@/types";

function mapDbCategory(
  cat: typeof serviceCategories.$inferSelect,
  items: (typeof services.$inferSelect)[],
): SerializedServiceCategory {
  return {
    id: cat.id,
    title: cat.title,
    icon: cat.icon,
    services: items
      .filter((s) => s.categoryId === cat.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(
        (s): Service => ({
          id: s.id,
          category: s.groupName,
          name: s.name,
          price: /^\d+$/.test(s.price) ? Number(s.price) : s.price,
          unit: s.priceUnit ?? undefined,
          duration: s.duration ?? undefined,
          description: s.description ?? undefined,
        }),
      ),
  };
}

function mapStaticCategory(cat: ServiceCategory): SerializedServiceCategory {
  return {
    id: cat.id,
    title: cat.title,
    icon: iconNameFromComponent(cat.icon),
    services: cat.services,
  };
}

export async function fetchServiceCategories(): Promise<SerializedServiceCategory[]> {
  const db = getDb();
  if (!db) return staticServices.map(mapStaticCategory);

  try {
    const cats = await db.select().from(serviceCategories).orderBy(asc(serviceCategories.sortOrder));
    if (cats.length === 0) return staticServices.map(mapStaticCategory);

    const allServices = await db.select().from(services).orderBy(asc(services.sortOrder));
    return cats.map((cat) => mapDbCategory(cat, allServices));
  } catch {
    return staticServices.map(mapStaticCategory);
  }
}

export async function fetchSoinsNotes(): Promise<string[]> {
  const db = getDb();
  if (!db) return staticSoinsNotes;

  try {
    const rows = await db.select().from(soinsNotes).orderBy(asc(soinsNotes.sortOrder));
    if (rows.length === 0) return staticSoinsNotes;
    return rows.map((r) => r.text);
  } catch {
    return staticSoinsNotes;
  }
}

export async function fetchBookingRules(): Promise<BookingRule[]> {
  const db = getDb();
  if (!db) {
    return staticRules;
  }

  try {
    const rows = await db.select().from(bookingRules).orderBy(asc(bookingRules.sortOrder));
    if (rows.length === 0) return staticRules;

    return rows.map((r) => ({
      id: r.id,
      icon: resolveIcon(r.icon),
      text: r.text,
      highlight: r.highlight ?? undefined,
    }));
  } catch {
    return staticRules;
  }
}

export async function fetchBookingHighlights(): Promise<string[]> {
  const db = getDb();
  if (!db) return staticHighlights;

  try {
    const rows = await db.select().from(bookingHighlights).orderBy(asc(bookingHighlights.sortOrder));
    if (rows.length === 0) return staticHighlights;
    return rows.map((r) => r.text);
  } catch {
    return staticHighlights;
  }
}

export async function fetchBookingQuote(): Promise<string> {
  const db = getDb();
  if (!db) return staticQuote;

  try {
    const rows = await db.select().from(siteConfig).where(eq(siteConfig.id, 1)).limit(1);
    return rows[0]?.bookingQuote ?? staticQuote;
  } catch {
    return staticQuote;
  }
}

export async function fetchContactInfo(): Promise<ContactInfo> {
  const db = getDb();
  if (!db) return staticContact;

  try {
    const rows = await db.select().from(siteConfig).where(eq(siteConfig.id, 1)).limit(1);
    const row = rows[0];
    if (!row) return staticContact;

    return {
      phone: row.phone,
      email: row.email,
      address: row.address,
      instagram: row.instagram,
      facebook: row.facebook,
      tiktok: row.tiktok,
      instagramUrl: row.instagramUrl,
      instagramDmUrl: row.instagramDmUrl,
      facebookUrl: row.facebookUrl,
      tiktokUrl: row.tiktokUrl,
    };
  } catch {
    return staticContact;
  }
}

export async function fetchFormspreeFormId(): Promise<string> {
  const db = getDb();
  if (!db) return process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? staticFormspreeId;

  try {
    const rows = await db.select().from(siteConfig).where(eq(siteConfig.id, 1)).limit(1);
    const id = rows[0]?.formspreeFormId;
    if (id) return id;
    return process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? staticFormspreeId;
  } catch {
    return process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? staticFormspreeId;
  }
}

function mapAppointment(row: typeof contactMessages.$inferSelect): Appointment {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    categoryId: row.categoryId,
    serviceId: row.serviceId,
    serviceLabel: row.serviceLabel,
    preferredDate: row.preferredDate,
    message: row.message,
    read: row.read,
    status: parseAppointmentStatus(row.status),
    confirmedAt: row.confirmedAt,
    adminNotes: row.adminNotes,
    trackingToken: row.trackingToken,
    slotStartAt: row.slotStartAt,
    createdAt: row.createdAt,
  };
}

export async function fetchBookingSettings(): Promise<BookingSettingsData> {
  const db = getDb();
  if (!db) return defaultBookingSettings;

  try {
    const rows = await db.select().from(bookingSettings).where(eq(bookingSettings.id, 1)).limit(1);
    const row = rows[0];
    if (!row) return defaultBookingSettings;
    return {
      slotDurationMinutes: row.slotDurationMinutes,
      bookingHorizonDays: row.bookingHorizonDays,
      minNoticeHours: row.minNoticeHours,
    };
  } catch {
    return defaultBookingSettings;
  }
}

export async function fetchWeeklyAvailability(): Promise<WeeklyDayConfig[]> {
  const db = getDb();
  if (!db) return defaultWeeklyAvailability;

  try {
    const rows = await db.select().from(weeklyAvailability).orderBy(asc(weeklyAvailability.dayOfWeek));
    if (rows.length === 0) return defaultWeeklyAvailability;
    return rows.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      label: dayLabels[r.dayOfWeek] ?? `Jour ${r.dayOfWeek}`,
      enabled: r.enabled,
      startTime: r.startTime,
      endTime: r.endTime,
    }));
  } catch {
    return defaultWeeklyAvailability;
  }
}

export async function fetchBlockedDateList(): Promise<{ date: string; label: string | null }[]> {
  const db = getDb();
  if (!db) return [];

  try {
    return await db.select().from(blockedDates).orderBy(asc(blockedDates.date));
  } catch {
    return [];
  }
}

async function fetchBookedSlotStarts(): Promise<string[]> {
  const db = getDb();
  if (!db) return [];

  const rows = await db
    .select({ slotStartAt: contactMessages.slotStartAt })
    .from(contactMessages)
    .where(
      inArray(contactMessages.status, ["pending", "confirmed"]),
    );

  return rows
    .filter((r) => r.slotStartAt != null)
    .map((r) => r.slotStartAt!.toISOString());
}

export async function fetchAvailableSlots(): Promise<AvailableSlot[]> {
  const [weekly, settings, blocked, booked] = await Promise.all([
    fetchWeeklyAvailability(),
    fetchBookingSettings(),
    fetchBlockedDateList(),
    fetchBookedSlotStarts(),
  ]);

  return computeAvailableSlots({
    weekly,
    settings,
    blockedDates: blocked.map((b) => b.date),
    bookedSlotStarts: booked,
  });
}

export async function fetchContactMessages(status?: string): Promise<Appointment[]> {
  const db = getDb();
  if (!db) return [];

  const rows =
    status && status !== "all"
      ? await db
          .select()
          .from(contactMessages)
          .where(eq(contactMessages.status, status))
          .orderBy(desc(contactMessages.createdAt))
      : await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));

  return rows.map(mapAppointment);
}

export async function fetchAppointmentByToken(token: string): Promise<Appointment | null> {
  const db = getDb();
  if (!db || !token) return null;

  try {
    const rows = await db.select().from(contactMessages).where(eq(contactMessages.trackingToken, token)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return mapAppointment(row);
  } catch {
    return null;
  }
}

export async function fetchUnreadMessageCount() {
  const stats = await fetchAdminNotificationStats();
  return stats.unread;
}

export type AdminNotificationStats = {
  unread: number;
  pending: number;
  latestUnreadName: string | null;
};

export async function fetchAdminNotificationStats(): Promise<AdminNotificationStats> {
  const db = getDb();
  if (!db) {
    return { unread: 0, pending: 0, latestUnreadName: null };
  }

  try {
    const unreadRows = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.read, false));
    const pendingRows = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.status, "pending"));
    const latestRows = await db
      .select({ name: contactMessages.name })
      .from(contactMessages)
      .where(eq(contactMessages.read, false))
      .orderBy(desc(contactMessages.createdAt))
      .limit(1);

    return {
      unread: unreadRows.length,
      pending: pendingRows.length,
      latestUnreadName: latestRows[0]?.name ?? null,
    };
  } catch {
    return { unread: 0, pending: 0, latestUnreadName: null };
  }
}

export async function fetchHeroContent(): Promise<HeroContent> {
  const db = getDb();
  if (!db) return defaultHero;

  try {
    const rows = await db.select().from(siteConfig).where(eq(siteConfig.id, 1)).limit(1);
    const row = rows[0];
    if (!row) return defaultHero;
    return {
      eyebrow: row.heroEyebrow,
      title: row.heroTitle,
      subtitle: row.heroSubtitle,
      promoBadge: row.heroPromoBadge ?? "",
      ctaLabel: row.heroCtaLabel,
      ctaHref: row.heroCtaHref,
    };
  } catch {
    return defaultHero;
  }
}

export async function fetchAboutContent(): Promise<AboutContent> {
  const db = getDb();
  if (!db) return defaultAbout;

  try {
    const rows = await db.select().from(siteConfig).where(eq(siteConfig.id, 1)).limit(1);
    const row = rows[0];
    if (!row) return defaultAbout;
    return {
      eyebrow: row.aboutEyebrow,
      title: row.aboutTitle,
      intro: row.aboutIntro,
    };
  } catch {
    return defaultAbout;
  }
}

export async function fetchAboutFeatures(): Promise<SerializedAboutFeature[]> {
  const db = getDb();
  if (!db) return defaultAboutFeatures;

  try {
    const rows = await db.select().from(aboutFeatures).orderBy(asc(aboutFeatures.sortOrder));
    if (rows.length === 0) return defaultAboutFeatures;
    return rows.map(function (r) {
      return { icon: r.icon, title: r.title, text: r.text };
    });
  } catch {
    return defaultAboutFeatures;
  }
}

export async function getPublicSiteData() {
  const [
    categories,
    soinsNotesList,
    bookingRulesList,
    bookingHighlightsList,
    bookingQuote,
    contactInfo,
    formspreeFormId,
    hero,
    about,
    aboutFeaturesList,
  ] = await Promise.all([
    fetchServiceCategories(),
    fetchSoinsNotes(),
    fetchBookingRules(),
    fetchBookingHighlights(),
    fetchBookingQuote(),
    fetchContactInfo(),
    fetchFormspreeFormId(),
    fetchHeroContent(),
    fetchAboutContent(),
    fetchAboutFeatures(),
  ]);

  return {
    categories,
    soinsNotes: soinsNotesList,
    bookingRules: bookingRulesList,
    bookingHighlights: bookingHighlightsList,
    bookingQuote,
    contactInfo,
    formspreeFormId,
    hero,
    about,
    aboutFeatures: aboutFeaturesList,
  };
}
