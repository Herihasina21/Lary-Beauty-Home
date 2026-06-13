"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/lb/button";
import { Badge } from "@/components/lb/badge";

function Petal({ delay, duration, left }: { delay: number; duration: number; left: string }) {
  return (
    <svg
      className="petal"
      style={{ left, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
      viewBox="0 0 24 24"
    >
      <path d="M12 2 C16 6 18 12 12 22 C6 12 8 6 12 2 Z" fill="#e8a898" opacity="0.7" />
    </svg>
  );
}

function CornerFlourish({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <g fill="none" stroke="#c9a96e" strokeWidth="1" opacity="0.4">
        <path d="M10 60 Q40 20 80 30 Q100 35 110 60" />
        <circle cx="80" cy="30" r="4" fill="#c9a96e" opacity="0.5" />
        <circle cx="40" cy="40" r="3" fill="#e8a898" opacity="0.5" />
        <path d="M20 80 Q50 70 70 90" />
      </g>
    </svg>
  );
}

export function HeroSection() {
  const petals = Array.from({ length: 12 }).map((_, i) => ({
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 8,
    left: `${i * 8 + Math.random() * 5}%`,
  }));

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24"
    >
      {petals.map((p, i) => (
        <Petal key={i} {...p} />
      ))}

      <CornerFlourish className="absolute top-20 left-0 w-40 opacity-60 rotate-0" />
      <CornerFlourish className="absolute top-20 right-0 w-40 opacity-60 scale-x-[-1]" />
      <CornerFlourish className="absolute bottom-10 left-0 w-40 opacity-60 scale-y-[-1]" />
      <CornerFlourish className="absolute bottom-10 right-0 w-40 opacity-60 scale-[-1]" />

      <div className="relative z-10 text-center px-6 max-w-3xl fade-in-scale">
        <svg viewBox="0 0 160 160" className="h-32 w-32 mx-auto float mb-6">
          <defs>
            <linearGradient id="heroGold" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#e8d5a3" />
              <stop offset="1" stopColor="#c9a96e" />
            </linearGradient>
          </defs>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 12;
            const x = 80 + Math.cos(a) * 60;
            const y = 80 + Math.sin(a) * 60;
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${(i * 360) / 12})`}>
                <path d="M0 -8 C6 -4 6 4 0 10 C-6 4 -6 -4 0 -8 Z" fill="url(#heroGold)" opacity="0.8" />
              </g>
            );
          })}
          <circle cx="80" cy="80" r="42" fill="none" stroke="url(#heroGold)" strokeWidth="1.5" />
          <text x="80" y="92" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="44" fontWeight="500" fill="#2d2d2d">
            LB
          </text>
        </svg>

        <p className="text-xs tracking-[0.5em] uppercase text-rose-moyen mb-4">
          Institut de Beauté
        </p>

        <h1 className="font-display text-5xl md:text-7xl font-light text-anthracite dark:text-rose-pale tracking-wide">
          LARY BEAUTY HOME
        </h1>

        <p className="font-display italic text-2xl md:text-3xl text-or mt-4">
          L'art de la beauté à domicile
        </p>

        <div className="mt-8 flex justify-center">
          <Badge>
            -10% sur votre premier rendez-vous
          </Badge>
        </div>

        <div className="mt-10">
          <Button href="#rdv" size="lg">
            Prendre Rendez-vous →
          </Button>
        </div>
      </div>
    </section>
  );
}
