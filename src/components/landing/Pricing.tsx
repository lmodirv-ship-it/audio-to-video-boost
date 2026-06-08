import { useLang } from "@/lib/i18n";

export function Pricing() {
  const { t, lang } = useLang();
  const ar = lang === "ar";

  const tiers = [
    {
      name: t("pricing.tier.free"),
      price: "$0",
      features: ar
        ? ["١٠ دقائق شهرياً", "جودة 720p", "علامة مائية"]
        : ["10 mins / month", "720p Resolution", "HourClips Watermark"],
      cta: t("pricing.cta.free"),
      featured: false,
    },
    {
      name: t("pricing.tier.pro"),
      price: "$29",
      features: ar
        ? ["٣ ساعات شهرياً", "جودة 1080p", "بدون علامة مائية", "ترجمة ثنائية اللغة"]
        : ["3 hours / month", "1080p Resolution", "No Watermark", "Bilingual Subtitles"],
      cta: t("pricing.cta.pro"),
      featured: true,
    },
    {
      name: t("pricing.tier.studio"),
      price: "$49",
      features: ar
        ? ["٢٠ ساعة شهرياً", "جودة 4K", "مقاطع AI تلقائية", "أولوية معالجة"]
        : ["20 hours / month", "4K Resolution", "Auto AI Shorts", "Priority Queue"],
      cta: t("pricing.cta.studio"),
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-5xl md:text-6xl mb-4 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
            {t("pricing.heading")}
          </h2>
          <p className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            {t("pricing.sub")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 flex flex-col ${
                tier.featured ? "border-2 border-primary bg-background" : "border border-border"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 font-mono text-[9px] text-primary-foreground uppercase tracking-tighter">
                  {t("pricing.recommended")}
                </div>
              )}
              <div className="flex justify-between items-start mb-10">
                <h3 className={`text-3xl ${ar ? "font-arabic font-bold" : "font-display uppercase"} ${tier.featured ? "text-primary" : ""}`}>
                  {tier.name}
                </h3>
                <span className="font-display text-4xl">{tier.price}</span>
              </div>
              <ul className="space-y-3 mb-10 flex-grow text-sm font-mono">
                {tier.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 ${ar ? "font-arabic text-base" : ""}`}>
                    <span className="text-primary">[+]</span>
                    <span className={tier.featured ? "" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 font-bold uppercase tracking-tighter transition-all ${
                  tier.featured
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border border-border hover:bg-background"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
