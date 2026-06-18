# Lary Beauty Home

Site vitrine + backoffice pour **Lary Beauty Home** (institut de beauté, La Rivière Saint Louis).

Stack : **Next.js 16** (App Router), **React 19**, **PostgreSQL**, **Drizzle ORM**, **Tailwind CSS 4**.

---

## Démarrage rapide

```bash
cp env.example .env.local
npm install --registry https://registry.npmjs.org
npm run docker:up          # PostgreSQL (port 5433)
npm run db:seed            # tables + données initiales
npm run dev                  # http://localhost:3000
```

**Admin local** : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Identifiants par défaut (seed) : `admin@larybeauty.local` / `changeme`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  FRONT OFFICE (public)                                      │
│  /  → sections dynamiques (BDD + fallback statique)         │
│  /rdv/suivi/[token]  → suivi rendez-vous cliente            │
│  Formulaire contact  → réservation sur créneau disponible   │
└───────────────────────────┬─────────────────────────────────┘
                            │ Server Actions + site-data.ts
┌───────────────────────────▼─────────────────────────────────┐
│  PostgreSQL                                                 │
│  site_config, services, booking_*, weekly_availability,     │
│  contact_messages (rendez-vous), …                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  BACK OFFICE (/admin)                                       │
│  Auth JWT (jose) · CRUD contenu · gestion RDV · dispos      │
└─────────────────────────────────────────────────────────────┘
                            │ SMTP IONOS (optionnel)
                            ▼
                      Emails clientes + propriétaire
