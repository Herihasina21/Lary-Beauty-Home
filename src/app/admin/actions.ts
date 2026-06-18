"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { asc, eq, inArray } from "drizzle-orm";
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
import { createSession, destroySession, getSession, verifyCredentials } from "@/lib/auth";
import { parseAppointmentStatus } from "@/lib/appointments";
import { formatSlotLabelFromIso, isSlotAvailable } from "@/lib/availability";
import { newId } from "@/lib/id";
import { buildDefaultSiteConfig } from "@/lib/site-config-defaults";
import {
  fetchAvailableSlots,
  fetchBlockedDateList,
  fetchBookingSettings,
  fetchWeeklyAvailability,
} from "@/lib/site-data";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath("/admin/contact");
  revalidatePath("/admin/booking");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/home");
  revalidatePath("/admin/disponibilites");
}

async function getSiteConfigRow() {
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(siteConfig).where(eq(siteConfig.id, 1)).limit(1);
  return rows[0] ?? null;
}

async function mergeSiteConfig(patch: Partial<typeof siteConfig.$inferInsert>) {
  const db = getDb();
  if (!db) return;
  const base = (await getSiteConfigRow()) ?? buildDefaultSiteConfig();
  const next = { ...base, ...patch, id: 1 as const };
  await db.insert(siteConfig).values(next).onConflictDoUpdate({
    target: siteConfig.id,
    set: next,
  });
}

function redirectSaved(formData: FormData, fallback: string) {
  const path = String(formData.get("returnPath") ?? fallback);
  redirect(`${path}?saved=1`);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return { error: "Identifiants incorrects." };
  }

  await createSession(user.id, user.email);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveSiteConfigAction(formData: FormData) {
  await requireAdmin();
  if (!getDb()) return;

  await mergeSiteConfig({
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
    tiktok: String(formData.get("tiktok") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    instagramDmUrl: String(formData.get("instagramDmUrl") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? ""),
    tiktokUrl: String(formData.get("tiktokUrl") ?? ""),
    formspreeFormId: String(formData.get("formspreeFormId") ?? "") || null,
    bookingQuote: String(formData.get("bookingQuote") ?? ""),
  });

  revalidateAll();
  redirectSaved(formData, "/admin/contact");
}

export async function saveHomePageAction(formData: FormData) {
  await requireAdmin();
  if (!getDb()) return;

  await mergeSiteConfig({
    heroEyebrow: String(formData.get("heroEyebrow") ?? ""),
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    heroPromoBadge: String(formData.get("heroPromoBadge") ?? "") || null,
    heroCtaLabel: String(formData.get("heroCtaLabel") ?? ""),
    heroCtaHref: String(formData.get("heroCtaHref") ?? ""),
    aboutEyebrow: String(formData.get("aboutEyebrow") ?? ""),
    aboutTitle: String(formData.get("aboutTitle") ?? ""),
    aboutIntro: String(formData.get("aboutIntro") ?? ""),
  });

  revalidateAll();
  redirectSaved(formData, "/admin/home");
}

export async function saveAboutFeatureAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? newId());

  await db
    .insert(aboutFeatures)
    .values({
      id,
      icon: String(formData.get("icon") ?? "Home"),
      title: String(formData.get("title") ?? ""),
      text: String(formData.get("text") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    })
    .onConflictDoUpdate({
      target: aboutFeatures.id,
      set: {
        icon: String(formData.get("icon") ?? "Home"),
        title: String(formData.get("title") ?? ""),
        text: String(formData.get("text") ?? ""),
        sortOrder: Number(formData.get("sortOrder") ?? 0),
      },
    });

  revalidateAll();
  redirectSaved(formData, "/admin/home");
}

export async function deleteAboutFeatureAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? "");
  if (id) await db.delete(aboutFeatures).where(eq(aboutFeatures.id, id));

  revalidateAll();
  redirectSaved(formData, "/admin/home");
}

