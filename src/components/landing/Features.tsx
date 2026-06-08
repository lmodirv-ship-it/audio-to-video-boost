import { useLang } from "@/lib/i18n";

export function Features() {
  const { t, lang } = useLang();
  const items = [
    { tag: t("features.f1.tag"), title: t("features.f1.title"), body: t("features.f1.body") },
    { tag: t("features.f2.tag"), title: t("features.f2.title"), body: t("features.f2.body") },
    { tag: t("features.f3.tag"), title: t("features.f3.title"), body: t("features.f3.body") },
  ];

  return (
    <section id="features" className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className={`text-4xl md:text-5xl ${lang === "ar" ? "font-arabic font-bold" : "font-display uppercase"}`}>
            {t("features.heading")}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
          {items.map((it) => (
            <div key={it.tag} className="bg-background p-10 hover:bg-surface transition-colors">
              <div className="font-mono text-primary text-xs mb-6 tracking-wider">{it.tag}</div>
              <h3 className={`text-3xl mb-4 ${lang === "ar" ? "font-arabic font-bold" : "font-display uppercase"}`}>
                {it.title}
              </h3>
              <p className={`text-muted-foreground leading-relaxed ${lang === "ar" ? "font-arabic" : ""}`}>
                {it.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
