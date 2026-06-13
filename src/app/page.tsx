import { HeroSection } from "@/components/sections/HeroSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <div className="flex-1" />
      <Footer />
    </div>
  );
}