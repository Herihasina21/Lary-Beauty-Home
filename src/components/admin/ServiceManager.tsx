"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import {
  deleteServiceAction,
  saveServiceAction,
} from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { cn } from "@/lib/utils";

type Category = { id: string; title: string };
type Service = {
  id: string;
  categoryId: string;
  groupName: string;
  name: string;
  price: string;
  priceUnit: string | null;
  duration: string | null;
  description: string | null;
  sortOrder: number;
};

function formatPrice(price: string, unit?: string | null) {
  const base = /^\d+$/.test(price) ? `${price} €` : `${price} €`;
  if (unit) return `${base}${unit}`;
  return base;
}

const inputClass =
  "w-full rounded-xl border border-or/20 bg-white px-3 py-2.5 text-sm text-texte outline-none focus:border-or dark:bg-[#2a1a1d] dark:text-rose-pale";

export function ServiceManager({
  categories,
  services,
}: {
  categories: Category[];
  services: Service[];
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newServiceId] = useState(function () {
    return crypto.randomUUID();
  });

  const filtered = useMemo(
    () => services.filter((s) => s.categoryId === activeCategory),
    [services, activeCategory],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Service[]>();
    filtered.forEach(function (s) {
      const list = map.get(s.groupName) ?? [];
      list.push(s);
      map.set(s.groupName, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const groupNames = useMemo(() => {
    const names = new Set<string>();
    filtered.forEach(function (s) {
      names.add(s.groupName);
    });
    return Array.from(names);
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(function (cat) {
          const count = services.filter((s) => s.categoryId === cat.id).length;
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setEditingId(null);
              }}
              className={cn(
                "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-or text-white shadow-sm"
                  : "bg-white text-texte ring-1 ring-or/15 hover:bg-or/5 dark:bg-[#2a1a1d] dark:text-rose-pale",
              )}
            >
              {cat.title}
              <span className={cn("ml-2 text-xs", active ? "text-white/80" : "text-texte/50")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowAdd(!showAdd)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-or/30 bg-white py-4 text-sm font-medium text-or transition-colors hover:border-or hover:bg-or/5 dark:bg-[#2a1a1d]"
      >
        <Plus className="h-4 w-4" />
        {showAdd ? "Fermer le formulaire" : "Ajouter une prestation"}
      </button>

      {showAdd && (
        <AdminCard title="Nouvelle prestation">
          <form action={saveServiceAction} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="id" value={newServiceId} />
            <input type="hidden" name="categoryId" value={activeCategory} />
            <input type="hidden" name="sortOrder" value={filtered.length} />
            <input type="hidden" name="returnPath" value="/admin/services" />
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-texte dark:text-rose-pale">Nom de la prestation</span>
              <input name="name" required className={inputClass} placeholder="Ex. Beauté des mains" />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-texte dark:text-rose-pale">Prix</span>
              <input name="price" required className={inputClass} placeholder="Ex. 35 ou +5" />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-texte dark:text-rose-pale">Section</span>
              <input name="groupName" required className={inputClass} list="group-suggestions" placeholder="Ex. Nail Art" />
              <datalist id="group-suggestions">
                {groupNames.map(function (g) {
                  return <option key={g} value={g} />;
                })}
              </datalist>
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-texte dark:text-rose-pale">Durée (optionnel)</span>
              <input name="duration" className={inputClass} placeholder="Ex. 45 min" />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium text-texte dark:text-rose-pale">Supplément / unité</span>
              <input name="priceUnit" className={inputClass} placeholder="Ex. /doigt" />
            </label>
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-texte dark:text-rose-pale">Description (optionnel)</span>
              <textarea name="description" rows={2} className={inputClass} />
            </label>
            <div className="sm:col-span-2">
              <AdminSubmitButton label="Ajouter la prestation" />
            </div>
          </form>
        </AdminCard>
      )}

      {groups.length === 0 && (
        <p className="rounded-xl bg-white p-6 text-center text-sm text-texte/60 dark:bg-[#2a1a1d] dark:text-rose-pale/50">
          Aucune prestation dans cette catégorie.
        </p>
      )}

      {groups.map(function ([groupName, items]) {
        return (
          <section key={groupName} className="overflow-hidden rounded-2xl border border-or/15 bg-white dark:bg-[#2a1a1d]">
            <div className="border-b border-or/10 bg-or/5 px-4 py-3">
              <h3 className="font-display text-lg text-anthracite dark:text-rose-pale">{groupName}</h3>
            </div>
            <ul className="divide-y divide-or/10">
              {items.map(function (svc) {
                const open = editingId === svc.id;
                return (
                  <li key={svc.id}>
                    <button
                      type="button"
                      onClick={() => setEditingId(open ? null : svc.id)}
                      className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-or/5"
                    >
                      {open ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-or" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-or/60" />
                      )}
                      <span className="flex-1 text-sm font-medium text-anthracite dark:text-rose-pale">
                        {svc.name}
                      </span>
                      {svc.duration && (
                        <span className="hidden text-xs text-texte/50 sm:inline">{svc.duration}</span>
                      )}
                      <span className="font-display text-lg text-or">{formatPrice(svc.price, svc.priceUnit)}</span>
                    </button>
                    {open && (
                      <div className="border-t border-or/10 bg-rose-pale/30 px-4 py-4 dark:bg-black/20">
                        <form action={saveServiceAction} className="grid gap-4 sm:grid-cols-2">
                          <input type="hidden" name="id" value={svc.id} />
                          <input type="hidden" name="categoryId" value={svc.categoryId} />
                          <input type="hidden" name="sortOrder" value={svc.sortOrder} />
                          <input type="hidden" name="returnPath" value="/admin/services" />
                          <label className="sm:col-span-2">
                            <span className="mb-1.5 block text-sm font-medium">Nom</span>
                            <input name="name" defaultValue={svc.name} required className={inputClass} />
                          </label>
                          <label>
                            <span className="mb-1.5 block text-sm font-medium">Prix</span>
                            <input name="price" defaultValue={svc.price} required className={inputClass} />
                          </label>
                          <label>
                            <span className="mb-1.5 block text-sm font-medium">Section</span>
                            <input name="groupName" defaultValue={svc.groupName} required className={inputClass} />
                          </label>
                          <label>
                            <span className="mb-1.5 block text-sm font-medium">Durée</span>
                            <input name="duration" defaultValue={svc.duration ?? ""} className={inputClass} />
                          </label>
                          <label>
                            <span className="mb-1.5 block text-sm font-medium">Supplément / unité</span>
                            <input name="priceUnit" defaultValue={svc.priceUnit ?? ""} className={inputClass} />
                          </label>
                          <label className="sm:col-span-2">
                            <span className="mb-1.5 block text-sm font-medium">Description</span>
                            <textarea name="description" defaultValue={svc.description ?? ""} rows={2} className={inputClass} />
                          </label>
                          <div className="flex flex-wrap gap-2 sm:col-span-2">
                            <AdminSubmitButton label="Enregistrer" />
                          </div>
                        </form>
                        <form
                          action={deleteServiceAction}
                          className="mt-3"
                          onSubmit={function (e) {
                            if (!window.confirm(`Supprimer « ${svc.name} » ?`)) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="id" value={svc.id} />
                          <input type="hidden" name="returnPath" value="/admin/services" />
                          <AdminSubmitButton label="Supprimer" variant="ghost" pendingLabel="Suppression…" />
                        </form>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
