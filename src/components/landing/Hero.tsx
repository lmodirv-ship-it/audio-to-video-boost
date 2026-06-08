import { useLang } from "@/lib/i18n";
import heroEngine from "@/assets/hero-engine.jpg";

export function Hero() {
  const { t, lang } = useLang();
  return (
    <section className="relative pt-20 pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-entrance">
            <div className="flex items-center gap-3 mb-6">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                {t("hero.kicker")}
              </span>
            </div>

            {lang === "en" ? (
              <h1 className="font-display text-6xl md:text-8xl leading-[0.9] uppercase mb-8 text-balance">
                {t("hero.title.1")} <br />
                <span className="text-primary">{t("hero.title.2")}</span>
              </h1>
            ) : (
              <h1 dir="rtl" className="font-arabic text-5xl md:text-7xl font-bold leading-tight mb-8 text-balance">
                {t("hero.title.1")} <span className="text-primary">{t("hero.title.2")}</span>
              </h1>
            )}

            <p className={`text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed ${lang === "ar" ? "font-arabic" : ""}`}>
              {t("hero.sub")}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="group relative">
                <a
                  href="#pricing"
                  className="relative z-10 block bg-foreground text-background px-8 py-4 font-bold uppercase tracking-tighter text-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {t("hero.upload")}
                </a>
                <div className="absolute inset-0 translate-x-1 translate-y-1 border border-primary -z-0 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
              </div>
              <a
                href="#engine"
                className="px-8 py-4 font-mono text-sm border border-border hover:bg-surface transition-colors uppercase inline-flex items-center"
              >
                {t("hero.demo")}
              </a>
            </div>
          </div>

          <div id="engine" className="animate-entrance relative group" style={{ animationDelay: "200ms" }}>
            <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-3xl" />
            <div className="relative bg-surface border border-border rounded-xl p-4 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-red-500/30" />
                  <div className="size-2.5 rounded-full bg-yellow-500/30" />
                  <div className="size-2.5 rounded-full bg-green-500/30" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                  Render_Engine_v4.0
                </span>
              </div>
              <img
                src={heroEngine}
                alt="HourClips render engine preview showing waveform timeline and aspect ratio overlays"
                width={1280}
                height={960}
                className="w-full aspect-[4/3] object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
