import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { SectionDivider } from "@/components/SectionDivider";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Loader } from "@/components/ui/Loader";

export const metadata: Metadata = {
  title: "Lary Beauty Home — Institut de Beauté à La Rivière Saint Louis",
  description:
    "Lary Beauty Home — Institut de beauté à domicile à La Rivière Saint Louis : ongles, épilations, soins visage. L'art de la beauté dans un cocon dédié.",
  openGraph: {
    title: "Lary Beauty Home — L'art de la beauté à domicile",
    description:
      "Ongles, épilations et soins visage dans un espace cocooning à La Rivière Saint Louis.",
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Loader />
      <Header />
      <main>
      <HeroSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <ServicesSection />
      <SectionDivider />
      <BookingSection />
      <SectionDivider />
      <ContactSection />
      </main>
      <Footer />
    </div>
  );
}