"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
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
import type { AdminNotificationStats } from "@/lib/site-data";

const links = [
  { href: "/admin", label: "Accueil", icon: LayoutDashboard },
  { href: "/admin/home", label: "Page d'accueil", icon: Home },
  { href: "/admin/disponibilites", label: "Disponibilités", icon: CalendarDays },
  { href: "/admin/messages", label: "Rendez-vous", icon: Mail, badge: true },
  { href: "/admin/services", label: "Tarifs", icon: Scissors },
  { href: "/admin/contact", label: "Contact", icon: Phone },
  { href: "/admin/booking", label: "Réservation", icon: Clock },
];

const POLL_INTERVAL_MS = 30_000;

export function AdminShell({
  children,
  initialNotifications,
}: {
  children: React.ReactNode;
  initialNotifications: AdminNotificationStats;
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [alert, setAlert] = useState<string | null>(null);
  const prevUnread = useRef(initialNotifications.unread);
  const pathname = usePathname();
  const router = useRouter();
  const current = useMemo(() => pathname ?? "/admin", [pathname]);

  useEffect(() => {
    setNotifications(initialNotifications);
    prevUnread.current = initialNotifications.unread;
  }, [initialNotifications]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/admin/notifications", { cache: "no-store" });
        if (!res.ok || cancelled) return;

        const data = (await res.json()) as AdminNotificationStats;
        if (cancelled) return;

        if (data.unread > prevUnread.current) {
          const label = data.latestUnreadName
            ? `Nouveau rendez-vous — ${data.latestUnreadName}`
            : "Nouveau rendez-vous reçu";
          setAlert(label);
          router.refresh();
        }

        prevUnread.current = data.unread;
        setNotifications(data);
      } catch {
        // ignore network errors during polling
      }
    }

    const interval = window.setInterval(poll, POLL_INTERVAL_MS);
    return function () {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [router]);

  useEffect(() => {
    if (!alert) return;

    const timeout = window.setTimeout(function () {
      setAlert(null);
    }, 6000);

    return function () {
      window.clearTimeout(timeout);
    };
  }, [alert]);

  const unread = notifications.unread;

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-[#141012]">
      {alert && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-or/30 bg-white px-4 py-3 shadow-lg dark:bg-[#2a1a1d]">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-or" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-anthracite dark:text-rose-pale">{alert}</p>
            <Link href="/admin/messages?status=pending" className="mt-1 inline-block text-xs text-or underline">
              Voir le rendez-vous →
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setAlert(null)}
            className="text-texte/50 hover:text-texte"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
              const showBadge = link.badge && unread > 0;
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
                    <span
                      className={cn(
                        "rounded-full bg-rose-sombre px-2 py-0.5 text-xs text-white",
                        active && "bg-white text-rose-sombre",
                      )}
                    >
                      {unread}
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
            <p className="flex-1 font-display text-lg text-anthracite dark:text-rose-pale">Administration</p>
            {unread > 0 && (
              <Link
                href="/admin/messages?status=pending"
                className="relative rounded-lg p-2 text-or"
                aria-label={`${unread} nouveau(x) rendez-vous`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-sombre px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              </Link>
            )}
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
