import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  user_id: string;
  title: string;
  source_type: "upload" | "youtube";
  source_url: string | null;
  duration_seconds: number | null;
  language: string | null;
  status: "queued" | "processing" | "ready" | "failed";
  clips_count: number;
  thumbnail_url: string | null;
  error_message: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type Clip = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  transcript: string | null;
  duration_seconds: number | null;
  video_url: string | null;
  thumbnail_url: string | null;
  platform: "tiktok" | "reels" | "shorts" | "other" | null;
  views: number;
  start_seconds: number | null;
  end_seconds: number | null;
  published: boolean;
  clipped_url: string | null;
  created_at: string;
};

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Project) ?? null;
}

export async function listClips(projectId?: string): Promise<Clip[]> {
  let q = supabase.from("clips").select("*").order("created_at", { ascending: false });
  if (projectId) q = q.eq("project_id", projectId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Clip[];
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function getSignedUrl(path: string, expiresIn = 60 * 60): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path; // already absolute (e.g. youtube)
  const { data, error } = await supabase.storage.from("media").createSignedUrl(path, expiresIn);
  if (error) return null;
  return data.signedUrl;
}

export async function uploadMedia(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ path: string; duration: number | null }> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) throw new Error("Not authenticated");
  const path = `${uid}/${Date.now()}_${safeFileName(file.name)}`;

  // Best-effort progress: fetch upload doesn't expose progress in supabase-js v2,
  // so we simulate a 0→90 ramp while the upload is in flight.
  let cancelled = false;
  if (onProgress) {
    let p = 0;
    const tick = () => {
      if (cancelled) return;
      p = Math.min(90, p + 5);
      onProgress(p);
      setTimeout(tick, 250);
    };
    tick();
  }

  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  cancelled = true;
  if (error) throw error;
  onProgress?.(100);

  // Try to read duration from a temporary blob URL
  const duration = await probeDuration(file).catch(() => null);
  return { path, duration };
}

function probeDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);
    const url = URL.createObjectURL(file);
    const el = file.type.startsWith("video")
      ? document.createElement("video")
      : document.createElement("audio");
    el.preload = "metadata";
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(el.duration) ? Math.round(el.duration) : null);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    el.src = url;
  });
}

export async function createProject(input: {
  title: string;
  source_type: "upload" | "youtube";
  source_url?: string | null;
  language?: string;
  duration_seconds?: number | null;
}): Promise<Project> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: uid,
      title: input.title,
      source_type: input.source_type,
      source_url: input.source_url ?? null,
      language: input.language ?? "en",
      duration_seconds: input.duration_seconds ?? null,
      status: "processing",
    })
    .select("*")
    .single();
  if (error) throw error;

  // Auto-generate clip timeline from duration when known, else short defaults.
  const total = input.duration_seconds ?? 360;
  const clipCount = Math.max(3, Math.min(12, Math.floor(total / 45)));
  const segLen = Math.floor(total / clipCount);
  const platforms = ["tiktok", "reels", "shorts"] as const;
  const seeds = Array.from({ length: clipCount }).map((_, i) => {
    const start = i * segLen;
    const end = Math.min(total, start + Math.min(segLen, 60));
    return {
      project_id: data.id,
      user_id: uid,
      title: `${input.title} — Highlight ${i + 1}`,
      duration_seconds: end - start,
      platform: platforms[i % platforms.length],
      views: 0,
      start_seconds: start,
      end_seconds: end,
      video_url: input.source_url ?? null,
    };
  });
  await supabase.from("clips").insert(seeds);
  await supabase
    .from("projects")
    .update({ status: "ready", clips_count: seeds.length })
    .eq("id", data.id);

  return data as Project;
}

export async function deleteProject(id: string): Promise<void> {
  // Storage object cleanup (best-effort, only for upload sources stored in our bucket)
  const { data: p } = await supabase.from("projects").select("source_url,source_type").eq("id", id).maybeSingle();
  if (p?.source_type === "upload" && p.source_url) {
    await supabase.storage.from("media").remove([p.source_url]).catch(() => {});
  }
  await supabase.from("clips").delete().eq("project_id", id);
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteClip(id: string): Promise<void> {
  const { error } = await supabase.from("clips").delete().eq("id", id);
  if (error) throw error;
}

export async function updateClip(id: string, patch: Partial<Clip>): Promise<void> {
  const { error } = await supabase.from("clips").update(patch).eq("id", id);
  if (error) throw error;
}

export async function incrementClipView(id: string, current: number): Promise<void> {
  await supabase.from("clips").update({ views: current + 1 }).eq("id", id);
}

export function formatDuration(sec?: number | null): string {
  if (sec == null) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
