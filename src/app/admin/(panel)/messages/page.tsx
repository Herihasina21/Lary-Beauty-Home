import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AppointmentCard } from "@/components/admin/AppointmentCard";
import { appointmentStatusLabels } from "@/lib/appointments";
import { fetchContactMessages } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const filters: { value: string; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "pending", label: appointmentStatusLabels.pending },
  { value: "confirmed", label: appointmentStatusLabels.confirmed },
  { value: "cancelled", label: appointmentStatusLabels.cancelled },
  { value: "completed", label: appointmentStatusLabels.completed },
];

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const filter = params.status ?? "all";
  const messages = await fetchContactMessages(filter);
  const unread = messages.filter(function (m) {
    return !m.read;
  });
  const pending = messages.filter(function (m) {
    return m.status === "pending";
  });

  return (
    <>
      <AdminPageHeader
        title="Rendez-vous"
        description={
          messages.length === 0
            ? "Les demandes envoyées via le formulaire du site apparaîtront ici."
            : `${pending.length} en attente · ${unread.length} non lu${unread.length > 1 ? "s" : ""} sur ${messages.length}`
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map(function (item) {
          const active = filter === item.value;
          return (
            <Link
              key={item.value}
              href={item.value === "all" ? "/admin/messages" : `/admin/messages?status=${item.value}`}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-or text-white"
                  : "border border-or/20 bg-white text-texte hover:bg-or/10 dark:bg-[#2a1a1d] dark:text-rose-pale/80",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {messages.length === 0 && (
        <div className="rounded-2xl border border-dashed border-or/30 bg-white p-12 text-center dark:bg-[#2a1a1d]">
          <CalendarDays className="mx-auto h-10 w-10 text-or/40" />
          <p className="mt-4 text-sm text-texte/60 dark:text-rose-pale/50">
            Aucun rendez-vous pour ce filtre.
          </p>
        </div>
      )}

      <ul className="space-y-4">
        {messages.map(function (msg) {
          return <AppointmentCard key={msg.id} appointment={msg} />;
        })}
      </ul>
    </>
  );
}
