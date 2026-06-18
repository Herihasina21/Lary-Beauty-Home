import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { bookingHighlights, bookingQuote, bookingRules } from "@/data/booking";
import { contactInfo, FORMSPREE_FORM_ID } from "@/data/contact";
import { defaultAbout, defaultAboutFeatures, defaultHero } from "@/data/home";
import { defaultBookingSettings, defaultWeeklyAvailability } from "@/data/availability";
import { servicesData, soinsNotes } from "@/data/services";
import * as schema from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { newId } from "@/lib/id";
import { iconNameFromComponent } from "@/lib/icons";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL manquant. Copiez env.example vers .env.local");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool, { schema });

  console.log("→ Création des tables…");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id varchar(36) PRIMARY KEY,
      email varchar(255) NOT NULL UNIQUE,
      password_hash text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS service_categories (
      id varchar(64) PRIMARY KEY,
      title varchar(255) NOT NULL,
      icon varchar(64) NOT NULL DEFAULT 'Gem',
      sort_order integer NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS services (
      id varchar(64) PRIMARY KEY,
      category_id varchar(64) NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
      group_name varchar(255) NOT NULL,
      name varchar(255) NOT NULL,
      price varchar(32) NOT NULL,
      price_unit varchar(32),
      duration varchar(64),
      description text,
      sort_order integer NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS soins_notes (
      id varchar(36) PRIMARY KEY,
      text text NOT NULL,
      sort_order integer NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS booking_rules (
      id varchar(64) PRIMARY KEY,
      icon varchar(64) NOT NULL DEFAULT 'Info',
      text text NOT NULL,
      highlight text,
      sort_order integer NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS booking_highlights (
      id varchar(36) PRIMARY KEY,
      text varchar(255) NOT NULL,
      sort_order integer NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS site_config (
      id integer PRIMARY KEY DEFAULT 1,
      phone varchar(64) NOT NULL,
      email varchar(255) NOT NULL,
      address varchar(255) NOT NULL,
      instagram varchar(255) NOT NULL,
      facebook varchar(255) NOT NULL,
      tiktok varchar(255) NOT NULL,
      instagram_url text NOT NULL,
      instagram_dm_url text NOT NULL,
      facebook_url text NOT NULL,
      tiktok_url text NOT NULL,
      formspree_form_id varchar(128),
      booking_quote text NOT NULL,
      hero_eyebrow varchar(255) NOT NULL DEFAULT 'Institut de Beauté',
      hero_title varchar(255) NOT NULL DEFAULT 'LARY BEAUTY HOME',
      hero_subtitle varchar(255) NOT NULL DEFAULT 'L''art de la beauté à domicile',
      hero_promo_badge varchar(255),
      hero_cta_label varchar(128) NOT NULL DEFAULT 'Prendre Rendez-vous →',
      hero_cta_href varchar(128) NOT NULL DEFAULT '#rdv',
      about_eyebrow varchar(128) NOT NULL DEFAULT 'Bienvenue',
      about_title varchar(255) NOT NULL DEFAULT 'Un cocon dédié à votre beauté',
      about_intro text NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS about_features (
      id varchar(36) PRIMARY KEY,
      icon varchar(64) NOT NULL DEFAULT 'Home',
      title varchar(255) NOT NULL,
      text text NOT NULL,
      sort_order integer NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS contact_messages (
      id varchar(36) PRIMARY KEY,
      name varchar(255) NOT NULL,
      phone varchar(64) NOT NULL,
      email varchar(255) NOT NULL,
      category_id varchar(64) NOT NULL,
      service_id varchar(64),
      service_label varchar(255),
      preferred_date varchar(255),
      slot_start_at timestamptz,
      message text,
      read boolean NOT NULL DEFAULT false,
      status varchar(32) NOT NULL DEFAULT 'pending',
      confirmed_at timestamptz,
      admin_notes text,
      tracking_token varchar(36) NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_eyebrow varchar(255) NOT NULL DEFAULT 'Institut de Beauté';
    ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_title varchar(255) NOT NULL DEFAULT 'LARY BEAUTY HOME';
    ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_subtitle varchar(255) NOT NULL DEFAULT 'L''art de la beauté à domicile';
    ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_promo_badge varchar(255);
    ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_cta_label varchar(128) NOT NULL DEFAULT 'Prendre Rendez-vous →';
    ALTER TABLE site_config ADD COLUMN IF NOT EXISTS hero_cta_href varchar(128) NOT NULL DEFAULT '#rdv';
    ALTER TABLE site_config ADD COLUMN IF NOT EXISTS about_eyebrow varchar(128) NOT NULL DEFAULT 'Bienvenue';
    ALTER TABLE site_config ADD COLUMN IF NOT EXISTS about_title varchar(255) NOT NULL DEFAULT 'Un cocon dédié à votre beauté';
    ALTER TABLE site_config ADD COLUMN IF NOT EXISTS about_intro text NOT NULL DEFAULT '';
    CREATE TABLE IF NOT EXISTS about_features (
      id varchar(36) PRIMARY KEY,
      icon varchar(64) NOT NULL DEFAULT 'Home',
      title varchar(255) NOT NULL,
      text text NOT NULL,
      sort_order integer NOT NULL DEFAULT 0
    );
    ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status varchar(32) NOT NULL DEFAULT 'pending';
    ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;
    ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS admin_notes text;
    ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS tracking_token varchar(36);
    CREATE UNIQUE INDEX IF NOT EXISTS contact_messages_tracking_token_key ON contact_messages(tracking_token);
    CREATE TABLE IF NOT EXISTS booking_settings (
      id integer PRIMARY KEY DEFAULT 1,
      slot_duration_minutes integer NOT NULL DEFAULT 60,
      booking_horizon_days integer NOT NULL DEFAULT 28,
      min_notice_hours integer NOT NULL DEFAULT 12
    );
    CREATE TABLE IF NOT EXISTS weekly_availability (
      day_of_week integer PRIMARY KEY,
      enabled boolean NOT NULL DEFAULT false,
      start_time varchar(5) NOT NULL DEFAULT '09:00',
      end_time varchar(5) NOT NULL DEFAULT '18:00'
    );
    CREATE TABLE IF NOT EXISTS blocked_dates (
      date varchar(10) PRIMARY KEY,
      label varchar(255)
    );
    ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS slot_start_at timestamptz;
    ALTER TABLE contact_messages ALTER COLUMN preferred_date TYPE varchar(255);
  `);

  const rowsWithoutToken = await pool.query(
    "SELECT id FROM contact_messages WHERE tracking_token IS NULL OR tracking_token = ''",
  );
  for (let ti = 0; ti < rowsWithoutToken.rows.length; ti++) {
    await pool.query("UPDATE contact_messages SET tracking_token = $1 WHERE id = $2", [
      newId(),
      rowsWithoutToken.rows[ti].id,
    ]);
  }

  const existingAdmin = await db.select().from(schema.adminUsers).limit(1);
  if (existingAdmin.length === 0) {
    const email = process.env.ADMIN_EMAIL ?? "admin@larybeauty.local";
    const password = process.env.ADMIN_PASSWORD ?? "changeme";
    await db.insert(schema.adminUsers).values({
      id: newId(),
      email,
      passwordHash: await hashPassword(password),
    });
    console.log(`→ Admin créé : ${email}`);
  }

  const existingCats = await db.select().from(schema.serviceCategories).limit(1);
  if (existingCats.length === 0) {
    for (let ci = 0; ci < servicesData.length; ci++) {
      const cat = servicesData[ci];
      await db.insert(schema.serviceCategories).values({
        id: cat.id,
        title: cat.title,
        icon: iconNameFromComponent(cat.icon),
        sortOrder: ci,
      });

      for (let si = 0; si < cat.services.length; si++) {
        const svc = cat.services[si];
        await db.insert(schema.services).values({
          id: svc.id,
          categoryId: cat.id,
          groupName: svc.category,
          name: svc.name,
          price: String(svc.price),
          priceUnit: svc.unit ?? null,
          duration: svc.duration ?? null,
          description: svc.description ?? null,
          sortOrder: si,
        });
      }
    }
    console.log("→ Prestations importées");
  }

  const existingNotes = await db.select().from(schema.soinsNotes).limit(1);
  if (existingNotes.length === 0) {
    for (let ni = 0; ni < soinsNotes.length; ni++) {
      await db.insert(schema.soinsNotes).values({
        id: newId(),
        text: soinsNotes[ni],
        sortOrder: ni,
      });
    }
  }

  const existingRules = await db.select().from(schema.bookingRules).limit(1);
  if (existingRules.length === 0) {
    for (let ri = 0; ri < bookingRules.length; ri++) {
      const rule = bookingRules[ri];
      await db.insert(schema.bookingRules).values({
        id: rule.id,
        icon: iconNameFromComponent(rule.icon),
        text: rule.text,
        highlight: rule.highlight ?? null,
        sortOrder: ri,
      });
    }
  }

  const existingHighlights = await db.select().from(schema.bookingHighlights).limit(1);
  if (existingHighlights.length === 0) {
    for (let hi = 0; hi < bookingHighlights.length; hi++) {
      await db.insert(schema.bookingHighlights).values({
        id: newId(),
        text: bookingHighlights[hi],
        sortOrder: hi,
      });
    }
  }

  const existingConfig = await db.select().from(schema.siteConfig).where(eq(schema.siteConfig.id, 1)).limit(1);
  if (existingConfig.length === 0) {
    await db.insert(schema.siteConfig).values({
      id: 1,
      phone: contactInfo.phone,
      email: contactInfo.email,
      address: contactInfo.address,
      instagram: contactInfo.instagram,
      facebook: contactInfo.facebook,
      tiktok: contactInfo.tiktok,
      instagramUrl: contactInfo.instagramUrl,
      instagramDmUrl: contactInfo.instagramDmUrl,
      facebookUrl: contactInfo.facebookUrl,
      tiktokUrl: contactInfo.tiktokUrl,
      formspreeFormId: FORMSPREE_FORM_ID === "XXXX" ? null : FORMSPREE_FORM_ID,
      bookingQuote,
      heroEyebrow: defaultHero.eyebrow,
      heroTitle: defaultHero.title,
      heroSubtitle: defaultHero.subtitle,
      heroPromoBadge: defaultHero.promoBadge,
      heroCtaLabel: defaultHero.ctaLabel,
      heroCtaHref: defaultHero.ctaHref,
      aboutEyebrow: defaultAbout.eyebrow,
      aboutTitle: defaultAbout.title,
      aboutIntro: defaultAbout.intro,
    });
    console.log("→ Configuration site importée");
  }

  const existingFeatures = await db.select().from(schema.aboutFeatures).limit(1);
  if (existingFeatures.length === 0) {
    for (let fi = 0; fi < defaultAboutFeatures.length; fi++) {
      const feat = defaultAboutFeatures[fi];
      await db.insert(schema.aboutFeatures).values({
        id: newId(),
        icon: feat.icon,
        title: feat.title,
        text: feat.text,
        sortOrder: fi,
      });
    }
    console.log("→ Section à propos importée");
  }

  const existingSettings = await db.select().from(schema.bookingSettings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(schema.bookingSettings).values({ id: 1, ...defaultBookingSettings });
    console.log("→ Paramètres de réservation importés");
  }

  const existingWeekly = await db.select().from(schema.weeklyAvailability).limit(1);
  if (existingWeekly.length === 0) {
    for (const day of defaultWeeklyAvailability) {
      await db.insert(schema.weeklyAvailability).values({
        dayOfWeek: day.dayOfWeek,
        enabled: day.enabled,
        startTime: day.startTime,
        endTime: day.endTime,
      });
    }
    console.log("→ Disponibilités hebdomadaires importées");
  }

  console.log("✓ Seed terminé");
  await pool.end();
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
