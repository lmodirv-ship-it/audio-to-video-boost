import { useLang } from "@/lib/i18n";

export function Trust() {
  const { t, lang } = useLang();
  const brands = ["Spotify", "YouTube", "TikTok", "Apple Podcasts", "Anghami", "Google Podcasts"];
  return (
    <section className="py-14 px-6 border-y border-border bg-surface/40">
      <div className="max-w-7xl mx-auto">
        <p className={`text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8 ${lang === "ar" ? "font-arabic tracking-normal" : "font-mono"}`}>
          {t("trust.heading")}
        </p>
        <div className="flex flex-wrap justify-around items-center gap-8 opacity-60">
          {brands.map((b) => (
            <span key={b} className="font-display text-xl tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
