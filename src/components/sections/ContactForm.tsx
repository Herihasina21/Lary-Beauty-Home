"use client";

import { HelpCircle, Loader2, CheckCircle, AlertCircle, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/lb/button";
import { Card } from "@/components/lb/card";
import { formatSlotLabelFromIso } from "@/lib/availability";
import { contactFormSteps, formatServicePrice, getCategoryTitle, groupServicesByCategory, type ContactCategoryId, } from "@/lib/contact-form";
import type { ContactInfo, Service, SerializedServiceCategory } from "@/types";
import { resolveIcon } from "@/lib/icons";
import { useContactForm } from "@/hooks/useContactForm";
import { Field, TextAreaField, } from "@/components/ui/lb-form-fields";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { InstagramIcon } from "@/components/icons/brand-icons";
import { cn } from "@/lib/utils";

const autreCategory = {
  id: "autre" as ContactCategoryId,
  title: "Autre",
  icon: HelpCircle,
};

const categoryCardSelected =
  "border-or bg-or/10 dark:bg-or/25 dark:border-or ring-2 ring-or/40 dark:ring-or/50 shadow-[const(--ombre-carte)]";

function ServiceOptionCard({
  service,
  selected,
  onSelect,
}: {
  service: Service;
  selected: boolean;
  onSelect: () => void;
}) {
  const price = formatServicePrice(service.price, service.unit);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex h-full w-full flex-col rounded-xl border p-3 sm:p-4 text-left transition-all",
        selected
          ? "border-or bg-or/10 dark:bg-or/15 ring-2 ring-or/25"
          : "border-or/15 bg-white/50 dark:bg-white/5 hover:border-or/40 hover:bg-or/5",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          {selected && (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-or" aria-hidden="true" />
          )}
          <p className="text-sm font-medium leading-snug text-texte dark:text-rose-pale/90 sm:text-base">
            {service.name}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            selected ? "bg-or text-white" : "bg-or/15 text-or",
          )}
        >
          {price}
        </span>
      </div>
      {service.duration && (
        <p className={cn("mt-1 text-xs text-texte/60 dark:text-rose-pale/50", selected && "pl-6")}>
          {service.duration}
        </p>
      )}
      {service.description && selected && (
        <p className={cn("mt-2 text-xs leading-relaxed text-texte/70 dark:text-rose-pale/60", selected && "pl-6")}>
          {service.description}
        </p>
      )}
    </button>
  );
}

