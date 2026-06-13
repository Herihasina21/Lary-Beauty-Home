import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 p-8">
        <p className="text-muted-foreground">Teste Footer est en bas</p>
      </main>
      <Footer />
    </div>
  );
}