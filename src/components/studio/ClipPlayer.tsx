import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, Download, Share2, Loader2 } from "lucide-react";
import { getSignedUrl, formatDuration, incrementClipView, type Clip } from "@/lib/db";
import { toast } from "sonner";

export function ClipPlayer({ clip, onClose, ar }: { clip: Clip; onClose: () => void; ar: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const u = clip.video_url ? await getSignedUrl(clip.video_url) : null;
      if (active) setUrl(u);
    })();
    incrementClipView(clip.id, clip.views).catch(() => {});
    return () => { active = false; };
  }, [clip.id]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !url) return;
    const onLoaded = () => {
      if (clip.start_seconds != null) v.currentTime = clip.start_seconds;
    };
    const onTime = () => {
      if (clip.end_seconds != null && v.currentTime >= clip.end_seconds) {
        v.pause();
        setPlaying(false);
      }
    };
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
    };
  }, [url, clip.start_seconds, clip.end_seconds]);

  async function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { await v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }

  async function download() {
    if (!url) return;
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${clip.title.replace(/[^a-z0-9-_]/gi, "_")}.mp4`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success(ar ? "تم التحميل" : "Downloaded");
    } catch {
      toast.error(ar ? "تعذر التحميل" : "Download failed");
    } finally {
      setDownloading(false);
    }
  }

  async function share() {
    if (!url) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: clip.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(ar ? "تم نسخ الرابط" : "Link copied");
      }
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-surface border border-border rounded-2xl overflow-hidden max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-bold truncate flex-1">{clip.title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>
        <div className="aspect-[9/16] bg-black relative">
          {url ? (
            <video
              ref={videoRef}
              src={url}
              className="w-full h-full object-contain"
              onClick={togglePlay}
              playsInline
              controls
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              {clip.video_url ? <Loader2 className="size-6 animate-spin" /> : (ar ? "لا يوجد مصدر فيديو" : "No video source")}
            </div>
          )}
        </div>
        <div className="p-4 flex items-center gap-2 text-xs">
          <span className="font-mono text-muted-foreground">
            {formatDuration(clip.start_seconds)} → {formatDuration(clip.end_seconds)}
          </span>
          <div className="flex-1" />
          <button onClick={togglePlay} disabled={!url} className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40">
            {playing ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
          </button>
          <button onClick={download} disabled={!url || downloading} className="size-9 rounded-full border border-border flex items-center justify-center hover:border-primary disabled:opacity-40">
            {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          </button>
          <button onClick={share} disabled={!url} className="size-9 rounded-full border border-border flex items-center justify-center hover:border-primary disabled:opacity-40">
            <Share2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
