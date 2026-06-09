import { useLang } from "@/lib/i18n";
import { Upload, Cpu, Send } from "lucide-react";

export function HowItWorks() {
  const { t, lang } = useLang();
  const ar = lang === "ar";
  const steps = [
    { icon: Upload, title: t("how.s1.title"), body: t("how.s1.body") },
    { icon: Cpu, title: t("how.s2.title"), body: t("how.s2.body") },
    { icon: Send, title: t("how.s3.title"), body: t("how.s3.body") },
  ];
  return (
    <section id="how" className="py-24 px-6 border-t border-border bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-center text-4xl md:text-5xl mb-16 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
          {t("how.heading")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => (
            <div key={i} className="relative bg-background border border-border rounded-2xl p-8 text-center">
              <div className="mx-auto mb-6 size-16 rounded-2xl bg-primary/10 border border-primary/40 flex items-center justify-center">
                <s.icon className="size-7 text-primary" />
              </div>
              <h3 className={`text-2xl mb-3 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>{s.title}</h3>
              <p className={`text-sm text-muted-foreground ${ar ? "font-arabic" : ""}`}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
