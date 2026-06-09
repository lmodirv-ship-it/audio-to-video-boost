import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/DashShell";
import { useLang } from "@/lib/i18n";
import { useState } from "react";
import { UploadCloud, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createProject } from "@/lib/db";
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
  const navigate = useNavigate();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["clips"] });
      toast.success(ar ? "تم إنشاء المشروع وتوليد المقاطع" : "Project created and clips generated");
      navigate({ to: "/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleFile(file: File) {
    mutation.mutate({
      title: file.name.replace(/\.[^.]+$/, ""),
      source_type: "upload",
      source_url: null,
      language: lang,
    });
  }

  function handleYoutube() {
    if (!url) return;
    const title = ar ? "حلقة من يوتيوب" : "YouTube Episode";
    mutation.mutate({ title, source_type: "youtube", source_url: url, language: lang });
  }

  const busy = mutation.isPending;

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
          if (f) handleFile(f);
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
        <label className="bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-tighter text-sm hover:brightness-110 transition-all rounded-lg cursor-pointer inline-block">
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
            onClick={handleYoutube}
            disabled={!url || busy}
            className="bg-primary text-primary-foreground px-6 font-bold uppercase tracking-tighter text-sm hover:brightness-110 transition-all rounded-lg disabled:opacity-40 inline-flex items-center gap-2"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            {t("upload.btn")}
          </button>
        </div>
      </div>
    </DashShell>
  );
}
