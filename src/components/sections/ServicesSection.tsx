"use client";

import { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { SectionTitle } from "@/components/lb/section-title";
import { servicesData, soinsNotes } from "@/data/services";
import { cn } from "@/lib/utils";

function formatPrice(price: number | string, unit?: string) {
  const value = typeof price === "number" ? `${price}€` : `${price}€`;
  return unit ? `${value}${unit}` : value;
}

export function ServicesSection() {
  const [activeId, setActiveId] = useState(servicesData[0].id);
  const active = servicesData.find((c) => c.id === activeId)!;

  const groups = useMemo(() => {
    const map = new Map<string, typeof active.services>();
    active.services.forEach((s) => {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    });
    return Array.from(map.entries());
  }, [active]);

  return (
    <section id="prestations" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionTitle
          eyebrow="Carte des soins"
          title="Mes Prestations"
          subtitle="Une carte pensée pour révéler votre beauté"
        />

        {/* Mobile: icon pills */}
        <div className="md:hidden mb-8 flex justify-center gap-3 flex-wrap">
          {servicesData.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveId(cat.id)}
                aria-label={cat.title}
                aria-pressed={isActive}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 border transition-all min-w-[96px]",
                  isActive
                    ? "bg-gradient-to-br from-or-clair/40 to-or/30 border-or text-anthracite dark:text-rose-pale shadow-[var(--ombre-carte)]"
                    : "bg-white/60 dark:bg-[#2a1a1d]/70 border-or/15 dark:border-or/25 text-texte/70 dark:text-rose-pale/70 hover:border-or/50",
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-or" : "text-rose-moyen")} />
                <span className="text-[11px] uppercase tracking-[0.2em] font-display">
                  {cat.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop tabs */}
        <div className="hidden md:flex flex-wrap justify-center gap-8 border-b border-or/20 mb-12">
          {servicesData.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveId(cat.id)}
                className={cn(
                  "relative pb-4 px-3 text-base uppercase tracking-[0.25em] transition-colors flex items-center gap-2",
                  isActive ? "text-or" : "text-texte/70 dark:text-rose-pale/60 hover:text-anthracite dark:hover:text-rose-pale",
                )}
              >
                <Icon className="w-4 h-4" />
                {cat.title}
                {isActive && (
                  <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-gradient-to-r from-or-clair via-or to-or-clair" />
                )}
              </button>
            );
          })}
        </div>

        <div key={activeId} className="space-y-12 tab-fade">
          {groups.map(([category, items]) => (
            <div key={category}>
              <h3 className="font-display text-2xl text-rose-sombre mb-1">{category}</h3>
              <div className="ornament-line text-or mb-6 justify-start">
                <span>✦</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {items.map((s) => (
                  <div
                    key={s.id}
                    className="group bg-white/60 dark:bg-[#2a1a1d]/70 backdrop-blur-sm rounded-2xl p-5 border border-or/10 dark:border-or/25 border-l-2 transition-all duration-300 hover:-translate-y-1 hover:border-l-or hover:shadow-[var(--ombre-hover)]"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-display text-xl text-anthracite dark:text-rose-pale">{s.name}</h4>
                          {s.duration && (
                            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-rose-moyen border border-rose-moyen/40 rounded-full px-2 py-0.5">
                              <Clock className="w-3 h-3" />
                              {s.duration}
                            </span>
                          )}
                        </div>
                        {s.description && (
                          <p className="text-sm text-texte/80 dark:text-rose-pale/70 mt-2 leading-relaxed">{s.description}</p>
                        )}
                      </div>
                      <div className="font-display text-2xl text-or whitespace-nowrap">
                        {formatPrice(s.price, s.unit)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {active.id === "soins" && (
          <div className="mt-12 bg-white/60 dark:bg-[#2a1a1d]/70 backdrop-blur-sm rounded-2xl border border-or/20 dark:border-or/30 p-8 text-center">
            <ul className="space-y-2">
              {soinsNotes.map((n) => (
                <li key={n} className="font-display italic text-rose-sombre text-lg flex items-center justify-center gap-2">
                  <span className="text-or">✦</span> {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}