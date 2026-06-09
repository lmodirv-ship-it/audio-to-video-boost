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

export async function listClips(): Promise<Clip[]> {
  const { data, error } = await supabase
    .from("clips")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Clip[];
}

export async function createProject(input: {
  title: string;
  source_type: "upload" | "youtube";
  source_url?: string | null;
  language?: string;
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
      status: "processing",
    })
    .select("*")
    .single();
  if (error) throw error;

  // Seed a few demo clips so UI feels alive without a render backend
  const platforms = ["tiktok", "reels", "shorts"] as const;
  const seeds = Array.from({ length: 6 }).map((_, i) => ({
    project_id: data.id,
    user_id: uid,
    title: `${input.title} — Highlight ${i + 1}`,
    duration_seconds: 30 + ((i * 7) % 60),
    platform: platforms[i % platforms.length],
    views: Math.floor(Math.random() * 25000),
    start_seconds: i * 60,
    end_seconds: i * 60 + 45,
  }));
  await supabase.from("clips").insert(seeds);
  await supabase
    .from("projects")
    .update({ status: "ready", clips_count: seeds.length })
    .eq("id", data.id);

  return data as Project;
}

export function formatDuration(sec?: number | null): string {
  if (!sec && sec !== 0) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
