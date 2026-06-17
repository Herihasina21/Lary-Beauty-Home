"use client";

import Link from "next/link";
import { ExternalLink, Mail, Phone } from "lucide-react";
import { updateAppointmentAction } from "@/app/admin/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { AppointmentStatusBadge } from "@/components/appointments/AppointmentStatusBadge";
import {
  appointmentStatuses,
  appointmentStatusLabels,
  toDatetimeLocalValue,
} from "@/lib/appointments";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types";

const inputClass =
  "w-full rounded-xl border border-or/20 bg-white px-3 py-2.5 text-sm text-texte outline-none focus:border-or dark:bg-[#2a1a1d] dark:text-rose-pale";

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <li
      className={cn(
        "overflow-hidden rounded-2xl border bg-white dark:bg-[#2a1a1d]",
        appointment.read ? "border-or/10" : "border-or/40 shadow-md ring-2 ring-or/20",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-or/10 bg-or/5 px-5 py-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-xl text-anthracite dark:text-rose-pale">{appointment.name}</p>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
          <p className="text-xs text-texte/50 dark:text-rose-pale/50">
            Demande du{" "}
            {new Date(appointment.createdAt).toLocaleString("fr-FR", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>
        {!appointment.read && (
          <span className="rounded-full bg-or px-3 py-1 text-xs font-medium text-white">Nouveau</span>
        )}
      </div>

      <div className="space-y-5 px-5 py-4 text-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <p>
            <span className="font-medium text-or">Prestation : </span>
            {appointment.serviceLabel || appointment.categoryId}
          </p>
          {appointment.preferredDate && (
            <p>
              <span className="font-medium text-or">Créneau : </span>
              {appointment.preferredDate}
            </p>
          )}
        </div>

        {appointment.message && (
          <p className="whitespace-pre-wrap rounded-xl bg-rose-pale/50 p-4 text-texte dark:bg-black/20 dark:text-rose-pale/80">
            {appointment.message}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Link
            href={`tel:${appointment.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-xl bg-or px-4 py-2.5 text-sm font-medium text-white"
          >
            <Phone className="h-4 w-4" />
            Appeler
          </Link>
          <Link
            href={`mailto:${appointment.email}`}
            className="inline-flex items-center gap-2 rounded-xl border border-or/30 px-4 py-2.5 text-sm font-medium text-or"
          >
            <Mail className="h-4 w-4" />
            Email
          </Link>
          <Link
            href={`/rdv/suivi/${appointment.trackingToken}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-or/30 px-4 py-2.5 text-sm font-medium text-or"
          >
            <ExternalLink className="h-4 w-4" />
            Page cliente
          </Link>
        </div>

        <form action={updateAppointmentAction} className="space-y-4 rounded-2xl border border-or/15 bg-or/5 p-4">
          <input type="hidden" name="id" value={appointment.id} />
          <input type="hidden" name="trackingToken" value={appointment.trackingToken} />
          <input type="hidden" name="returnPath" value="/admin/messages" />

          <p className="font-display text-lg text-anthracite dark:text-rose-pale">Gestion du rendez-vous</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-texte dark:text-rose-pale">Statut</span>
              <select name="status" defaultValue={appointment.status} className={inputClass}>
                {appointmentStatuses.map(function (status) {
                  return (
                    <option key={status} value={status}>
                      {appointmentStatusLabels[status]}
                    </option>
                  );
                })}
              </select>
            </label>
              <label className="block space-y-1.5">
              <span className="text-sm font-medium text-texte dark:text-rose-pale">Date confirmée</span>
              <input
                type="datetime-local"
                name="confirmedAt"
                defaultValue={toDatetimeLocalValue(appointment.confirmedAt ?? appointment.slotStartAt)}
                className={inputClass}
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-texte dark:text-rose-pale">Note interne (visible par la cliente si renseignée)</span>
            <textarea
              name="adminNotes"
              defaultValue={appointment.adminNotes ?? ""}
              rows={2}
              className={inputClass}
              placeholder="Ex. Merci de confirmer par message la veille du RDV."
            />
          </label>

          <AdminSubmitButton label="Enregistrer le rendez-vous" />
        </form>
      </div>
    </li>
  );
}
