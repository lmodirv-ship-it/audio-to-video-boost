import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/DashShell";
import { useLang } from "@/lib/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProject, getProject, listClips, formatDuration, type Clip } from "@/lib/db";
import { ArrowLeft, Trash2, Play, Inbox } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ClipPlayer } from "@/components/studio/ClipPlayer";

export const Route = createFileRoute("/_authenticated/projects/$id")({
  head: () => ({ meta: [{ title: "Project — HourClips" }] }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  const { lang } = useLang();
  const ar = lang === "ar";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [active, setActive] = useState<Clip | null>(null);

  const projectQ = useQuery({ queryKey: ["project", id], queryFn: () => getProject(id) });
  const clipsQ = useQuery({ queryKey: ["clips", id], queryFn: () => listClips(id) });

  const remove = useMutation({
    mutationFn: () => deleteProject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["clips"] });
      toast.success(ar ? "تم حذف المشروع" : "Project deleted");
      navigate({ to: "/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const p = projectQ.data;

  if (projectQ.isLoading) {
    return <DashShell><div className="p-10 text-center text-sm text-muted-foreground">{ar ? "جاري التحميل…" : "Loading…"}</div></DashShell>;
  }
  if (!p) {
    return (
      <DashShell>
        <div className="text-center p-16">
          <p className="text-muted-foreground mb-4">{ar ? "المشروع غير موجود" : "Project not found"}</p>
          <Link to="/dashboard" className="text-primary text-sm">← {ar ? "العودة" : "Back"}</Link>
        </div>
      </DashShell>
    );
  }

  const clips = clipsQ.data ?? [];

  return (
    <DashShell>
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-mono text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-3.5" /> {ar ? "العودة" : "Back"}
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div className="min-w-0">
          <h1 className={`text-3xl md:text-4xl mb-2 truncate ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
            {p.title}
          </h1>
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className={`px-2 py-1 rounded-full border ${
              p.status === "ready" ? "border-green-500/30 text-green-500 bg-green-500/10"
                : p.status === "failed" ? "border-red-500/30 text-red-500 bg-red-500/10"
                : "border-primary/30 text-primary bg-primary/10"
            }`}>{p.status}</span>
            <span>{formatDuration(p.duration_seconds)}</span>
            <span>{p.clips_count} {ar ? "مقطع" : "clips"}</span>
            <span className="uppercase">{p.source_type}</span>
          </div>
        </div>
        <button
          onClick={() => { if (confirm(ar ? "حذف المشروع وكل مقاطعه؟" : "Delete project and all its clips?")) remove.mutate(); }}
          disabled={remove.isPending}
          className="inline-flex items-center gap-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm font-mono uppercase disabled:opacity-50"
        >
          <Trash2 className="size-4" /> {ar ? "حذف" : "Delete"}
        </button>
      </div>

      {clips.length === 0 ? (
        <div className="border border-border bg-surface/50 rounded-xl p-16 text-center">
          <Inbox className="size-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{ar ? "لا مقاطع لهذا المشروع" : "No clips for this project"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {clips.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className="group text-left border border-border bg-surface/50 rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
            >
              <div className="aspect-[9/16] bg-gradient-to-br from-primary/30 via-zinc-800 to-zinc-900 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                  <div className="size-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="size-5 fill-black text-black ml-0.5" />
                  </div>
                </div>
                {c.platform && (
                  <span className="absolute top-2 left-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded uppercase">{c.platform}</span>
                )}
                <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded">
                  {formatDuration(c.duration_seconds)}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium line-clamp-2">{c.title}</h3>
                <div className="text-[10px] text-muted-foreground font-mono mt-1">
                  {formatDuration(c.start_seconds)} → {formatDuration(c.end_seconds)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {active && <ClipPlayer clip={active} onClose={() => setActive(null)} ar={ar} />}
    </DashShell>
  );
}
