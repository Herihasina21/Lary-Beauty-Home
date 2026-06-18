import Link from "next/link";
import { Phone, Mail, MapPin, CalendarDays } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionTitle } from "@/components/lb/section-title";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons/brand-icons";
import type { ContactInfo } from "@/types";

type BrandIcon = typeof InstagramIcon;

export function ContactSection({ contactInfo }: { contactInfo: ContactInfo }) {
  const items: { icon: LucideIcon; label: string; href: string }[] = [
    {
      icon: Phone,
      label: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
    },
    { icon: Mail, label: contactInfo.email, href: `mailto:${contactInfo.email}` },
    {
      icon: MapPin,
      label: contactInfo.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`,
    },
  ];

  const socials: { icon: BrandIcon; label: string; sub: string; href: string }[] = [
    { icon: InstagramIcon, label: contactInfo.instagram, sub: "Instagram", href: contactInfo.instagramUrl },
    { icon: TikTokIcon, label: contactInfo.tiktok, sub: "TikTok", href: contactInfo.tiktokUrl },
    { icon: FacebookIcon, label: contactInfo.facebook, sub: "Facebook", href: contactInfo.facebookUrl },
  ];

  return (
    <section id="contact" className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionTitle eyebrow="Restons en lien" title="Me contacter" />

        <Link
          href="#rdv"
          className="mb-10 flex items-center justify-between gap-4 rounded-2xl border border-or/30 bg-or/10 px-5 py-4 transition-colors hover:bg-or/15 dark:bg-or/15"
        >
          <span className="flex items-center gap-3 text-left">
            <CalendarDays className="h-6 w-6 shrink-0 text-or" />
            <span>
              <span className="block font-display text-lg text-anthracite dark:text-rose-pale">
                Réserver un créneau en ligne
              </span>
              <span className="text-sm text-texte/70 dark:text-rose-pale/60">
                Prestations, horaires disponibles et confirmation
              </span>
            </span>
          </span>
          <span className="text-sm font-medium text-or shrink-0">Réserver →</span>
        </Link>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {items.map((i) => (
            <a
              key={i.label}
              href={i.href}
              target={i.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bg-white/60 dark:bg-[#2a1a1d]/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-or/10 dark:border-or/25 hover:border-or/40 hover:-translate-y-1 transition-all"
            >
              <i.icon className="w-7 h-7 mx-auto mb-3 text-or" />
              <p className="text-texte dark:text-rose-pale/80 break-words">{i.label}</p>
            </a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {socials.map((s) => (
            <a
              key={s.sub}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-or-clair to-or text-white shadow-[var(--ombre-carte)] group-hover:shadow-[var(--ombre-hover)] group-hover:-translate-y-1 transition-all">
                <s.icon className="w-7 h-7" />
              </span>
              <span className="font-display text-sm text-anthracite dark:text-rose-pale">{s.label}</span>
              <span className="text-xs uppercase tracking-widest text-rose-moyen">{s.sub}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
