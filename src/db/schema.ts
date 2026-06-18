import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const adminUsers = pgTable("admin_users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const serviceCategories = pgTable("service_categories", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 64 }).notNull().default("Gem"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const services = pgTable("services", {
  id: varchar("id", { length: 64 }).primaryKey(),
  categoryId: varchar("category_id", { length: 64 })
    .notNull()
    .references(() => serviceCategories.id, { onDelete: "cascade" }),
  groupName: varchar("group_name", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: varchar("price", { length: 32 }).notNull(),
  priceUnit: varchar("price_unit", { length: 32 }),
  duration: varchar("duration", { length: 64 }),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const soinsNotes = pgTable("soins_notes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const bookingRules = pgTable("booking_rules", {
  id: varchar("id", { length: 64 }).primaryKey(),
  icon: varchar("icon", { length: 64 }).notNull().default("Info"),
  text: text("text").notNull(),
  highlight: text("highlight"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const bookingHighlights = pgTable("booking_highlights", {
  id: varchar("id", { length: 36 }).primaryKey(),
  text: varchar("text", { length: 255 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const bookingSettings = pgTable("booking_settings", {
  id: integer("id").primaryKey().default(1),
  slotDurationMinutes: integer("slot_duration_minutes").notNull().default(60),
  bookingHorizonDays: integer("booking_horizon_days").notNull().default(28),
  minNoticeHours: integer("min_notice_hours").notNull().default(12),
});

export const weeklyAvailability = pgTable("weekly_availability", {
  dayOfWeek: integer("day_of_week").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  startTime: varchar("start_time", { length: 5 }).notNull().default("09:00"),
  endTime: varchar("end_time", { length: 5 }).notNull().default("18:00"),
});

export const blockedDates = pgTable("blocked_dates", {
  date: varchar("date", { length: 10 }).primaryKey(),
  label: varchar("label", { length: 255 }),
});

export const siteConfig = pgTable("site_config", {
  id: integer("id").primaryKey().default(1),
  phone: varchar("phone", { length: 64 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  instagram: varchar("instagram", { length: 255 }).notNull(),
  facebook: varchar("facebook", { length: 255 }).notNull(),
  tiktok: varchar("tiktok", { length: 255 }).notNull(),
  instagramUrl: text("instagram_url").notNull(),
  instagramDmUrl: text("instagram_dm_url").notNull(),
  facebookUrl: text("facebook_url").notNull(),
  tiktokUrl: text("tiktok_url").notNull(),
  formspreeFormId: varchar("formspree_form_id", { length: 128 }),
  bookingQuote: text("booking_quote").notNull(),
  heroEyebrow: varchar("hero_eyebrow", { length: 255 }).notNull().default("Institut de Beauté"),
  heroTitle: varchar("hero_title", { length: 255 }).notNull().default("LARY BEAUTY HOME"),
  heroSubtitle: varchar("hero_subtitle", { length: 255 }).notNull().default("L'art de la beauté à domicile"),
  heroPromoBadge: varchar("hero_promo_badge", { length: 255 }),
  heroCtaLabel: varchar("hero_cta_label", { length: 128 }).notNull().default("Prendre Rendez-vous →"),
  heroCtaHref: varchar("hero_cta_href", { length: 128 }).notNull().default("#rdv"),
  aboutEyebrow: varchar("about_eyebrow", { length: 128 }).notNull().default("Bienvenue"),
  aboutTitle: varchar("about_title", { length: 255 }).notNull().default("Un cocon dédié à votre beauté"),
  aboutIntro: text("about_intro").notNull().default(""),
});

export const aboutFeatures = pgTable("about_features", {
  id: varchar("id", { length: 36 }).primaryKey(),
  icon: varchar("icon", { length: 64 }).notNull().default("Home"),
  title: varchar("title", { length: 255 }).notNull(),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 64 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  categoryId: varchar("category_id", { length: 64 }).notNull(),
  serviceId: varchar("service_id", { length: 64 }),
  serviceLabel: varchar("service_label", { length: 255 }),
  preferredDate: varchar("preferred_date", { length: 255 }),
  slotStartAt: timestamp("slot_start_at", { withTimezone: true }),
  message: text("message"),
  read: boolean("read").notNull().default(false),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  adminNotes: text("admin_notes"),
  trackingToken: varchar("tracking_token", { length: 36 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
