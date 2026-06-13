import { HeroSection } from "@/components/sections/HeroSection";
import { Footer } from "@/components/layout/Footer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <HeroSection />
      <div className="flex-1" />
      <Footer />
    </div>
  );
}