export async function saveServiceAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? newId());
  const categoryId = String(formData.get("categoryId") ?? "");
  const priceRaw = String(formData.get("price") ?? "");

  await db
    .insert(services)
    .values({
      id,
      categoryId,
      groupName: String(formData.get("groupName") ?? ""),
      name: String(formData.get("name") ?? ""),
      price: priceRaw,
      priceUnit: String(formData.get("priceUnit") ?? "") || null,
      duration: String(formData.get("duration") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    })
    .onConflictDoUpdate({
      target: services.id,
      set: {
        categoryId,
        groupName: String(formData.get("groupName") ?? ""),
        name: String(formData.get("name") ?? ""),
        price: priceRaw,
        priceUnit: String(formData.get("priceUnit") ?? "") || null,
        duration: String(formData.get("duration") ?? "") || null,
        description: String(formData.get("description") ?? "") || null,
        sortOrder: Number(formData.get("sortOrder") ?? 0),
      },
    });

  revalidateAll();
  redirectSaved(formData, "/admin/services");
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? "");
  if (id) await db.delete(services).where(eq(services.id, id));

  revalidateAll();
  redirectSaved(formData, "/admin/services");
}

export async function saveBookingRuleAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? newId());

  await db
    .insert(bookingRules)
    .values({
      id,
      icon: String(formData.get("icon") ?? "Info"),
      text: String(formData.get("text") ?? ""),
      highlight: String(formData.get("highlight") ?? "") || null,
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    })
    .onConflictDoUpdate({
      target: bookingRules.id,
      set: {
        icon: String(formData.get("icon") ?? "Info"),
        text: String(formData.get("text") ?? ""),
        highlight: String(formData.get("highlight") ?? "") || null,
        sortOrder: Number(formData.get("sortOrder") ?? 0),
      },
    });

  revalidateAll();
  redirectSaved(formData, "/admin/booking");
}

export async function deleteBookingRuleAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? "");
  if (id) await db.delete(bookingRules).where(eq(bookingRules.id, id));

  revalidateAll();
  redirectSaved(formData, "/admin/booking");
}

export async function saveBookingHighlightAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? newId());

  await db
    .insert(bookingHighlights)
    .values({
      id,
      text: String(formData.get("text") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    })
    .onConflictDoUpdate({
      target: bookingHighlights.id,
      set: {
        text: String(formData.get("text") ?? ""),
        sortOrder: Number(formData.get("sortOrder") ?? 0),
      },
    });

  revalidateAll();
  redirectSaved(formData, "/admin/booking");
}

export async function deleteBookingHighlightAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? "");
  if (id) await db.delete(bookingHighlights).where(eq(bookingHighlights.id, id));

  revalidateAll();
  redirectSaved(formData, "/admin/booking");
}

export async function markMessageReadAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? "");
  if (id) {
    await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
  }

  revalidateAll();
  redirectSaved(formData, "/admin/messages");
}

export async function markAppointmentReadAction(id: string) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  if (id) {
    await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
  }

  revalidateAll();
}

export async function updateAppointmentAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const rows = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
  const existing = rows[0];
  if (!existing) return;

  const previousStatus = parseAppointmentStatus(existing.status);
  const status = parseAppointmentStatus(String(formData.get("status") ?? "pending"));
  const confirmedRaw = String(formData.get("confirmedAt") ?? "").trim();
  let confirmedAt = confirmedRaw ? new Date(confirmedRaw) : null;
  if (confirmedAt && Number.isNaN(confirmedAt.getTime())) confirmedAt = null;
  if (status === "confirmed" && !confirmedAt && existing.slotStartAt) {
    confirmedAt = existing.slotStartAt;
  }
  const adminNotes = String(formData.get("adminNotes") ?? "").trim() || null;
  const trackingToken = String(formData.get("trackingToken") ?? "");

  await db
    .update(contactMessages)
    .set({
      status,
      confirmedAt,
      adminNotes,
      read: true,
    })
    .where(eq(contactMessages.id, id));

  if (status === "confirmed" && previousStatus !== "confirmed") {
    const { sendBookingConfirmedEmail } = await import("@/lib/mail/booking-mails");
    await sendBookingConfirmedEmail({
      name: existing.name,
      email: existing.email,
      serviceLabel: existing.serviceLabel || existing.categoryId,
      confirmedAt,
      slotStartAt: existing.slotStartAt,
      preferredDate: existing.preferredDate,
      adminNotes,
      trackingToken: existing.trackingToken,
    });
  }

  revalidateAll();
  if (trackingToken) {
    revalidatePath(`/rdv/suivi/${trackingToken}`);
  }
  redirectSaved(formData, "/admin/messages");
}

