import { notFound } from "next/navigation";
import { Calendar, Clock, Sparkles } from "lucide-react";
import { AppointmentStatusBadge } from "@/components/appointments/AppointmentStatusBadge";
import { Button } from "@/components/lb/button";
import {
  appointmentStatusDescriptions,
  formatAppointmentDate,
} from "@/lib/appointments";
import { fetchAppointmentByToken } from "@/lib/site-data";

export default async function AppointmentTrackingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const appointment = await fetchAppointmentByToken(token);

  if (!appointment) notFound();

  const confirmedLabel = formatAppointmentDate(appointment.confirmedAt);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-pale/40 to-white px-4 py-16 dark:from-[#1c1416] dark:to-[#141012]">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-or" />
          <h1 className="mt-4 font-display text-3xl text-anthracite dark:text-rose-pale">
            Suivi de votre rendez-vous
          </h1>
          <p className="mt-2 text-sm text-texte/70 dark:text-rose-pale/60">
            Bonjour {appointment.name}, voici l&apos;état de votre demande.
          </p>
        </div>

        <div className="rounded-3xl border border-or/20 bg-white/90 p-6 shadow-[const(--ombre-carte)] backdrop-blur dark:bg-[#2a1a1d]/90">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-xl text-anthracite dark:text-rose-pale">Votre demande</p>
            <AppointmentStatusBadge status={appointment.status} />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-texte/80 dark:text-rose-pale/75">
            {appointmentStatusDescriptions[appointment.status]}
          </p>

          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex gap-3 rounded-2xl bg-or/5 p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-or" />
              <div>
                <dt className="font-medium text-or">Prestation</dt>
                <dd className="text-texte dark:text-rose-pale/85">
                  {appointment.serviceLabel || appointment.categoryId}
                </dd>
              </div>
            </div>

            {appointment.preferredDate && (
              <div className="flex gap-3 rounded-2xl bg-or/5 p-4">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-or" />
                <div>
                  <dt className="font-medium text-or">Créneau réservé</dt>
                  <dd className="text-texte dark:text-rose-pale/85">{appointment.preferredDate}</dd>
                </div>
              </div>
            )}

            {confirmedLabel && (
              <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
                <div>
                  <dt className="font-medium text-emerald-800 dark:text-emerald-200">Rendez-vous confirmé</dt>
                  <dd className="text-emerald-900 dark:text-emerald-100">{confirmedLabel}</dd>
                </div>
              </div>
            )}

            {appointment.adminNotes && (
              <div className="rounded-2xl border border-or/20 bg-rose-pale/40 p-4 dark:bg-black/20">
                <dt className="font-medium text-or">Message de Lary Beauty Home</dt>
                <dd className="mt-1 whitespace-pre-wrap text-texte dark:text-rose-pale/85">
                  {appointment.adminNotes}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-8 text-center">
          <Button href="/#rdv" variant="outline">
            Retour au site
          </Button>
        </div>
      </div>
    </div>
  );
}
