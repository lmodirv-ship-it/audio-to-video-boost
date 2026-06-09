import { createFileRoute } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/DashShell";
import { useLang } from "@/lib/i18n";
import { Play, Download, Share2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/clips")({
  head: () => ({ meta: [{ title: "Clips — HourClips" }] }),
  component: ClipsPage,
});

function ClipsPage() {
  const { t, lang } = useLang();
  const ar = lang === "ar";

  const clips = [
    { title: ar ? "أهم لحظة عن الذكاء الاصطناعي" : "Top moment on AI", duration: "00:45", platform: "TikTok", views: "12.4K" },
    { title: ar ? "نصيحة للمسوقين" : "Tip for marketers", duration: "00:58", platform: "Reels", views: "8.2K" },
    { title: ar ? "قصة نجاح" : "Success story", duration: "00:42", platform: "Shorts", views: "23.1K" },
    { title: ar ? "اقتباس قوي" : "Powerful quote", duration: "01:15", platform: "TikTok", views: "5.8K" },
    { title: ar ? "نهاية الحلقة" : "Episode ending", duration: "00:55", platform: "Reels", views: "3.4K" },
    { title: ar ? "ضحكة لا تنسى" : "Unforgettable laugh", duration: "00:32", platform: "Shorts", views: "18.9K" },
  ];

  return (
    <DashShell>
      <h1 className={`text-3xl md:text-4xl mb-8 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
        {t("clips.title")}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {clips.map((c, i) => (
          <div key={i} className="group border border-border bg-surface/50 rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
            <div className="aspect-[9/16] bg-gradient-to-br from-primary/30 via-zinc-800 to-zinc-900 relative">
              <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                <div className="size-12 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="size-5 fill-black text-black ml-0.5" />
                </div>
              </button>
              <span className="absolute top-2 left-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded">
                {c.platform}
              </span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/70 text-white px-2 py-0.5 rounded">
                {c.duration}
              </span>
            </div>
            <div className="p-3">
              <h3 className={`text-sm font-medium mb-2 line-clamp-2 ${ar ? "font-arabic" : ""}`}>{c.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{c.views}</span>
                <div className="flex gap-2">
                  <button className="hover:text-primary"><Download className="size-3.5" /></button>
                  <button className="hover:text-primary"><Share2 className="size-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashShell>
  );
}
