"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/lb/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#hero", id: "hero", label: "Accueil" },
  { href: "#presentation", id: "presentation", label: "À propos" },
  { href: "#prestations", id: "prestations", label: "Prestations" },
  { href: "#rdv", id: "rdv", label: "Réservation" },
  { href: "#contact", id: "contact", label: "Contact" },
];

function Logo() {
  return (
    <a href="#hero" className="flex items-center gap-2">
      <svg viewBox="0 0 48 48" className="h-10 w-10 float">
        <defs>
          <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#e8d5a3" />
            <stop offset="1" stopColor="#c9a96e" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="none" stroke="url(#gold)" strokeWidth="1" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 8;
          const x = 24 + Math.cos(a) * 18;
          const y = 24 + Math.sin(a) * 18;
          return <circle key={i} cx={x} cy={y} r="2.2" fill="url(#gold)" />;
        })}
        <text x="24" y="29" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="16" fontWeight="600" fill="currentColor" className="text-anthracite dark:fill-rose-pale">
          LB
        </text>
      </svg>
      <span className="font-display text-lg tracking-[0.25em] text-anthracite dark:text-rose-pale hidden sm:inline">
        LARY BEAUTY
      </span>
    </a>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const sectionIds = nav.map(function (n) {
      return n.id;
    });

    function updateActiveSection() {
      setScrolled(window.scrollY > 30);

      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = sectionIds[0];

      sectionIds.forEach(function (id) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) current = id;
      });

      setActive(current);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return function () {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-rose-pale/70 dark:bg-[#1a1215]/80 backdrop-blur-md border-b border-or/20 dark:border-or/30 shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => {
            const isActive = active === n.id;
            return (
              <a
                key={n.href}
                href={n.href}
                className={cn(
                  "text-sm tracking-widest uppercase transition-colors relative group",
                  isActive
                    ? "text-or"
                    : "text-texte dark:text-rose-pale/80 hover:text-or",
                )}
              >
                {n.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px bg-or transition-all",
                    isActive ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button href="#rdv" size="sm">Réserver</Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="text-anthracite dark:text-rose-pale p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 bg-rose-pale/95 dark:bg-[#1a1215]/95 backdrop-blur-md",
          open ? "max-h-96 border-b border-or/20" : "max-h-0",
        )}
      >
        <div className="flex flex-col px-6 py-4 gap-4">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={cn(
                "text-sm tracking-widest uppercase",
                active === n.id ? "text-or" : "text-texte dark:text-rose-pale/80",
              )}
            >
              {n.label}
            </a>
          ))}
          <Button href="#rdv" size="sm">Réserver</Button>
        </div>
      </div>
    </header>
  );
}