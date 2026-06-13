"use client"

import { Home, ShieldCheck, Leaf, MessageCircle, type LucideIcon } from "lucide-react";
import { Card } from "@/components/lb/card";
import { SectionTitle } from "@/components/lb/section-title";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Feature {
  icon: LucideIcon;
  title: string;
  text: string;
}

const features: Feature[] = [
  { icon: Home, title: "À domicile", text: "Chez moi, dans un espace dédié rien que pour vous" },
  { icon: ShieldCheck, title: "Hygiène irréprochable", text: "Matériel désinfecté et normes d'hygiène respectées" },
  { icon: Leaf, title: "Produits de qualité", text: "Des produits sélectionnés avec soin pour votre confort" },
  { icon: MessageCircle, title: "Conseils personnalisés", text: "À l'écoute de vos besoins pour un résultat à votre image" },
];

export function AboutSection() {
  const ref = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="presentation" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle eyebrow="Bienvenue" title="Un cocon dédié à votre beauté" />

        <p className="text-center max-w-2xl mx-auto text-lg leading-relaxed text-texte/90 dark:text-rose-pale/80 mb-16">
          Je vous accueille chez moi dans un espace cocooning, dédié à votre bien-être
          et votre beauté. Prenez du temps pour vous, dans une ambiance chaleureuse,
          professionnelle et personnalisée.
        </p>

        <div ref={ref} className="reveal stagger grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-or-clair to-or text-white">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl text-anthracite dark:text-rose-pale mb-2">{f.title}</h3>
              <p className="text-sm text-texte/80 dark:text-rose-pale/70 leading-relaxed">{f.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}