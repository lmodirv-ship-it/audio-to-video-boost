import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Trust } from "@/components/landing/Trust";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HourClips — Turn podcasts into viral clips" },
      {
        name: "description",
        content:
          "Upload one podcast episode and get 50 pieces of content: short videos, quotes, subtitles, and ready-to-post snippets. Bilingual AR/EN/FR.",
      },
      { property: "og:title", content: "HourClips — Turn podcasts into viral clips" },
      {
        property: "og:description",
        content: "AI-powered podcast → short videos for TikTok, YouTube Shorts and Instagram Reels.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
