"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  deleteAboutFeatureAction,
  saveAboutFeatureAction,
  saveHomePageAction,
} from "@/app/admin/actions";
import { AdminCard, AdminField } from "@/components/admin/AdminField";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { iconOptions } from "@/lib/icons";

type Feature = {
  id: string;
  icon: string;
  title: string;
  text: string;
  sortOrder: number;
};

type Config = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPromoBadge: string | null;
  heroCtaLabel: string;
  heroCtaHref: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutIntro: string;
};

const inputClass =
  "w-full rounded-xl border border-or/20 bg-white px-3 py-2.5 text-sm text-texte outline-none focus:border-or dark:bg-[#2a1a1d] dark:text-rose-pale";

export function HomePagePanel({ config, features }: { config: Config; features: Feature[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newId] = useState(function () {
    return crypto.randomUUID();
  });

  return (
    <div className="space-y-8">
      <form action={saveHomePageAction} className="space-y-8">
        <input type="hidden" name="returnPath" value="/admin/home" />

        <AdminCard title="Bannière d'accueil">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Surtitre" name="heroEyebrow" defaultValue={config.heroEyebrow} />
            <AdminField label="Titre principal" name="heroTitle" defaultValue={config.heroTitle} />
            <div className="sm:col-span-2">
              <AdminField label="Sous-titre" name="heroSubtitle" defaultValue={config.heroSubtitle} />
            </div>
            <AdminField
              label="Badge promo"
              name="heroPromoBadge"
              defaultValue={config.heroPromoBadge ?? ""}
              hint="Laissez vide pour masquer le badge"
            />
            <AdminField label="Texte du bouton" name="heroCtaLabel" defaultValue={config.heroCtaLabel} />
            <AdminField
              label="Lien du bouton"
              name="heroCtaHref"
              defaultValue={config.heroCtaHref}
              hint="Ex. #rdv pour la section réservation"
            />
          </div>
        </AdminCard>

        <AdminCard title="Section à propos">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Surtitre" name="aboutEyebrow" defaultValue={config.aboutEyebrow} />
              <AdminField label="Titre" name="aboutTitle" defaultValue={config.aboutTitle} />
            </div>
            <AdminField label="Texte d'introduction" name="aboutIntro" defaultValue={config.aboutIntro} textarea />
          </div>
        </AdminCard>

        <AdminSubmitButton label="Enregistrer la page d'accueil" className="w-full sm:w-auto" />
      </form>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl text-anthracite dark:text-rose-pale">Points forts</h2>
            <p className="text-sm text-texte/60 dark:text-rose-pale/50">
              Les 4 cartes sous le texte de présentation
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 rounded-xl bg-or px-4 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        {showAdd && (
          <AdminCard title="Nouveau point fort">
            <form action={saveAboutFeatureAction} className="space-y-4">
              <input type="hidden" name="id" value={newId} />
              <input type="hidden" name="sortOrder" value={features.length} />
              <input type="hidden" name="returnPath" value="/admin/home" />
              <FeatureFields />
              <AdminSubmitButton label="Ajouter" />
            </form>
          </AdminCard>
        )}

        {features.map(function (f) {
          return (
            <AdminCard key={f.id} title={f.title}>
              <form action={saveAboutFeatureAction} className="space-y-4">
                <input type="hidden" name="id" value={f.id} />
                <input type="hidden" name="sortOrder" value={f.sortOrder} />
                <input type="hidden" name="returnPath" value="/admin/home" />
                <FeatureFields feature={f} />
                <div className="flex flex-wrap gap-3">
                  <AdminSubmitButton label="Enregistrer" />
                </div>
              </form>
              <form action={deleteAboutFeatureAction} className="mt-3 border-t border-or/10 pt-3">
                <input type="hidden" name="id" value={f.id} />
                <input type="hidden" name="returnPath" value="/admin/home" />
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:underline dark:text-red-400"
                >
                  Supprimer
                </button>
              </form>
            </AdminCard>
          );
        })}
      </section>
    </div>
  );
}

function FeatureFields({ feature }: { feature?: Feature }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-texte dark:text-rose-pale">Icône</span>
        <select
          name="icon"
          defaultValue={feature?.icon ?? "Home"}
          className={inputClass}
        >
          {iconOptions.map(function (name) {
            return (
              <option key={name} value={name}>
                {name}
              </option>
            );
          })}
        </select>
      </label>
      <AdminField label="Titre" name="title" defaultValue={feature?.title ?? ""} required />
      <div className="sm:col-span-2">
        <AdminField label="Description" name="text" defaultValue={feature?.text ?? ""} textarea required />
      </div>
    </div>
  );
}
