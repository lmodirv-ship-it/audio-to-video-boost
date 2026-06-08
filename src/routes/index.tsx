import { createFileRoute } from "@tanstack/react-router";
import { LangProvider } from "@/lib/i18n";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HourClips — Turn long podcasts into viral video clips" },
      {
        name: "description",
        content:
          "Upload a 1-hour podcast. Get a YouTube-ready video with animated waveform, AI subtitles, and 5 vertical shorts — in minutes.",
      },
      { property: "og:title", content: "HourClips — Long audio into viral content" },
      {
        property: "og:description",
        content:
          "Animated waveform videos + AI subtitles + auto-generated shorts for podcasters. Bilingual Arabic & English.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <LangProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <Nav />
        <main>
          <Hero />
          <Features />
          <Pricing />
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
