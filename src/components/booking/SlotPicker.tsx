"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchAvailableSlotsAction } from "@/app/contact/actions";
import { FieldError } from "@/components/ui/lb-form-fields";
import { cn } from "@/lib/utils";
import type { AvailableSlot } from "@/types";

function groupByDate(slots: AvailableSlot[]) {
  const map = new Map<string, AvailableSlot[]>();
  slots.forEach((slot) => {
    const list = map.get(slot.dateKey) ?? [];
    list.push(slot);
    map.set(slot.dateKey, list);
  });
  return map;
}

function formatDayHeader(dateKey: string): string {
  const date = new Date(dateKey + "T12:00:00Z");
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Indian/Reunion",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function SlotPicker({
  value,
  onChange,
  onBlur,
  error,
}: {
  value: string;
  onChange: (startAt: string) => void;
  onBlur: () => void;
  error?: string;
}) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAvailableSlotsAction()
      .then((data) => {
        if (cancelled) return;
        setSlots(data);
        if (data.length > 0) setActiveDate(data[0].dateKey);
        setLoadError(null);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Impossible de charger les créneaux.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const byDate = useMemo(() => groupByDate(slots), [slots]);
  const dateKeys = useMemo(() => Array.from(byDate.keys()), [byDate]);
  const daySlots = activeDate ? (byDate.get(activeDate) ?? []) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-or/20 bg-or/5 py-10 text-sm text-texte/70 dark:text-rose-pale/60">
        <Loader2 className="h-5 w-5 animate-spin text-or" />
        Chargement des créneaux disponibles…
      </div>
    );
  }

  if (loadError) {
    return <FieldError message={loadError} />;
  }

  if (slots.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-or/30 bg-or/5 p-5 text-center text-sm text-texte/70 dark:text-rose-pale/60">
        Aucun créneau disponible pour le moment. Contactez-moi par Instagram ou téléphone.
      </p>
    );
  }

  return (
    <div>
      <p className="font-display italic text-rose-sombre text-sm mb-3">
        Choisissez votre créneau <span className="text-red-500">*</span>
      </p>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {dateKeys.map((dateKey) => (
          <button
            key={dateKey}
            type="button"
            onClick={() => setActiveDate(dateKey)}
            className={cn(
              "shrink-0 rounded-xl border px-3 py-2 text-left text-xs transition-colors sm:text-sm",
              activeDate === dateKey
                ? "border-or bg-or text-white"
                : "border-or/20 bg-white/70 text-texte hover:border-or/40 dark:bg-[#2a1a1d]/80 dark:text-rose-pale/80",
            )}
          >
            <span className="block font-medium capitalize">{formatDayHeader(dateKey)}</span>
            <span className={cn("opacity-80", activeDate === dateKey && "text-white/90")}>
              {byDate.get(dateKey)?.length} créneau{(byDate.get(dateKey)?.length ?? 0) > 1 ? "x" : ""}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {daySlots.map((slot) => {
          const selected = value === slot.startAt;
          return (
            <button
              key={slot.startAt}
              type="button"
              onClick={() => {
                onChange(slot.startAt);
                onBlur();
              }}
              className={cn(
                "rounded-xl border px-2 py-2.5 text-sm font-medium transition-all",
                selected
                  ? "border-or bg-or text-white ring-2 ring-or/30"
                  : "border-or/20 bg-white/70 text-texte hover:border-or/50 dark:bg-[#2a1a1d]/80 dark:text-rose-pale/90",
              )}
            >
              {slot.timeKey}
            </button>
          );
        })}
      </div>

      {value && (
        <p className="mt-3 text-sm text-or">
          Sélection : {slots.find((s) => s.startAt === value)?.label}
        </p>
      )}

      <FieldError message={error} />
    </div>
  );
}
