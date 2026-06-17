export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export const appointmentStatuses: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
];

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  completed: "Terminé",
};

export const appointmentStatusDescriptions: Record<AppointmentStatus, string> = {
  pending: "Votre demande a bien été reçue. Je vous confirmerai la date très bientôt.",
  confirmed: "Votre rendez-vous est confirmé. À très bientôt !",
  cancelled: "Ce rendez-vous a été annulé. Contactez-moi si vous souhaitez reprendre rendez-vous.",
  completed: "Merci pour votre visite. Au plaisir de vous revoir !",
};

export function parseAppointmentStatus(value: string): AppointmentStatus {
  if (value === "confirmed" || value === "cancelled" || value === "completed") {
    return value;
  }
  return "pending";
}

export function formatAppointmentDate(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" });
}

export function toDatetimeLocalValue(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = function (n: number) {
    return String(n).padStart(2, "0");
  };
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}
