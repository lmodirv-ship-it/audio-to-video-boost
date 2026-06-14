import { createFileRoute, Link } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/DashShell";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { Upload, Film, Clock, TrendingUp, Plus, Play, Inbox } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listProjects, listClips, formatDuration } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — HourClips" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { t, lang } = useLang();
  const ar = lang === "ar";
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

  const projectsQ = useQuery({ queryKey: ["projects"], queryFn: listProjects });
  const clipsQ = useQuery({ queryKey: ["clips"], queryFn: () => listClips() });

  const projects = projectsQ.data ?? [];
  const clips = clipsQ.data ?? [];
  const totalSeconds = projects.reduce((acc, p) => acc + (p.duration_seconds ?? 0), 0);
  const totalViews = clips.reduce((acc, c) => acc + (c.views ?? 0), 0);

  const stats = [
    { icon: Film, label: ar ? "إجمالي الحلقات" : "Total Episodes", value: String(projects.length) },
    { icon: Upload, label: ar ? "المقاطع المنشأة" : "Clips Generated", value: String(clips.length) },
    { icon: Clock, label: ar ? "ساعات معالجة" : "Hours Processed", value: (totalSeconds / 3600).toFixed(1) },
    { icon: TrendingUp, label: ar ? "إجمالي المشاهدات" : "Total Views", value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : String(totalViews) },
  ];

  const recent = projects.slice(0, 5);

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

      <div className="border border-border bg-surface/50 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className={`text-lg font-bold ${ar ? "font-arabic" : ""}`}>
            {ar ? "المشاريع الأخيرة" : "Recent Projects"}
          </h2>
          <Link to="/clips" className="text-xs font-mono uppercase text-primary hover:underline">
            {ar ? "عرض الكل" : "View all"}
          </Link>
        </div>

        {projectsQ.isLoading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">{ar ? "جاري التحميل…" : "Loading…"}</div>
        ) : recent.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="size-10 mx-auto text-muted-foreground mb-3" />
            <p className={`text-muted-foreground mb-4 ${ar ? "font-arabic" : ""}`}>
              {ar ? "لا توجد مشاريع بعد. ابدأ برفع حلقة." : "No projects yet. Upload your first episode."}
            </p>
            <Link to="/upload" className="text-primary text-sm font-mono uppercase hover:underline">
              {ar ? "+ ابدأ" : "+ Get started"}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((p) => (
              <div key={p.id} className="p-5 flex items-center gap-4 hover:bg-background/40 transition-colors">
                <div className="size-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Play className="size-4 text-primary fill-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${ar ? "font-arabic" : ""}`}>{p.title}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {new Date(p.created_at).toLocaleDateString()} · {formatDuration(p.duration_seconds)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground hidden sm:block">
                  {p.clips_count} {ar ? "مقطع" : "clips"}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 rounded-full ${
                    p.status === "ready"
                      ? "bg-green-500/10 text-green-500 border border-green-500/30"
                      : p.status === "failed"
                      ? "bg-red-500/10 text-red-500 border border-red-500/30"
                      : "bg-primary/10 text-primary border border-primary/30 animate-pulse"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashShell>
  );
}
