import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AdminRole = "admin" | "moderator" | "user";
const ASSIGNABLE: AdminRole[] = ["admin", "moderator", "user"];

async function assertOwner(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "owner",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: owner role required");
}

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { roles: (data ?? []).map((r: any) => r.role as string) };
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const [projects, clips, jobs, roles, snapshots, usersList] =
      await Promise.all([
        supabaseAdmin.from("projects").select("id,status,duration_seconds,created_at,user_id"),
        supabaseAdmin.from("clips").select("id,views,platform,created_at"),
        supabaseAdmin.from("jobs").select("id,status,type,created_at"),
        supabaseAdmin.from("user_roles").select("user_id,role,created_at"),
        supabaseAdmin.from("app_snapshots").select("id,version,label,size_bytes,archive_name,created_at").order("created_at", { ascending: false }),
        supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      ]);

    const projectRows = projects.data ?? [];
    const clipRows = clips.data ?? [];
    const jobRows = jobs.data ?? [];
    const roleRows = roles.data ?? [];
    const snapRows = snapshots.data ?? [];
    const authUsers = usersList.data?.users ?? [];

    const totalSeconds = projectRows.reduce(
      (a: number, p: any) => a + (p.duration_seconds ?? 0),
      0,
    );
    const totalViews = clipRows.reduce(
      (a: number, c: any) => a + (c.views ?? 0),
      0,
    );

    const platformBreakdown: Record<string, number> = {};
    for (const c of clipRows as any[]) {
      const k = c.platform ?? "other";
      platformBreakdown[k] = (platformBreakdown[k] ?? 0) + 1;
    }

    const statusBreakdown: Record<string, number> = {};
    for (const p of projectRows as any[]) {
      statusBreakdown[p.status] = (statusBreakdown[p.status] ?? 0) + 1;
    }

    const rolesByUser: Record<string, string[]> = {};
    for (const r of roleRows as any[]) {
      (rolesByUser[r.user_id] ??= []).push(r.role);
    }

    const projectsByUser: Record<string, number> = {};
    for (const p of projectRows as any[]) {
      projectsByUser[p.user_id] = (projectsByUser[p.user_id] ?? 0) + 1;
    }

    const users = authUsers.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      provider: (u.app_metadata as any)?.provider ?? "email",
      roles: (rolesByUser[u.id] ?? []).sort(),
      projects_count: projectsByUser[u.id] ?? 0,
    }));

    // Signups last 14 days
    const days = 14;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const signupSeries: { date: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10);
      signupSeries.push({ date: key, count: 0 });
    }
    for (const u of authUsers) {
      const key = (u.created_at ?? "").slice(0, 10);
      const slot = signupSeries.find((s) => s.date === key);
      if (slot) slot.count += 1;
    }

    return {
      kpis: {
        users: authUsers.length,
        projects: projectRows.length,
        clips: clipRows.length,
        jobs: jobRows.length,
        hours_processed: +(totalSeconds / 3600).toFixed(2),
        total_views: totalViews,
      },
      statusBreakdown,
      platformBreakdown,
      signupSeries,
      users,
      snapshots: snapRows,
    };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { user_id: string; role: AdminRole; enabled: boolean }) => {
      if (!input?.user_id) throw new Error("user_id required");
      if (!ASSIGNABLE.includes(input.role))
        throw new Error("Role not assignable");
      return input;
    },
  )
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    if (data.enabled) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert(
          { user_id: data.user_id, role: data.role },
          { onConflict: "user_id,role" },
        );
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.user_id)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { user_id: string }) => {
    if (!input?.user_id) throw new Error("user_id required");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertOwner(context.supabase, context.userId);
    if (data.user_id === context.userId)
      throw new Error("You cannot delete your own account here");
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
