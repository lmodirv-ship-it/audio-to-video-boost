import { createFileRoute, Link } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/DashShell";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { Upload, Film, Clock, TrendingUp, Plus, Play } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — HourClips" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { t, lang } = useLang();
  const ar = lang === "ar";
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  const stats = [
    { icon: Film, label: ar ? "إجمالي الحلقات" : "Total Episodes", value: "12" },
    { icon: Upload, label: ar ? "المقاطع المنشأة" : "Clips Generated", value: "147" },
    { icon: Clock, label: ar ? "ساعات معالجة" : "Hours Processed", value: "23.5" },
    { icon: TrendingUp, label: ar ? "إجمالي المشاهدات" : "Total Views", value: "284K" },
  ];

  const projects = [
    { name: ar ? "حلقة: مستقبل الذكاء الاصطناعي" : "Ep: Future of AI", date: "Jun 8, 2026", clips: 12, status: "ready" },
    { name: ar ? "حلقة: العمل في 2026" : "Ep: Work in 2026", date: "Jun 5, 2026", clips: 8, status: "ready" },
    { name: ar ? "حلقة: التسويق بالمحتوى" : "Ep: Content Marketing", date: "Jun 2, 2026", clips: 0, status: "processing" },
    { name: ar ? "حلقة: بناء علامة شخصية" : "Ep: Personal Branding", date: "May 28, 2026", clips: 15, status: "ready" },
  ];

  return (
    <DashShell>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className={`text-xs uppercase tracking-widest text-muted-foreground mb-1 ${ar ? "font-arabic tracking-normal" : "font-mono"}`}>
            {t("dash.welcome")}, {name}
          </p>
          <h1 className={`text-3xl md:text-4xl ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
            {t("dash.title")}
          </h1>
        </div>
        <Link
          to="/upload"
          className="bg-primary text-primary-foreground px-5 py-3 font-bold uppercase tracking-tighter text-sm hover:brightness-110 transition-all inline-flex items-center gap-2 rounded-lg shadow-[0_0_25px_-8px_var(--primary)]"
        >
          <Plus className="size-4" />
          {t("dash.upload")}
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="border border-border bg-surface/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon className="size-5 text-primary" />
            </div>
            <div className="font-display text-3xl mb-1">{s.value}</div>
            <div className={`text-xs text-muted-foreground ${ar ? "font-arabic" : "uppercase tracking-wider font-mono"}`}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Projects table */}
      <div className="border border-border bg-surface/50 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className={`text-lg font-bold ${ar ? "font-arabic" : ""}`}>
            {ar ? "المشاريع الأخيرة" : "Recent Projects"}
          </h2>
          <Link to="/clips" className="text-xs font-mono uppercase text-primary hover:underline">
            {ar ? "عرض الكل" : "View all"}
          </Link>
        </div>
        <div className="divide-y divide-border">
          {projects.map((p, i) => (
            <div key={i} className="p-5 flex items-center gap-4 hover:bg-background/40 transition-colors">
              <div className="size-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Play className="size-4 text-primary fill-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${ar ? "font-arabic" : ""}`}>{p.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{p.date}</div>
              </div>
              <div className="text-sm text-muted-foreground hidden sm:block">
                {p.clips} {ar ? "مقطع" : "clips"}
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 rounded-full ${
                  p.status === "ready"
                    ? "bg-green-500/10 text-green-500 border border-green-500/30"
                    : "bg-primary/10 text-primary border border-primary/30 animate-pulse"
                }`}
              >
                {p.status === "ready" ? (ar ? "جاهز" : "Ready") : (ar ? "معالجة" : "Processing")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashShell>
  );
}
