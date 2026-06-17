"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(function () {
    setMounted(true);
  }, []);

  const buttonClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-full bg-or/20 text-or hover:bg-or/30 hover:scale-105 transition-all duration-300 border border-or/30";

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Changer le thème"
        title="Changer le thème"
        className={buttonClass}
      >
        <Moon className="w-5 h-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
      className={buttonClass}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}