export async function saveContactMessageAction(payload: {
  name: string;
  phone: string;
  email: string;
  categoryId: string;
  serviceId: string;
  serviceLabel: string;
  slotStartAt: string;
  message: string;
}) {
  const db = getDb();
  if (!db) return { success: false as const, error: "db" as const };

  if (!payload.slotStartAt) {
    return { success: false as const, error: "slot_required" as const };
  }

  const slotDate = new Date(payload.slotStartAt);
  if (Number.isNaN(slotDate.getTime())) {
    return { success: false as const, error: "slot_invalid" as const };
  }

  const available = await fetchAvailableSlots();
  if (!isSlotAvailable(available, payload.slotStartAt)) {
    return { success: false as const, error: "slot_taken" as const };
  }

  const booked = await db
    .select({ slotStartAt: contactMessages.slotStartAt })
    .from(contactMessages)
    .where(inArray(contactMessages.status, ["pending", "confirmed"]));
  if (booked.some((b) => b.slotStartAt?.toISOString() === payload.slotStartAt)) {
    return { success: false as const, error: "slot_taken" as const };
  }

  const id = newId();
  const trackingToken = newId();
  const preferredDate = formatSlotLabelFromIso(payload.slotStartAt);

  await db.insert(contactMessages).values({
    id,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    categoryId: payload.categoryId,
    serviceId: payload.serviceId || null,
    serviceLabel: payload.serviceLabel || null,
    preferredDate,
    slotStartAt: slotDate,
    message: payload.message || null,
    status: "pending",
    trackingToken,
  });

  revalidateAll();

  await afterBookingSaved({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    serviceLabel: payload.serviceLabel,
    slotStartAt: payload.slotStartAt,
    preferredDate,
    message: payload.message || null,
    trackingToken,
  });

  return { success: true as const, trackingToken };
}

async function afterBookingSaved(payload: {
  name: string;
  phone: string;
  email: string;
  serviceLabel: string;
  slotStartAt: string;
  preferredDate: string;
  message: string | null;
  trackingToken: string;
}) {
  const { sendBookingReceivedEmails } = await import("@/lib/mail/booking-mails");
  await sendBookingReceivedEmails({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    serviceLabel: payload.serviceLabel || "Prestation",
    slotStartAt: payload.slotStartAt,
    slotLabel: payload.preferredDate,
    message: payload.message,
    trackingToken: payload.trackingToken,
  });
}

export async function getAdminDashboardData() {
  await requireAdmin();
  const db = getDb();
  if (!db) {
    return {
      dbAvailable: false,
      serviceCount: 0,
      unreadMessages: 0,
      pendingAppointments: 0,
    };
  }

  const allServices = await db.select().from(services);
  const unread = await db.select().from(contactMessages).where(eq(contactMessages.read, false));
  const pending = await db.select().from(contactMessages).where(eq(contactMessages.status, "pending"));

  return {
    dbAvailable: true,
    serviceCount: allServices.length,
    unreadMessages: unread.length,
    pendingAppointments: pending.length,
  };
}

export async function getAdminServicesData() {
  await requireAdmin();
  const db = getDb();
  if (!db) return { categories: [], services: [] };

  const categories = await db.select().from(serviceCategories).orderBy(asc(serviceCategories.sortOrder));
  const allServices = await db.select().from(services).orderBy(asc(services.sortOrder));

  return { categories, services: allServices };
}

