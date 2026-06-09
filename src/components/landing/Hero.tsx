import { useLang } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";
import { Sparkles, Play, Users, Zap, Clock } from "lucide-react";

export function Hero() {
  const { t, lang } = useLang();
  const ar = lang === "ar";

  const episodes = [
    { title: ar ? "مستقبل الذكاء الاصطناعي" : "The Future of AI", time: "45:32" },
    { title: ar ? "العمل في 2026" : "Work in 2026", time: "38:21" },
    { title: ar ? "التسويق بالمحتوى" : "Content Marketing", time: "29:47" },
    { title: ar ? "بناء علامة شخصية" : "Personal Branding", time: "33:10" },
  ];

  const stats = [
    { icon: Users, value: "+35K", label: t("stats.creators") },
    { icon: Zap, value: "+1.2M", label: t("stats.clips") },
    { icon: Clock, value: "97%", label: t("stats.time") },
  ];

  return (
    <section className="relative pt-16 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--primary)/0.12,_transparent_60%)]" />
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Preview Card */}
          <div className={`animate-entrance order-2 ${ar ? "lg:order-2" : "lg:order-1"}`}>
            <div className="relative">
              <div className="absolute -inset-8 bg-primary/10 rounded-3xl blur-3xl" />
              <div className="relative bg-surface/80 border border-border rounded-2xl p-5 shadow-2xl backdrop-blur">
                {/* Top: Episodes list + Player */}
                <div className="grid grid-cols-[140px_1fr] gap-3 mb-3">
                  <div className="bg-background/60 border border-border/60 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold ${ar ? "font-arabic" : ""}`}>{ar ? "الحلقات" : "Episodes"}</span>
                      <span className="size-5 rounded-md bg-primary/20 text-primary text-xs flex items-center justify-center">+</span>
                    </div>
                    <div className="space-y-2">
                      {episodes.map((ep, i) => (
                        <div key={i} className="bg-surface/80 rounded-md p-1.5 flex items-center gap-1.5">
                          <div className="size-7 rounded bg-gradient-to-br from-primary/40 to-primary/10 flex-shrink-0 flex items-center justify-center">
                            <Play className="size-2.5 text-primary fill-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`text-[9px] truncate ${ar ? "font-arabic" : ""}`}>{ep.title}</div>
                            <div className="text-[8px] font-mono text-muted-foreground">{ep.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl relative overflow-hidden min-h-[200px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22><circle cx=%221%22 cy=%221%22 r=%220.5%22 fill=%22white%22 opacity=%220.05%22/></svg>')]" />
                    <button className="relative z-10 size-14 rounded-full bg-white/90 text-black flex items-center justify-center hover:scale-110 transition-transform">
                      <Play className="size-6 fill-black ml-0.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-end gap-0.5 h-6">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-primary/80 rounded-sm"
                            style={{ height: `${20 + Math.abs(Math.sin(i * 0.5)) * 80}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 font-mono text-[10px] text-white/70">00:45</span>
                  </div>
                </div>

                {/* Bottom: Smart Clips */}
                <div className="bg-background/60 border border-border/60 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold ${ar ? "font-arabic" : ""}`}>
                      {ar ? "القصاصات الذكية" : "Smart Clips"}
                    </span>
                    <span className="text-primary text-xs">+</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["00:45", "00:58", "00:42", "01:15"].map((time, i) => (
                      <div key={i} className="aspect-[9/14] bg-gradient-to-br from-primary/30 via-surface to-zinc-800 rounded-md relative overflow-hidden">
                        <span className="absolute bottom-1 right-1 text-[8px] font-mono text-white/90">{time}</span>
                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-black/80 to-transparent" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className={`animate-entrance order-1 ${ar ? "lg:order-1 text-right" : "lg:order-2"}`}>
            <div className={`flex items-center gap-3 mb-6 ${ar ? "justify-end" : ""}`}>
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                {t("hero.kicker")}
              </span>
            </div>

            {ar ? (
              <h1 dir="rtl" className="font-arabic text-4xl md:text-6xl font-bold leading-tight mb-6 text-balance">
                {t("hero.title.1")} <span className="text-primary">{t("hero.title.2")}</span>
              </h1>
            ) : (
              <h1 className="font-display text-5xl md:text-7xl leading-[0.95] uppercase mb-6 text-balance">
                {t("hero.title.1")} <span className="text-primary">{t("hero.title.2")}</span>
              </h1>
            )}

            <p className={`text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed ${ar ? "font-arabic mr-0 ml-auto" : ""}`}>
              {t("hero.sub")}
            </p>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-3 mb-8 ${ar ? "" : ""}`}>
              {stats.map((s) => (
                <div key={s.label} className="border border-border bg-surface/50 rounded-lg p-4">
                  <s.icon className="size-4 text-primary mb-2" />
                  <div className="font-display text-2xl">{s.value}</div>
                  <div className={`text-[10px] text-muted-foreground ${ar ? "font-arabic" : "uppercase tracking-wider"}`}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className={`flex flex-wrap gap-3 ${ar ? "justify-end" : ""}`}>
              <Link
                to="/signup"
                className="bg-primary text-primary-foreground px-7 py-4 font-bold uppercase tracking-tighter text-base hover:brightness-110 transition-all inline-flex items-center gap-2 shadow-[0_0_30px_-5px_var(--primary)]"
              >
                <Sparkles className="size-4" />
                {t("hero.upload")}
              </Link>
              <a
                href="#how"
                className="px-7 py-4 font-mono text-sm border border-border hover:bg-surface transition-colors uppercase inline-flex items-center gap-2"
              >
                <Play className="size-3.5" />
                {t("hero.demo")}
              </a>
            </div>
            <p className={`mt-4 text-xs text-muted-foreground ${ar ? "font-arabic" : "font-mono"}`}>
              {t("hero.note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
