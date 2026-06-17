"use client";

import { useEffect, useState } from "react";

export function Loader() {
  const [hidden, setHidden] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1300);
    const t2 = setTimeout(() => setHidden(true), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background:
          "linear-gradient(180deg, const(--bg-primary) 0%, const(--bg-secondary) 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 120 120" className="h-28 w-28 loader-logo">
          <defs>
            <linearGradient id="loader-gold" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#e8d5a3" />
              <stop offset="1" stopColor="#c9a96e" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="url(#loader-gold)"
            strokeWidth="1.5"
            strokeDasharray="314"
            strokeDashoffset="314"
            className="loader-ring"
          />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 8;
            const x = 60 + Math.cos(a) * 45;
            const y = 60 + Math.sin(a) * 45;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="url(#loader-gold)"
                className="loader-dot"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            );
          })}
          <text
            x="60"
            y="70"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="34"
            fontWeight="600"
            fill="url(#loader-gold)"
            className="loader-text"
          >
            LB
          </text>
        </svg>
        <span className="font-display tracking-[0.4em] text-sm text-or loader-tag">
          LARY BEAUTY
        </span>
      </div>
    </div>
  );
}