import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-or-clair to-or px-4 py-2 text-sm font-medium text-anthracite shadow-[var(--ombre-carte)]",
        className,
      )}
    >
      {children}
    </span>
  );
}