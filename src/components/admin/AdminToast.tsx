"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";

export function AdminToast() {
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved") === "1";
  const [visible, setVisible] = useState(saved);

  useEffect(() => {
    if (saved) {
      setVisible(true);
      const t = window.setTimeout(function () {
        setVisible(false);
      }, 4000);
      return function () {
        window.clearTimeout(t);
      };
    }
  }, [saved]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-or/30 bg-white px-4 py-3 shadow-lg dark:bg-[#2a1a1d]">
      <CheckCircle2 className="h-5 w-5 text-or" />
      <p className="text-sm font-medium text-anthracite dark:text-rose-pale">Modifications enregistrées</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="text-texte/50 hover:text-texte"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
