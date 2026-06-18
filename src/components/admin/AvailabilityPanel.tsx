"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  addBlockedDateAction,
  deleteBlockedDateAction,
  saveBookingSettingsAction,
  saveWeeklyAvailabilityAction,
} from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import type { BookingSettingsData, WeeklyDayConfig } from "@/types";

type Blocked = { date: string; label: string | null };

const inputClass =
  "w-full rounded-xl border border-or/20 bg-white px-3 py-2.5 text-sm text-texte outline-none focus:border-or dark:bg-[#2a1a1d] dark:text-rose-pale";

export function AvailabilityPanel({
  settings,
  weekly,
  blocked,
}: {
  settings: BookingSettingsData;
  weekly: WeeklyDayConfig[];
  blocked: Blocked[];
}) {
  const [showBlock, setShowBlock] = useState(false);

  return (
    <div className="space-y-8">
      <AdminCard title="Paramètres des créneaux">
        <form action={saveBookingSettingsAction} className="grid gap-4 sm:grid-cols-3">
          <input type="hidden" name="returnPath" value="/admin/disponibilites" />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-texte dark:text-rose-pale">Durée d&apos;un créneau (min)</span>
            <input
              type="number"
              name="slotDurationMinutes"
              min={15}
              step={15}
              defaultValue={settings.slotDurationMinutes}
              className={inputClass}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-texte dark:text-rose-pale">Réservation jusqu&apos;à (jours)</span>
            <input
              type="number"
              name="bookingHorizonDays"
              min={7}
              max={90}
              defaultValue={settings.bookingHorizonDays}
              className={inputClass}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-texte dark:text-rose-pale">Délai minimum (heures)</span>
            <input
              type="number"
              name="minNoticeHours"
              min={0}
              defaultValue={settings.minNoticeHours}
              className={inputClass}
            />
          </label>
          <div className="sm:col-span-3">
            <AdminSubmitButton label="Enregistrer les paramètres" />
          </div>
        </form>
      </AdminCard>

      <AdminCard title="Horaires hebdomadaires">
        <form action={saveWeeklyAvailabilityAction} className="space-y-3">
          <input type="hidden" name="returnPath" value="/admin/disponibilites" />
          {weekly.map((day) => (
            <div
              key={day.dayOfWeek}
              className="grid gap-3 rounded-xl border border-or/10 bg-or/5 p-3 sm:grid-cols-[1fr_auto_auto_auto]"
            >
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name={`enabled_${day.dayOfWeek}`}
                  defaultChecked={day.enabled}
                  className="h-4 w-4 rounded border-or/30 text-or"
                />
                <span className="font-medium text-texte dark:text-rose-pale">{day.label}</span>
              </label>
              <label className="space-y-1">
                <span className="text-xs text-texte/60 dark:text-rose-pale/50">Ouverture</span>
                <input
                  type="time"
                  name={`start_${day.dayOfWeek}`}
                  defaultValue={day.startTime}
                  className={inputClass}
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-texte/60 dark:text-rose-pale/50">Fermeture</span>
                <input
                  type="time"
                  name={`end_${day.dayOfWeek}`}
                  defaultValue={day.endTime}
                  className={inputClass}
                />
              </label>
            </div>
          ))}
          <AdminSubmitButton label="Enregistrer les horaires" />
        </form>
      </AdminCard>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl text-anthracite dark:text-rose-pale">Jours fermés</h2>
            <p className="text-sm text-texte/60 dark:text-rose-pale/50">Congés, jours fériés ou indisponibilités</p>
          </div>
          <button
            type="button"
            onClick={() => setShowBlock(!showBlock)}
            className="flex items-center gap-2 rounded-xl bg-or px-4 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        {showBlock && (
          <AdminCard title="Bloquer une date">
            <form action={addBlockedDateAction} className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="returnPath" value="/admin/disponibilites" />
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-texte dark:text-rose-pale">Date</span>
                <input type="date" name="date" required className={inputClass} />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-texte dark:text-rose-pale">Motif (optionnel)</span>
                <input type="text" name="label" placeholder="Ex. Congés" className={inputClass} />
              </label>
              <div className="sm:col-span-2">
                <AdminSubmitButton label="Bloquer cette date" />
              </div>
            </form>
          </AdminCard>
        )}

        {blocked.length === 0 ? (
          <p className="text-sm text-texte/60 dark:text-rose-pale/50">Aucun jour bloqué.</p>
        ) : (
          <ul className="space-y-2">
            {blocked.map((item) => (
              <li
                key={item.date}
                className="flex items-center justify-between gap-3 rounded-xl border border-or/15 bg-white px-4 py-3 dark:bg-[#2a1a1d]"
              >
                <div>
                  <p className="font-medium text-texte dark:text-rose-pale">
                    {new Date(item.date + "T12:00:00").toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {item.label && (
                    <p className="text-sm text-texte/60 dark:text-rose-pale/50">{item.label}</p>
                  )}
                </div>
                <form action={deleteBlockedDateAction}>
                  <input type="hidden" name="date" value={item.date} />
                  <input type="hidden" name="returnPath" value="/admin/disponibilites" />
                  <button
                    type="submit"
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
