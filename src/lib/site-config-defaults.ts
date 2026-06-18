import { defaultAbout, defaultHero } from "@/data/home";
import { bookingQuote } from "@/data/booking";
import { contactInfo, FORMSPREE_FORM_ID } from "@/data/contact";

export function buildDefaultSiteConfig() {
  return {
    id: 1 as const,
    phone: contactInfo.phone,
    email: contactInfo.email,
    address: contactInfo.address,
    instagram: contactInfo.instagram,
    facebook: contactInfo.facebook,
    tiktok: contactInfo.tiktok,
    instagramUrl: contactInfo.instagramUrl,
    instagramDmUrl: contactInfo.instagramDmUrl,
    facebookUrl: contactInfo.facebookUrl,
    tiktokUrl: contactInfo.tiktokUrl,
    formspreeFormId: FORMSPREE_FORM_ID === "XXXX" ? null : FORMSPREE_FORM_ID,
    bookingQuote,
    heroEyebrow: defaultHero.eyebrow,
    heroTitle: defaultHero.title,
    heroSubtitle: defaultHero.subtitle,
    heroPromoBadge: defaultHero.promoBadge,
    heroCtaLabel: defaultHero.ctaLabel,
    heroCtaHref: defaultHero.ctaHref,
    aboutEyebrow: defaultAbout.eyebrow,
    aboutTitle: defaultAbout.title,
    aboutIntro: defaultAbout.intro,
  };
}
