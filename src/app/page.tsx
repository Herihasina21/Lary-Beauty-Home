import { Button } from "@/components/lb/button";
import { SectionTitle } from "@/components/lb/section-title";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <SectionTitle title="Test" subtitle="Design system LB" />
      <Button href="#test" className="mt-4">
        Bouton test
      </Button>
    </main>
  );
}