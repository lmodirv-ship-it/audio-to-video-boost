import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/DashShell";
import { useLang } from "@/lib/i18n";
import { useState } from "react";
import { UploadCloud, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createProject, uploadMedia } from "@/lib/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({ meta: [{ title: "Upload — HourClips" }] }),
  component: UploadPage,
});

function UploadPage() {
  const { t, lang } = useLang();
  const ar = lang === "ar";
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "uploading" | "processing">("idle");
  const navigate = useNavigate();
  const qc = useQueryClient();

  const youtubeMutation = useMutation({
    mutationFn: async () => {
      setStage("processing");
      return createProject({
        title: ar ? "حلقة من يوتيوب" : "YouTube Episode",
        source_type: "youtube",
        source_url: url,
        language: lang,
      });
    },
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["clips"] });
      toast.success(ar ? "تم إنشاء المشروع" : "Project created");
      navigate({ to: "/projects/$id", params: { id: p.id } });
    },
    onError: (e: Error) => {
      toast.error(e.message);
      setStage("idle");
    },
  });

  async function handleFile(file: File) {
    try {
      setStage("uploading");
      setProgress(0);
      const { path, duration } = await uploadMedia(file, setProgress);
      setStage("processing");
      const p = await createProject({
        title: file.name.replace(/\.[^.]+$/, ""),
        source_type: "upload",
        source_url: path,
        language: lang,
        duration_seconds: duration,
      });
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["clips"] });
      toast.success(ar ? "تم الرفع والمعالجة" : "Uploaded and processed");
      navigate({ to: "/projects/$id", params: { id: p.id } });
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
      setStage("idle");
    }
  }

  const busy = stage !== "idle" || youtubeMutation.isPending;

  return (
    <DashShell>
      <h1 className={`text-3xl md:text-4xl mb-8 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
        {t("upload.title")}
      </h1>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f && !busy) handleFile(f);
        }}
        className={`border-2 border-dashed rounded-2xl p-16 text-center transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-border bg-surface/40"
        }`}
      >
        <div className="mx-auto mb-6 size-16 rounded-2xl bg-primary/10 border border-primary/40 flex items-center justify-center">
          {busy ? <Loader2 className="size-7 text-primary animate-spin" /> : <UploadCloud className="size-7 text-primary" />}
        </div>
        <p className={`text-lg mb-2 ${ar ? "font-arabic" : ""}`}>{t("upload.drop")}</p>
        <p className={`text-sm text-muted-foreground mb-6 ${ar ? "font-arabic" : ""}`}>
          MP3, MP4, WAV, M4A — {ar ? "حتى ٢ جيجابايت" : "up to 2 GB"}
        </p>

        {stage === "uploading" && (
          <div className="max-w-sm mx-auto mb-6">
            <div className="h-2 bg-background border border-border rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-2">{progress}%</p>
          </div>
        )}
        {stage === "processing" && (
          <p className="text-xs font-mono text-primary mb-6 animate-pulse">
            {ar ? "جاري توليد المقاطع…" : "Generating clips…"}
          </p>
        )}

        <label className={`bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-tighter text-sm hover:brightness-110 transition-all rounded-lg cursor-pointer inline-block ${busy ? "opacity-50 pointer-events-none" : ""}`}>
          {ar ? "اختر ملف" : "Choose File"}
          <input
            type="file"
            className="hidden"
            disabled={busy}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            accept="audio/*,video/*"
          />
        </label>
      </div>

      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className={`text-xs uppercase tracking-widest text-muted-foreground ${ar ? "font-arabic" : "font-mono"}`}>{t("upload.or")}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="border border-border bg-surface/50 rounded-xl p-6">
        <label className={`text-xs uppercase tracking-widest text-muted-foreground mb-2 block ${ar ? "font-arabic" : "font-mono"}`}>
          YouTube URL
        </label>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-background border border-border rounded-lg px-4">
            <Link2 className="size-4 text-muted-foreground" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 bg-transparent py-3 outline-none text-sm"
            />
          </div>
          <button
            onClick={() => youtubeMutation.mutate()}
            disabled={!url || busy}
            className="bg-primary text-primary-foreground px-6 font-bold uppercase tracking-tighter text-sm hover:brightness-110 transition-all rounded-lg disabled:opacity-40 inline-flex items-center gap-2"
          >
            {youtubeMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            {t("upload.btn")}
          </button>
        </div>
      </div>
    </DashShell>
  );
}
