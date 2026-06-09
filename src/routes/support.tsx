import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { useLang } from "@/lib/i18n";
import { Mail, BookOpen, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — HourClips" },
      { name: "description", content: "Get help with HourClips. Email support, documentation and live chat." },
      { property: "og:title", content: "HourClips Support" },
      { property: "og:description", content: "We typically reply within 2 hours." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const { t, lang } = useLang();
  const ar = lang === "ar";
  const cards = [
    { icon: Mail, title: t("support.email"), value: "support@hourclips.com" },
    { icon: BookOpen, title: t("support.docs"), value: "docs.hourclips.com" },
    { icon: MessageCircle, title: "Live Chat", value: "9am - 9pm GMT" },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-24">
        <h1 className={`text-5xl md:text-6xl mb-4 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
          {t("support.title")}
        </h1>
        <p className={`text-muted-foreground mb-12 text-lg ${ar ? "font-arabic" : ""}`}>{t("support.sub")}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="border border-border bg-surface/60 p-8 rounded-xl hover:border-primary/50 transition-colors">
              <div className="size-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                <c.icon className="size-5 text-primary" />
              </div>
              <h3 className={`font-bold mb-2 ${ar ? "font-arabic" : ""}`}>{c.title}</h3>
              <p className="text-sm text-muted-foreground font-mono">{c.value}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