```

### Couche données

- **`src/lib/site-data.ts`** : lecture BDD pour le site public. Si PostgreSQL est indisponible, **fallback** sur `src/data/*.ts`.
- **`src/app/admin/actions.ts`** : server actions admin (CRUD, auth, rendez-vous).
- **`src/app/contact/actions.ts`** : soumission formulaire + chargement des créneaux.

---

## Backoffice (`/admin`)

| Route | Rôle |
|-------|------|
| `/admin` | Tableau de bord |
| `/admin/home` | Bannière + section À propos + points forts |
| `/admin/disponibilites` | Horaires hebdo, jours fermés, durée des créneaux |
| `/admin/messages` | **Rendez-vous** : statut, confirmation, notes |
| `/admin/services` | Catégories et prestations |
| `/admin/contact` | Coordonnées et réseaux sociaux |
| `/admin/booking` | Règles et citation de la section réservation |

### Auth

- Middleware : `src/middleware.ts` protège `/admin/*` sauf `/admin/login`.
- Session JWT : `src/lib/auth.ts` (`AUTH_SECRET` requis).
- Les server actions appellent `requireAdmin()` avant toute mutation.

### Sauvegarde partielle de `site_config`

`mergeSiteConfig()` fusionne les champs modifiés sans écraser le reste (ex. sauvegarder le contact ne reset pas le hero).

---

## Front office

### Contenu dynamique

La page d’accueil (`src/app/page.tsx`) charge tout via `getPublicSiteData()` :

| Section | Source BDD |
|---------|------------|
| Hero | `site_config` (hero_*) |
| À propos | `site_config` + `about_features` |
| Prestations | `service_categories` + `services` |
| Réservation | `booking_rules`, `booking_highlights`, `site_config.booking_quote` |
| Contact | `site_config` + formulaire |

### Parcours de réservation (formulaire)

Étapes dans `src/hooks/useContactForm.ts` :

1. **Prestation** (catégorie)
2. **Détail** (prestation ; saut si « Autre »)
3. **Créneau** — `SlotPicker` charge les créneaux via `fetchAvailableSlotsAction`
4. **Coordonnées** — nom, téléphone, email → envoi

Fichiers clés :

- `src/components/sections/ContactForm.tsx`
- `src/components/booking/SlotPicker.tsx`
- `src/lib/contact-form.ts` (validation)
- `src/lib/availability.ts` (génération des créneaux, fuseau `Indian/Reunion`)

### Suivi rendez-vous (cliente)

- URL : `/rdv/suivi/[trackingToken]`
- Token généré à chaque réservation (`contact_messages.tracking_token`)
- Affiche statut, prestation, créneau, message admin

---

## Disponibilités et créneaux

### Tables

| Table | Rôle |
|-------|------|
| `booking_settings` | Durée créneau (min), horizon (jours), préavis min (heures) |
| `weekly_availability` | 7 lignes (lun–dim) : ouvert/fermé + heures |
| `blocked_dates` | Jours fermés ponctuels (congés) |
| `contact_messages` | Réservations ; `slot_start_at` bloque le créneau |

### Algorithme

`computeAvailableSlots()` dans `src/lib/availability.ts` :

1. Parcourt les jours dans l’horizon configuré
2. Applique les horaires hebdo + exclusions `blocked_dates`
3. Découpe en créneaux de `slotDurationMinutes`
4. Retire les créneaux déjà pris (`status` = `pending` ou `confirmed`)
5. Retire les créneaux avant `now + minNoticeHours`

### Admin

`src/app/admin/(panel)/disponibilites/page.tsx` + `AvailabilityPanel.tsx`  
Actions : `saveBookingSettingsAction`, `saveWeeklyAvailabilityAction`, `addBlockedDateAction`, `deleteBlockedDateAction`.

---

## Rendez-vous (`contact_messages`)

Chaque soumission du formulaire crée une ligne avec :

| Champ | Description |
|-------|-------------|
| `status` | `pending` \| `confirmed` \| `cancelled` \| `completed` |
| `slot_start_at` | Créneau réservé (UTC) |
| `preferred_date` | Libellé français affiché |
| `tracking_token` | UUID public pour `/rdv/suivi/...` |
| `confirmed_at` | Date confirmée (admin) |
| `admin_notes` | Visible par la cliente sur le suivi |

### Admin

`src/app/admin/(panel)/messages/page.tsx` + `AppointmentCard.tsx`  
Filtres par statut : `?status=pending|confirmed|...`  
Action : `updateAppointmentAction` — passage en « Confirmé » remplit `confirmed_at` depuis le créneau si vide.

### Anti double-réservation

`saveContactMessageAction` vérifie que le créneau est encore dans `fetchAvailableSlots()` et qu’aucune autre ligne `pending`/`confirmed` n’a le même `slot_start_at`.

---

## Emails (SMTP IONOS)

Module : `src/lib/mail/`

| Événement | Fonction | Destinataire |
|-----------|----------|--------------|
| Nouvelle réservation | `sendBookingReceivedEmails` | Cliente + `MAIL_OWNER` |
| RDV confirmé (admin) | `sendBookingConfirmedEmail` | Cliente |

Activation : `SMTP_USER` + `SMTP_PASS` dans `.env.local` (voir `env.example`).  
Si non configuré : pas d’envoi, le site fonctionne normalement.

Variables importantes :

```env
SITE_URL=https://www.larybeautyhome.com   # liens dans les emails
SMTP_HOST=smtp.ionos.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Note déploiement** : SMTP fonctionne sur **VPS**. Sur **Vercel**, les ports SMTP sont en général bloqués.

---

## Schéma base de données

Fichier source : `src/db/schema.ts`  
Création / migration légère : `src/db/seed.ts` (`CREATE TABLE IF NOT EXISTS` + `ALTER TABLE`).

Tables principales :

```
admin_users
service_categories → services
soins_notes
booking_rules, booking_highlights, booking_settings
weekly_availability, blocked_dates
site_config (contact, hero, about, formspree, …)
about_features
contact_messages (rendez-vous)
```

---

## Scripts npm

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` / `start` | Production |
| `npm run docker:up` | PostgreSQL Docker (port **5433**) |
| `npm run docker:down` | Arrêt Docker |
| `npm run db:seed` | Tables + données initiales + admin |
| `npm run db:studio` | Drizzle Studio |

---

## Arborescence utile

```
src/
├── app/
│   ├── page.tsx                    # Accueil public
│   ├── contact/actions.ts          # Formulaire + créneaux
│   ├── rdv/suivi/[token]/          # Suivi cliente
│   └── admin/
│       ├── actions.ts              # Toutes les server actions admin
│       └── (panel)/                # Pages backoffice
├── components/
│   ├── admin/                      # UI admin (panels, cartes RDV, …)
│   ├── booking/SlotPicker.tsx
│   └── sections/                   # Hero, About, Contact, …
├── db/schema.ts, seed.ts
├── lib/
│   ├── site-data.ts                # Lecture publique
│   ├── availability.ts             # Créneaux
│   ├── appointments.ts             # Labels statuts
│   └── mail/                       # SMTP + templates
├── data/                           # Fallbacks statiques
└── middleware.ts                   # Protection /admin
```

---

## Conventions de code

- **TypeScript** : `const` / `let` (pas de `var`).
- **Server Actions** : fichiers avec `"use server"` ; pas d’import BDD côté client.
- **Icônes admin → client** : sérialisées en string (`SerializedServiceCategory`) + `resolveIcon()`.
- **Next.js 16** : consulter `node_modules/next/dist/docs/` en cas de doute API.

---

## Déploiement (rappel)

| Composant | Option recommandée |
|-----------|-------------------|
| Site + Postgres | VPS (Docker Compose) |
| Site seul | Vercel + Neon (Postgres gratuit) |
| Domaine | IONOS `.com` |
| Email SMTP | Boîte IONOS sur VPS |

Après déploiement : mettre à jour `SITE_URL`, `DATABASE_URL`, `AUTH_SECRET`, secrets SMTP, puis `npm run db:seed` une fois.

---

## Dépannage

| Problème | Piste |
|----------|-------|
| Admin inaccessible | `docker:up` + `db:seed` ; vérifier `DATABASE_URL` (port 5433 en local) |
| Aucun créneau affiché | `/admin/disponibilites` : jours ouverts, horizon, pas tout bloqué |
| Email non reçu | Vérifier SMTP dans `.env` ; logs serveur `[mail] Envoi impossible` |
| Créneau « déjà pris » | Normal si double clic ; autre réservation sur le même slot |
| Données statiques affichées | BDD down → fallback `src/data/*` (comportement voulu) |

---

## Contact projet

Données métier par défaut : `src/data/`  
Config site en BDD : table `site_config` (id = 1).
