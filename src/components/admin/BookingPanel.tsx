"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  deleteBookingHighlightAction,
  deleteBookingRuleAction,
  saveBookingHighlightAction,
  saveBookingRuleAction,
  saveSiteConfigAction,
} from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";

type Rule = {
  id: string;
  icon: string;
  text: string;
  highlight: string | null;
  sortOrder: number;
};

type Highlight = { id: string; text: string; sortOrder: number };

const inputClass =
  "w-full rounded-xl border border-or/20 bg-white px-3 py-2.5 text-sm text-texte outline-none focus:border-or dark:bg-[#2a1a1d] dark:text-rose-pale";

export function BookingPanel({
  rules,
  highlights,
  bookingQuote,
  siteConfigHidden,
}: {
  rules: Rule[];
  highlights: Highlight[];
  bookingQuote: string;
  siteConfigHidden: Record<string, string>;
}) {
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRuleId] = useState(function () {
    return crypto.randomUUID();
  });
  const [newHighlightId] = useState(function () {
    return crypto.randomUUID();
  });

  return (
    <div className="space-y-8">
      <AdminCard title="Citation affichée sur le site">
        <form action={saveSiteConfigAction} className="space-y-4">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-texte dark:text-rose-pale">
              Votre phrase d&apos;accroche
            </span>
            <textarea
              name="bookingQuote"
              defaultValue={bookingQuote}
              rows={3}
              className={inputClass}
            />
          </label>
          {Object.entries(siteConfigHidden).map(function ([key, value]) {
            return <input key={key} type="hidden" name={key} value={value} />;
          })}
          <input type="hidden" name="returnPath" value="/admin/booking" />
          <AdminSubmitButton label="Enregistrer la citation" />
        </form>
      </AdminCard>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl text-anthracite dark:text-rose-pale">Règles de réservation</h2>
            <p className="text-sm text-texte/60 dark:text-rose-pale/50">
              Ce que vos clientes voient avant de réserver
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddRule(!showAddRule)}
            className="inline-flex items-center gap-2 rounded-xl bg-or px-4 py-2 text-sm text-white"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        {showAddRule && (
          <AdminCard title="Nouvelle règle">
            <form action={saveBookingRuleAction} className="space-y-4">
              <input type="hidden" name="id" value={newRuleId} />
              <input type="hidden" name="icon" value="Info" />
              <input type="hidden" name="sortOrder" value={rules.length} />
              <input type="hidden" name="returnPath" value="/admin/booking" />
              <label>
                <span className="mb-1.5 block text-sm font-medium">Texte de la règle</span>
                <textarea name="text" required rows={3} className={inputClass} />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-medium">Phrase importante (optionnel)</span>
                <textarea name="highlight" rows={2} className={inputClass} placeholder="Ex. Sans confirmation, RDV annulé" />
              </label>
              <AdminSubmitButton label="Ajouter la règle" />
            </form>
          </AdminCard>
        )}

        <ul className="space-y-3">
          {rules.map(function (rule, index) {
            return (
              <li key={rule.id} className="rounded-2xl border border-or/15 bg-white p-4 dark:bg-[#2a1a1d]">
                <p className="mb-1 text-xs font-medium text-or">Règle {index + 1}</p>
                <form action={saveBookingRuleAction} className="space-y-3">
                  <input type="hidden" name="id" value={rule.id} />
                  <input type="hidden" name="icon" value={rule.icon} />
                  <input type="hidden" name="sortOrder" value={rule.sortOrder} />
                  <input type="hidden" name="returnPath" value="/admin/booking" />
                  <textarea name="text" defaultValue={rule.text} required rows={2} className={inputClass} />
                  <textarea
                    name="highlight"
                    defaultValue={rule.highlight ?? ""}
                    rows={2}
                    className={inputClass}
                    placeholder="Phrase importante (optionnel)"
                  />
                  <div className="flex flex-wrap gap-2">
                    <AdminSubmitButton label="Enregistrer" />
                  </div>
                </form>
                <form
                  action={deleteBookingRuleAction}
                  className="mt-2"
                  onSubmit={function (e) {
                    if (!window.confirm("Supprimer cette règle ?")) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={rule.id} />
                  <input type="hidden" name="returnPath" value="/admin/booking" />
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Supprimer
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-anthracite dark:text-rose-pale">Points forts</h2>
        <form action={saveBookingHighlightAction} className="flex flex-col gap-2 sm:flex-row">
          <input type="hidden" name="id" value={newHighlightId} />
          <input type="hidden" name="sortOrder" value={highlights.length} />
          <input type="hidden" name="returnPath" value="/admin/booking" />
          <input
            name="text"
            required
            placeholder="Ex. Nail art personnalisé"
            className={inputClass}
          />
          <AdminSubmitButton label="Ajouter" className="sm:shrink-0" />
        </form>
        <ul className="space-y-2">
          {highlights.map(function (item) {
            return (
              <li
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-or/15 bg-white p-3 sm:flex-row sm:items-center dark:bg-[#2a1a1d]"
              >
                <form action={saveBookingHighlightAction} className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="sortOrder" value={item.sortOrder} />
                  <input type="hidden" name="returnPath" value="/admin/booking" />
                  <input name="text" defaultValue={item.text} className={inputClass} />
                  <AdminSubmitButton label="OK" className="sm:w-24" />
                </form>
                <form
                  action={deleteBookingHighlightAction}
                  onSubmit={function (e) {
                    if (!window.confirm("Supprimer ?")) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="returnPath" value="/admin/booking" />
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Supprimer
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