export async function getAdminSiteConfig() {
  await requireAdmin();
  const db = getDb();
  if (!db) return null;

  const rows = await db.select().from(siteConfig).where(eq(siteConfig.id, 1)).limit(1);
  return rows[0] ?? null;
}

export async function getAdminBookingData() {
  await requireAdmin();
  const db = getDb();
  if (!db) return { rules: [], highlights: [], bookingQuote: "" };

  const rules = await db.select().from(bookingRules).orderBy(asc(bookingRules.sortOrder));
  const highlights = await db.select().from(bookingHighlights).orderBy(asc(bookingHighlights.sortOrder));
  const config = await db.select().from(siteConfig).where(eq(siteConfig.id, 1)).limit(1);

  return {
    rules,
    highlights,
    bookingQuote: config[0]?.bookingQuote ?? "",
  };
}

export async function getAdminHomeData() {
  await requireAdmin();
  const db = getDb();
  if (!db) return { config: buildDefaultSiteConfig(), features: [] };

  const config = await getSiteConfigRow();
  const features = await db.select().from(aboutFeatures).orderBy(asc(aboutFeatures.sortOrder));

  return {
    config: config ?? buildDefaultSiteConfig(),
    features,
  };
}

export async function getAdminAvailabilityData() {
  await requireAdmin();
  const [settings, weekly, blocked] = await Promise.all([
    fetchBookingSettings(),
    fetchWeeklyAvailability(),
    fetchBlockedDateList(),
  ]);
  return { settings, weekly, blocked };
}

export async function saveBookingSettingsAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  await db
    .insert(bookingSettings)
    .values({
      id: 1,
      slotDurationMinutes: Number(formData.get("slotDurationMinutes") ?? 60),
      bookingHorizonDays: Number(formData.get("bookingHorizonDays") ?? 28),
      minNoticeHours: Number(formData.get("minNoticeHours") ?? 12),
    })
    .onConflictDoUpdate({
      target: bookingSettings.id,
      set: {
        slotDurationMinutes: Number(formData.get("slotDurationMinutes") ?? 60),
        bookingHorizonDays: Number(formData.get("bookingHorizonDays") ?? 28),
        minNoticeHours: Number(formData.get("minNoticeHours") ?? 12),
      },
    });

  revalidateAll();
  redirectSaved(formData, "/admin/disponibilites");
}

export async function saveWeeklyAvailabilityAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  for (let day = 1; day <= 7; day++) {
    await db
      .insert(weeklyAvailability)
      .values({
        dayOfWeek: day,
        enabled: formData.get(`enabled_${day}`) === "on",
        startTime: String(formData.get(`start_${day}`) ?? "09:00"),
        endTime: String(formData.get(`end_${day}`) ?? "18:00"),
      })
      .onConflictDoUpdate({
        target: weeklyAvailability.dayOfWeek,
        set: {
          enabled: formData.get(`enabled_${day}`) === "on",
          startTime: String(formData.get(`start_${day}`) ?? "09:00"),
          endTime: String(formData.get(`end_${day}`) ?? "18:00"),
        },
      });
  }

  revalidateAll();
  redirectSaved(formData, "/admin/disponibilites");
}

export async function addBlockedDateAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const date = String(formData.get("date") ?? "").trim();
  if (!date) return;

  await db
    .insert(blockedDates)
    .values({
      date,
      label: String(formData.get("label") ?? "").trim() || null,
    })
    .onConflictDoNothing();

  revalidateAll();
  redirectSaved(formData, "/admin/disponibilites");
}

export async function deleteBlockedDateAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  if (!db) return;

  const date = String(formData.get("date") ?? "");
  if (date) await db.delete(blockedDates).where(eq(blockedDates.date, date));

  revalidateAll();
  redirectSaved(formData, "/admin/disponibilites");
}
