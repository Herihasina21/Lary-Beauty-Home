import { Button } from "@/components/lb/button";
import { SectionTitle } from "@/components/lb/section-title";
import { bookingHighlights, bookingQuote, bookingRules } from "@/data/booking";
import { contactInfo } from "@/data/contact";

export function BookingSection() {
  return (
    <section id="rdv" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="Réservation"
          title="Avant de réserver"
          subtitle="Quelques mots pour un moment parfait ensemble"
        />

        <div className="grid lg:grid-cols-5 gap-8">
          <ul className="lg:col-span-3 space-y-4">
            {bookingRules.map((r) => (
              <li
                key={r.id}
                className="flex gap-4 bg-white/60 dark:bg-[#2a1a1d]/70 backdrop-blur-sm rounded-2xl p-5 border border-or/10 dark:border-or/25 hover:border-or/40 transition-all"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-or-clair to-or text-white">
                  <r.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-texte dark:text-rose-pale/80 leading-relaxed">{r.text}</p>
                  {r.highlight && (
                    <p className="mt-2 font-display italic text-rose-sombre">{r.highlight}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <aside className="lg:col-span-2 bg-white/70 dark:bg-[#2a1a1d]/80 backdrop-blur-md rounded-3xl p-8 border border-or/30 shadow-[var(--ombre-carte)] h-fit lg:sticky lg:top-28">
            <h3 className="font-display italic text-3xl text-or text-center">Mes prestations</h3>
            <div className="ornament-line text-or my-4"><span>✦</span></div>
            <ul className="space-y-3 mb-6">
              {bookingHighlights.map((p) => (
                <li key={p} className="flex items-center gap-3 text-texte dark:text-rose-pale/80">
                  <span className="h-2 w-2 rounded-full bg-or" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="font-display italic text-rose-sombre text-center border-t border-or/20 pt-4">
              « {bookingQuote} »
            </p>
          </aside>
        </div>

        <div className="mt-14 text-center">
          <Button href={contactInfo.instagramDmUrl} size="lg">
            Réserver en message privé ♥
          </Button>
          <p className="font-display italic text-rose-sombre mt-6 text-lg">
            Merci pour votre confiance !
          </p>
        </div>
      </div>
    </section>
  );
}