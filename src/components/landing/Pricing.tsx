import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Check } from "lucide-react";

export function Pricing() {
  const { t, lang } = useLang();
  const ar = lang === "ar";

  const tiers = [
    {
      name: t("pricing.tier.free"),
      price: "$0",
      features: ar
        ? ["١٠ دقائق شهرياً", "جودة 720p", "علامة مائية", "تصدير TikTok / Reels"]
        : lang === "fr"
        ? ["10 min/mois", "Qualité 720p", "Filigrane", "Export TikTok / Reels"]
        : ["10 mins / month", "720p Resolution", "HourClips Watermark", "TikTok / Reels export"],
      cta: t("pricing.cta.free"),
      featured: false,
    },
    {
      name: t("pricing.tier.pro"),
      price: "$29",
      features: ar
        ? ["٣ ساعات شهرياً", "جودة 1080p", "بدون علامة مائية", "ترجمة ثنائية اللغة", "جدولة النشر"]
        : lang === "fr"
        ? ["3h/mois", "Qualité 1080p", "Sans filigrane", "Sous-titres multilingues", "Planification"]
        : ["3 hours / month", "1080p Resolution", "No Watermark", "Bilingual Subtitles", "Scheduled publishing"],
      cta: t("pricing.cta.pro"),
      featured: true,
    },
    {
      name: t("pricing.tier.studio"),
      price: "$49",
      features: ar
        ? ["٢٠ ساعة شهرياً", "جودة 4K", "مقاطع AI تلقائية", "أولوية معالجة", "API"]
        : lang === "fr"
        ? ["20h/mois", "Qualité 4K", "Clips IA auto", "File prioritaire", "Accès API"]
        : ["20 hours / month", "4K Resolution", "Auto AI Shorts", "Priority Queue", "API Access"],
      cta: t("pricing.cta.studio"),
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className={`text-5xl md:text-6xl mb-4 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
            {t("pricing.heading")}
          </h2>
          <p className={`text-muted-foreground ${ar ? "font-arabic" : "font-mono text-xs uppercase tracking-[0.3em]"}`}>
            {t("pricing.sub")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 flex flex-col rounded-2xl ${
                tier.featured
                  ? "border-2 border-primary bg-gradient-to-b from-primary/10 to-background shadow-[0_0_50px_-15px_var(--primary)]"
                  : "border border-border bg-surface/50"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 font-mono text-[9px] text-primary-foreground uppercase tracking-tighter rounded-full">
                  {t("pricing.recommended")}
                </div>
              )}
              <h3 className={`text-2xl mb-2 ${ar ? "font-arabic font-bold" : "font-display uppercase"} ${tier.featured ? "text-primary" : ""}`}>
                {tier.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display text-5xl">{tier.price}</span>
                <span className={`text-sm text-muted-foreground ${ar ? "font-arabic" : ""}`}>{t("pricing.month")}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow text-sm">
                {tier.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 ${ar ? "font-arabic" : ""}`}>
                    <Check className="size-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`w-full py-3.5 font-bold uppercase tracking-tighter text-center transition-all rounded-lg ${
                  tier.featured
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border border-border hover:bg-surface"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