export function ContactForm({
  servicesData,
  formspreeFormId,
  contactInfo,
}: {
  servicesData: SerializedServiceCategory[];
  formspreeFormId: string;
  contactInfo: ContactInfo;
}) {
  const {
    state,
    values,
    errors,
    setField,
    blur,
    setCategory,
    selectService,
    nextStep,
    prevStep,
    onSubmit,
    fieldError,
    categoryServices,
  } = useContactForm({ servicesData, formspreeFormId });

  return (
    <div className="bg-white/70 dark:bg-[#2a1a1d]/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-or/20 dark:border-or/30 p-4 sm:p-6 md:p-10 shadow-[const(--ombre-carte)]">
      <h3 className="font-display text-2xl sm:text-3xl text-anthracite dark:text-rose-pale text-center">
        Envoyez-moi un message
      </h3>
      <div className="ornament-line text-or my-4"><span>✦</span></div>

      {state.succeeded ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-or/30 bg-or/10 p-5 text-anthracite dark:text-rose-pale">
            <CheckCircle className="w-6 h-6 text-or shrink-0 mt-0.5" />
            <div>
              <p className="font-display italic text-lg">
                Votre demande a bien été envoyée ! Je vous répondrai très bientôt ♥
              </p>
              <p className="mt-2 text-sm text-texte/80 dark:text-rose-pale/70">
                Un récapitulatif vous est envoyé par email. Vous pouvez aussi suivre votre rendez-vous via le lien ci-dessous.
              </p>
            </div>
          </div>
          {state.trackingToken && (
            <Link
              href={`/rdv/suivi/${state.trackingToken}`}
              className="flex items-center justify-center rounded-2xl border border-or bg-white px-5 py-4 text-center text-sm font-medium text-or transition-colors hover:bg-or/5 dark:bg-[#2a1a1d]"
            >
              Voir le suivi de mon rendez-vous →
            </Link>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-6 mt-6">
          <nav aria-label="Étapes du formulaire" className="flex justify-center gap-1.5 sm:gap-2 md:gap-4">
            {contactFormSteps.map(function (s) {
              const isActive = values.step === s.num;
              const isDone = values.step > s.num;
              return (
                <div
                  key={s.num}
                  className={cn(
                    "flex flex-col items-center gap-1 text-[10px] sm:text-xs uppercase tracking-widest",
                    isActive ? "text-or" : isDone ? "text-rose-moyen" : "text-texte/50 dark:text-rose-pale/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border text-xs sm:text-sm font-medium",
                      isActive && "border-or bg-or/15",
                      isDone && "border-or/40 bg-or/10",
                      !isActive && !isDone && "border-or/20",
                    )}
                  >
                    {s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              );
            })}
          </nav>

          {values.step === 1 && (
            <div className="space-y-4">
              <p className="text-center font-display italic text-rose-sombre">
                Quelle prestation vous intéresse ?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {servicesData.map(function (cat) {
                  const Icon = resolveIcon(cat.icon);
                  const selected = values.categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as ContactCategoryId)}
                      className="text-left"
                    >
                      <Card
                        className={cn(
                          "h-full cursor-pointer text-center p-4 sm:p-6",
                          selected && categoryCardSelected,
                        )}
                        hover
                      >
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2 text-or" />
                        <p className="font-display text-base sm:text-lg text-anthracite dark:text-rose-pale">
                          {cat.title}
                        </p>
                      </Card>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCategory("autre")}
                  className="text-left col-span-2 sm:col-span-1 lg:col-span-1"
                >
                  <Card
                    className={cn(
                      "h-full cursor-pointer text-center p-4 sm:p-6",
                      values.categoryId === "autre" && categoryCardSelected,
                    )}
                    hover
                  >
                    <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2 text-or" />
                    <p className="font-display text-base sm:text-lg text-anthracite dark:text-rose-pale">
                      {autreCategory.title}
                    </p>
                  </Card>
                </button>
              </div>
              {fieldError("categoryId") && (
                <p className="text-center text-sm text-red-600 dark:text-red-400">{errors.categoryId}</p>
              )}
            </div>
          )}

          {values.step === 2 && (
            <div className="space-y-4">
              <p className="text-center font-display italic text-rose-sombre text-sm sm:text-base px-1">
                Choisissez votre prestation — {getCategoryTitle(values.categoryId, servicesData)}
              </p>
              <div className="max-h-[min(24rem,60vh)] overflow-y-auto space-y-5 pr-1 -mr-1">
                {groupServicesByCategory(categoryServices).map(function (group) {
                  return (
                    <div key={group.name}>
                      <h4 className="mb-2 px-1 text-[11px] sm:text-xs uppercase tracking-widest text-or/80 font-medium">
                        {group.name}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {group.services.map(function (service) {
                          return (
                            <ServiceOptionCard
                              key={service.id}
                              service={service}
                              selected={values.serviceId === service.id}
                              onSelect={() => selectService(service.id)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              {fieldError("serviceId") && (
                <p className="text-center text-sm text-red-600 dark:text-red-400">{errors.serviceId}</p>
              )}
            </div>
          )}

          {values.step === 3 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-or/20 bg-or/5 p-4 text-sm text-texte dark:text-rose-pale/80">
                <p>
                  <span className="font-display text-or">Prestation : </span>
                  {values.serviceLabel || getCategoryTitle(values.categoryId, servicesData)}
                </p>
              </div>
              <p className="text-center font-display italic text-rose-sombre">
                Quand souhaitez-vous venir ?
              </p>
              <SlotPicker
                value={values.date}
                onChange={(v) => setField("date", v)}
                onBlur={() => blur("date")}
                error={fieldError("date")}
              />
              <TextAreaField
                label={values.categoryId === "autre" ? "Votre demande" : "Message / précisions (optionnel)"}
                name="message"
                value={values.message}
                onChange={(v) => setField("message", v)}
                onBlur={() => blur("message")}
                error={fieldError("message")}
              />
            </div>
          )}

          {values.step === 4 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-or/20 bg-or/5 p-4 text-sm text-texte dark:text-rose-pale/80 space-y-2">
                <p>
                  <span className="font-display text-or">Prestation : </span>
                  {values.serviceLabel || getCategoryTitle(values.categoryId, servicesData)}
                </p>
                {values.date && (
                  <p>
                    <span className="font-display text-or">Créneau : </span>
                    {formatSlotLabelFromIso(values.date)}
                  </p>
                )}
              </div>
              <p className="text-center font-display italic text-rose-sombre">
                Vos coordonnées pour confirmer la réservation
              </p>
              <div className="grid md:grid-cols-2 gap-5">
                <Field
                  label="Prénom & Nom"
                  name="name"
                  type="text"
                  required
                  value={values.name}
                  onChange={(v) => setField("name", v)}
                  onBlur={() => blur("name")}
                  error={fieldError("name")}
                />
                <Field
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  required
                  value={values.phone}
                  onChange={(v) => setField("phone", v)}
                  onBlur={() => blur("phone")}
                  error={fieldError("phone")}
                />
              </div>
              <Field
                label="Email"
                name="email"
                type="email"
                required
                value={values.email}
                onChange={(v) => setField("email", v)}
                onBlur={() => blur("email")}
                error={fieldError("email")}
              />
            </div>
          )}

          {state.errors?.form && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{state.errors.form}</p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-2">
            {values.step > 1 ? (
              <Button type="button" variant="outline" size="md" onClick={prevStep} className="w-full sm:w-auto">
                ← Précédent
              </Button>
            ) : (
              <span className="hidden sm:block" />
            )}

            {values.step < 4 ? (
              <Button type="button" size="md" onClick={nextStep} className="w-full sm:w-auto sm:ml-auto">
                Suivant →
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={state.submitting} className="w-full sm:w-auto sm:ml-auto">
                {state.submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>Réserver mon créneau ♥</>
                )}
              </Button>
            )}
          </div>

          <div className="mt-2 space-y-3 border-t border-or/15 pt-5">
            <p className="text-center text-xs uppercase tracking-widest text-texte/50 dark:text-rose-pale/40">
              ou
            </p>
            <div className="flex justify-center">
              <Button
                href={contactInfo.instagramDmUrl}
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                <InstagramIcon className="w-4 h-4" />
                Réserver sur Instagram
              </Button>
            </div>
            <p className="text-center text-xs text-texte/60 dark:text-rose-pale/50 italic">
              Réponse rapide en message privé
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
