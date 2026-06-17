import Link from "next/link";
import { CalendarDays, Home, Mail, Scissors, Phone } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminDashboardData } from "@/app/admin/actions";
import { isDbAvailable } from "@/db";

const shortcuts = [
  {
    href: "/admin/disponibilites",
    label: "Disponibilités",
    description: "Horaires et créneaux ouverts",
    icon: CalendarDays,
    accent: "bg-anthracite",
  },
  {
    href: "/admin/messages",
    label: "Rendez-vous",
    description: "Demandes et confirmations",
    icon: Mail,
    accent: "bg-rose-sombre",
  },
  {
    href: "/admin/home",
    label: "Page d'accueil",
    description: "Bannière et présentation",
    icon: Home,
    accent: "bg-rose-moyen",
  },
  {
    href: "/admin/services",
    label: "Tarifs",
    description: "Modifier vos prestations",
    icon: Scissors,
    accent: "bg-or",
  },
  {
    href: "/admin/contact",
    label: "Contact",
    description: "Téléphone, email, réseaux",
    icon: Phone,
    accent: "bg-anthracite",
  },
  {
    href: "/admin/booking",
    label: "Réservation",
    description: "Règles et informations",
    icon: CalendarDays,
    accent: "bg-rose-sombre",
  },
];

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  const dbOk = await isDbAvailable();

  return (
    <>
      <AdminPageHeader
        title="Bonjour !"
        description="Gérez votre site Lary Beauty Home en quelques clics. Choisissez une section ci-dessous."
      />

      {!dbOk && (
        <div className="mb-6 rounded-2xl border border-amber-400/50 bg-amber-50 p-4 text-sm text-amber-900">
          La base de données est arrêtée. Lancez <strong>npm run docker:up</strong> puis{" "}
          <strong>npm run db:seed</strong>.
        </div>
      )}

      {data.pendingAppointments > 0 && (
        <Link
          href="/admin/messages?status=pending"
          className="mb-6 flex items-center justify-between rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-amber-950 transition-transform hover:-translate-y-0.5 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
        >
          <span className="font-medium">
            {data.pendingAppointments} rendez-vous en attente de confirmation
          </span>
          <span className="text-sm underline">Gérer →</span>
        </Link>
      )}

      {data.unreadMessages > 0 && (
        <Link
          href="/admin/messages"
          className="mb-6 flex items-center justify-between rounded-2xl bg-or px-5 py-4 text-white shadow-md transition-transform hover:-translate-y-0.5"
        >
          <span className="font-medium">
            {data.unreadMessages} nouveau{data.unreadMessages > 1 ? "x" : ""} message
            {data.unreadMessages > 1 ? "s" : ""} à lire
          </span>
          <span className="text-sm underline">Voir →</span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {shortcuts.map(function (item) {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 rounded-2xl border border-or/15 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-[#2a1a1d]"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${item.accent}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-display text-xl text-anthracite group-hover:text-or dark:text-rose-pale">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm text-texte/60 dark:text-rose-pale/50">
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-texte/50 dark:text-rose-pale/40">
        {data.serviceCount} prestations en ligne · Base {dbOk ? "connectée" : "hors ligne"}
      </p>
    </>
  );
}
