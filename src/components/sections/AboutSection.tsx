"use client";

import { Card } from "@/components/lb/card";
import { SectionTitle } from "@/components/lb/section-title";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { resolveIcon } from "@/lib/icons";
import type { AboutContent, SerializedAboutFeature } from "@/types";

export function AboutSection({
  about,
  features,
}: {
  about: AboutContent;
  features: SerializedAboutFeature[];
}) {
  const ref = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="presentation" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle eyebrow={about.eyebrow} title={about.title} />

        <p className="text-center max-w-2xl mx-auto text-lg leading-relaxed text-texte/90 dark:text-rose-pale/80 mb-16">
          {about.intro}
        </p>

        <div ref={ref} className="reveal stagger grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(function (f) {
            const Icon = resolveIcon(f.icon);
            return (
              <Card key={f.title} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-or-clair to-or text-white">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-anthracite dark:text-rose-pale mb-2">{f.title}</h3>
                <p className="text-sm text-texte/80 dark:text-rose-pale/70 leading-relaxed">{f.text}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
