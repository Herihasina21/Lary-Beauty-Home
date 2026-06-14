import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { SectionDivider } from "@/components/SectionDivider";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
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