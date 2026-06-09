import { createFileRoute, Link } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/DashShell";
import { useLang } from "@/lib/i18n";
import { Play, Download, Share2, Inbox } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listClips, formatDuration, formatViews } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/clips")({
  head: () => ({ meta: [{ title: "Clips — HourClips" }] }),
  component: ClipsPage,
});

function ClipsPage() {
  const { t, lang } = useLang();
  const ar = lang === "ar";
  const { data: clips = [], isLoading } = useQuery({ queryKey: ["clips"], queryFn: listClips });

  return (
    <DashShell>
      <h1 className={`text-3xl md:text-4xl mb-8 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
        {t("clips.title")}
      </h1>

      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">{ar ? "جاري التحميل…" : "Loading…"}</div>
      ) : clips.length === 0 ? (
        <div className="border border-border bg-surface/50 rounded-xl p-16 text-center">
          <Inbox className="size-10 mx-auto text-muted-foreground mb-4" />
          <p className={`text-muted-foreground mb-4 ${ar ? "font-arabic" : ""}`}>
            {ar ? "لا توجد مقاطع بعد. ارفع حلقة لتوليد مقاطع." : "No clips yet. Upload an episode to generate clips."}
          </p>
          <Link to="/upload" className="text-primary text-sm font-mono uppercase hover:underline">
            {ar ? "+ رفع حلقة" : "+ Upload"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {clips.map((c) => (
            <div key={c.id} className="group border border-border bg-surface/50 rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
              <div className="aspect-[9/16] bg-gradient-to-br from-primary/30 via-zinc-800 to-zinc-900 relative">
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                  <div className="size-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="size-5 fill-black text-black ml-0.5" />
                  </div>
                </button>
                {c.platform && (
                  <span className="absolute top-2 left-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded uppercase">
                    {c.platform}
                  </span>
                )}
                <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded">
                  {formatDuration(c.duration_seconds)}
                </span>
              </div>
              <div className="p-3">
                <h3 className={`text-sm font-medium mb-2 line-clamp-2 ${ar ? "font-arabic" : ""}`}>{c.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">{formatViews(c.views)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => toast.success(ar ? "جاري التحميل" : "Downloading")} className="hover:text-primary"><Download className="size-3.5" /></button>
                    <button onClick={() => toast.success(ar ? "تم النسخ" : "Link copied")} className="hover:text-primary"><Share2 className="size-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashShell>
  );
}
