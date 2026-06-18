import { Button } from "@/components/lb/button";
import { SectionTitle } from "@/components/lb/section-title";
import { ContactForm } from "@/components/sections/ContactForm";
import { InstagramIcon } from "@/components/icons/brand-icons";
import type { BookingRule, ContactInfo, SerializedServiceCategory } from "@/types";

export function BookingSection({
  bookingRules,
  bookingHighlights,
  bookingQuote,
  contactInfo,
  servicesData,
  formspreeFormId,
}: {
  bookingRules: BookingRule[];
  bookingHighlights: string[];
  bookingQuote: string;
  contactInfo: ContactInfo;
  servicesData: SerializedServiceCategory[];
  formspreeFormId: string;
}) {
  return (
    <section id="rdv" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="Réservation"
          title="Prendre rendez-vous"
          subtitle="Consultez les conditions, puis réservez votre créneau en ligne"
        />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div
            id="regles-rdv"
            className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 scroll-mt-28"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-rose-moyen mb-2">
                À savoir
              </p>
              <h3 className="font-display text-2xl text-anthracite dark:text-rose-pale">
                Conditions de réservation
              </h3>
            </div>

            <ul className="space-y-3">
              {bookingRules.map((r) => (
                <li
                  key={r.id}
                  className="flex gap-3 bg-white/60 dark:bg-[#2a1a1d]/70 backdrop-blur-sm rounded-2xl p-4 border border-or/10 dark:border-or/25"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-or-clair to-or text-white">
                    <r.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-texte dark:text-rose-pale/80 leading-relaxed">{r.text}</p>
                    {r.highlight && (
                      <p className="mt-1.5 text-sm font-display italic text-rose-sombre">{r.highlight}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <aside className="bg-white/70 dark:bg-[#2a1a1d]/80 backdrop-blur-md rounded-2xl p-6 border border-or/20">
              <h4 className="font-display italic text-xl text-or text-center">Mes prestations</h4>
              <div className="ornament-line text-or my-3"><span>✦</span></div>
              <ul className="space-y-2 mb-4">
                {bookingHighlights.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-texte dark:text-rose-pale/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-or shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="font-display italic text-sm text-rose-sombre text-center border-t border-or/20 pt-3">
                « {bookingQuote} »
              </p>
            </aside>
          </div>

          <div
            id="prendre-rdv"
            className="lg:col-span-7 scroll-mt-28"
          >
            <div className="text-center mb-6 lg:text-left">
              <p className="text-xs uppercase tracking-[0.35em] text-rose-moyen mb-2">En ligne</p>
              <h3 className="font-display text-3xl text-anthracite dark:text-rose-pale">
                Réservez votre créneau
              </h3>
              <p className="mt-2 text-sm text-texte/70 dark:text-rose-pale/60">
                Prestation, horaire et coordonnées — confirmation sous 24 à 48 h
              </p>
              <a
                href="#regles-rdv"
                className="mt-3 inline-flex text-sm text-or hover:underline lg:hidden"
              >
                ↑ Voir les conditions de réservation
              </a>
            </div>
            <ContactForm
              servicesData={servicesData}
              formspreeFormId={formspreeFormId}
              contactInfo={contactInfo}
            />
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs uppercase tracking-widest text-texte/50 dark:text-rose-pale/40 mb-4">
            ou préférez Instagram
          </p>
          <Button href={contactInfo.instagramDmUrl} variant="outline" size="md">
            <InstagramIcon className="w-4 h-4" />
            Réserver en message privé
          </Button>
          <p className="font-display italic text-rose-sombre mt-6 text-lg">
            Merci pour votre confiance !
          </p>
        </div>
      </div>
    </section>
  );
}
