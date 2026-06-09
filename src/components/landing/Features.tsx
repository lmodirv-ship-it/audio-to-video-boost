import { useLang } from "@/lib/i18n";
import { Sparkles, Type, Maximize2, CalendarClock, BarChart3, Share2 } from "lucide-react";

export function Features() {
  const { t, lang } = useLang();
  const ar = lang === "ar";
  const items = [
    { icon: Sparkles, tag: t("features.f1.tag"), title: t("features.f1.title"), body: t("features.f1.body") },
    { icon: Type, tag: t("features.f2.tag"), title: t("features.f2.title"), body: t("features.f2.body") },
    { icon: Maximize2, tag: t("features.f3.tag"), title: t("features.f3.title"), body: t("features.f3.body") },
    { icon: CalendarClock, tag: t("features.f4.tag"), title: t("features.f4.title"), body: t("features.f4.body") },
    { icon: BarChart3, tag: t("features.f5.tag"), title: t("features.f5.title"), body: t("features.f5.body") },
    { icon: Share2, tag: t("features.f6.tag"), title: t("features.f6.title"), body: t("features.f6.body") },
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-6xl ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
            {t("features.heading")}<span className="text-primary">{t("features.heading.accent")}</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it) => (
            <div
              key={it.tag}
              className="group relative bg-surface/60 border border-border rounded-xl p-7 hover:border-primary/50 transition-all hover:shadow-[0_0_30px_-10px_var(--primary)]"
            >
              <div className="size-11 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <it.icon className="size-5 text-primary" />
              </div>
              <div className={`font-mono text-primary text-[10px] mb-2 tracking-widest uppercase ${ar ? "font-arabic" : ""}`}>{it.tag}</div>
              <h3 className={`text-xl mb-3 font-bold ${ar ? "font-arabic" : ""}`}>{it.title}</h3>
              <p className={`text-sm text-muted-foreground leading-relaxed ${ar ? "font-arabic" : ""}`}>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
