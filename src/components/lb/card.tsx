import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/70 dark:bg-[#2a1a1d]/80 backdrop-blur-sm p-6 shadow-[const(--ombre-carte)] border border-or/10 dark:border-or/25 transition-all duration-300",
        hover && "hover:-translate-y-1 hover:shadow-[const(--ombre-hover)] hover:border-or/40",
        className,
      )}
    >
      {children}
    </div>
  );
}