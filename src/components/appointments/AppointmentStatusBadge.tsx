import { cn } from "@/lib/utils";
import { appointmentStatusLabels, type AppointmentStatus } from "@/lib/appointments";

const styles: Record<AppointmentStatus, string> = {
  pending: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
  confirmed: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200",
  completed: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
};

export function AppointmentStatusBadge({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        styles[status],
        className,
      )}
    >
      {appointmentStatusLabels[status]}
    </span>
  );
}
