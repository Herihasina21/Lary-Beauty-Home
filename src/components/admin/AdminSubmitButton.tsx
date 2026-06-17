"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSubmitButton({
  label,
  pendingLabel,
  variant = "primary",
  className,
}: {
  label: string;
  pendingLabel?: string;
  variant?: "primary" | "danger" | "ghost";
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-opacity disabled:opacity-60",
        variant === "primary" && "bg-or text-white hover:bg-or/90",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        variant === "ghost" && "border border-or/25 text-texte hover:bg-or/10 dark:text-rose-pale",
        className,
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? (pendingLabel ?? "Enregistrement…") : label}
    </button>
  );
}
