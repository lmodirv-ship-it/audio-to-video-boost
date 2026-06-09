import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — HourClips" },
      { name: "description", content: "Simple, scalable pricing for podcasters and creators. Free, Pro and Studio plans." },
      { property: "og:title", content: "HourClips Pricing" },
      { property: "og:description", content: "From free to studio — plans that scale with your podcast." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="pt-12"><Pricing /><FAQ /></main>
      <Footer />
    </div>
  ),
});
