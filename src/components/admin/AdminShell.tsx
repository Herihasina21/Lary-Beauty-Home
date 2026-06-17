"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Phone,
  Scissors,
  X,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Accueil", icon: LayoutDashboard },
  { href: "/admin/home", label: "Page d'accueil", icon: Home },
  { href: "/admin/disponibilites", label: "Disponibilités", icon: CalendarDays },
  { href: "/admin/messages", label: "Rendez-vous", icon: Mail, badge: true },
  { href: "/admin/services", label: "Tarifs", icon: Scissors },
  { href: "/admin/contact", label: "Contact", icon: Phone },
  { href: "/admin/booking", label: "Réservation", icon: Clock },
];

export function AdminShell({
  children,
  unreadMessages = 0,
}: {
  children: React.ReactNode;
  unreadMessages?: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = useMemo(() => pathname ?? "/admin", [pathname]);

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-[#141012]">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-or/15 bg-white dark:bg-[#1c1416] transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-or/10 px-5 py-5">
            <div>
              <p className="font-display text-xl text-anthracite dark:text-rose-pale">Lary Beauty</p>
              <p className="text-xs text-texte/60 dark:text-rose-pale/50">Espace admin</p>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-texte lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {links.map(function (link) {
              const Icon = link.icon;
              const active = current === link.href;
              const showBadge = link.badge && unreadMessages > 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-or text-white shadow-sm"
                      : "text-texte hover:bg-or/10 dark:text-rose-pale/80 dark:hover:bg-or/15",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1">{link.label}</span>
                  {showBadge && (
                    <span className="rounded-full bg-rose-sombre px-2 py-0.5 text-xs text-white">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-or/10 p-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-texte hover:bg-or/10 dark:text-rose-pale/80"
            >
              <ExternalLink className="h-5 w-5" />
              Voir le site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-texte hover:bg-red-50 hover:text-red-700 dark:text-rose-pale/80 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-5 w-5" />
                Déconnexion
              </button>
            </form>
          </div>
        </aside>

        {open && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-or/10 bg-white/80 px-4 py-3 backdrop-blur dark:bg-[#1c1416]/80 lg:hidden">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-texte dark:text-rose-pale"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <p className="font-display text-lg text-anthracite dark:text-rose-pale">Administration</p>
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
