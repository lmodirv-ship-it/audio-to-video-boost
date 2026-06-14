import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashShell } from "@/components/dash/DashShell";
import { useLang } from "@/lib/i18n";
import { useMyRoles } from "@/lib/use-roles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminOverview,
  setUserRole,
  deleteUser,
  type AdminRole,
} from "@/lib/admin.functions";
import { toast } from "sonner";
import {
  Users,
  Film,
  Activity,
  Clock,
  TrendingUp,
  Shield,
  Search,
  Trash2,
  Crown,
  Archive,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Owner Admin — HourClips" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const { isOwner, isLoading: rolesLoading } = useMyRoles();

  const fetchOverview = useServerFn(adminOverview);
  const overviewQ = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => fetchOverview(),
    enabled: isOwner,
  });

  if (rolesLoading) {
    return (
      <DashShell>
        <div className="p-10 text-center text-sm text-muted-foreground">
          {ar ? "جاري التحميل…" : "Loading…"}
        </div>
      </DashShell>
    );
  }

  if (!isOwner) {
    return (
      <DashShell>
        <div className="max-w-md mx-auto mt-24 border border-border bg-surface/50 rounded-xl p-10 text-center">
          <Shield className="size-10 mx-auto text-muted-foreground mb-4" />
          <h1 className={`text-2xl mb-2 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
            {ar ? "ممنوع الوصول" : "Access denied"}
          </h1>
          <p className={`text-sm text-muted-foreground ${ar ? "font-arabic" : ""}`}>
            {ar
              ? "هذه الصفحة مخصصة لمالك المنصة فقط."
              : "This area is restricted to the platform owner."}
          </p>
        </div>
      </DashShell>
    );
  }

  const data = overviewQ.data;

  return (
    <DashShell>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className={`text-xs uppercase tracking-widest text-muted-foreground mb-1 ${ar ? "font-arabic tracking-normal" : "font-mono"}`}>
            {ar ? "لوحة المالك" : "Owner control"}
          </p>
          <h1 className={`text-3xl md:text-4xl ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
            {ar ? "إدارة المنصة" : "Platform Admin"}
          </h1>
        </div>
        <button
          onClick={() => overviewQ.refetch()}
          className="text-xs font-mono uppercase border border-border rounded-lg px-4 py-2 hover:bg-surface"
        >
          {ar ? "تحديث" : "Refresh"}
        </button>
      </div>

      {overviewQ.isLoading || !data ? (
        <div className="p-10 text-center text-sm text-muted-foreground">
          {ar ? "جاري التحميل…" : "Loading…"}
        </div>
      ) : (
        <div className="space-y-8">
          <Kpis ar={ar} kpis={data.kpis} />
          <Reports ar={ar} data={data} />
          <UsersTable ar={ar} users={data.users} />
          <SnapshotsList ar={ar} snapshots={data.snapshots} />
        </div>
      )}
    </DashShell>
  );
}

function Kpis({ ar, kpis }: { ar: boolean; kpis: any }) {
  const items = [
    { icon: Users, label: ar ? "المستخدمون" : "Users", value: kpis.users },
    { icon: Film, label: ar ? "المشاريع" : "Projects", value: kpis.projects },
    { icon: TrendingUp, label: ar ? "المقاطع" : "Clips", value: kpis.clips },
    { icon: Activity, label: ar ? "المهام" : "Jobs", value: kpis.jobs },
    {
      icon: Clock,
      label: ar ? "ساعات معالجة" : "Hours Processed",
      value: kpis.hours_processed,
    },
    {
      icon: TrendingUp,
      label: ar ? "المشاهدات" : "Views",
      value:
        kpis.total_views >= 1000
          ? `${(kpis.total_views / 1000).toFixed(1)}K`
          : kpis.total_views,
    },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {items.map((s) => (
        <div key={s.label} className="border border-border bg-surface/50 rounded-xl p-5">
          <s.icon className="size-5 text-primary mb-3" />
          <div className="font-display text-2xl">{s.value}</div>
          <div className={`text-xs text-muted-foreground mt-1 ${ar ? "font-arabic" : "uppercase tracking-wider font-mono"}`}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Reports({ ar, data }: { ar: boolean; data: any }) {
  const status = Object.entries(data.statusBreakdown ?? {}) as [string, number][];
  const platforms = Object.entries(data.platformBreakdown ?? {}) as [string, number][];
  const series = data.signupSeries as { date: string; count: number }[];
  const maxSignup = Math.max(1, ...series.map((s) => s.count));
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title={ar ? "حالة المشاريع" : "Project Status"}>
        {status.length === 0 ? (
          <Empty ar={ar} />
        ) : (
          status.map(([k, v]) => <Bar key={k} label={k} value={v} max={Math.max(...status.map((s) => s[1]))} />)
        )}
      </Card>
      <Card title={ar ? "المنصات" : "Platforms"}>
        {platforms.length === 0 ? (
          <Empty ar={ar} />
        ) : (
          platforms.map(([k, v]) => <Bar key={k} label={k} value={v} max={Math.max(...platforms.map((s) => s[1]))} />)
        )}
      </Card>
      <Card title={ar ? "التسجيلات (١٤ يوم)" : "Signups (14d)"}>
        <div className="flex items-end gap-1 h-32">
          {series.map((s) => (
            <div key={s.date} className="flex-1 flex flex-col items-center gap-1" title={`${s.date}: ${s.count}`}>
              <div
                className="w-full bg-primary/70 rounded-sm transition-all"
                style={{ height: `${(s.count / maxSignup) * 100}%`, minHeight: 2 }}
              />
            </div>
          ))}
        </div>
        <div className="text-[10px] text-muted-foreground font-mono mt-2 flex justify-between">
          <span>{series[0]?.date.slice(5)}</span>
          <span>{series[series.length - 1]?.date.slice(5)}</span>
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface/50 rounded-xl p-5">
      <h3 className="text-sm font-bold mb-4 uppercase tracking-wider font-mono text-muted-foreground">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Empty({ ar }: { ar: boolean }) {
  return <p className="text-xs text-muted-foreground">{ar ? "لا توجد بيانات" : "No data"}</p>;
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-mono uppercase">{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <div className="h-2 bg-background rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function UsersTable({ ar, users }: { ar: boolean; users: any[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(s) || u.roles.some((r: string) => r.includes(s)),
    );
  }, [q, users]);

  return (
    <div className="border border-border bg-surface/50 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <h2 className={`text-lg font-bold ${ar ? "font-arabic" : ""}`}>
          {ar ? "المستخدمون والأدوار" : "Users & Roles"}
        </h2>
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 min-w-[240px]">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={ar ? "بحث…" : "Search…"}
            className="flex-1 bg-transparent py-2 outline-none text-sm"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground font-mono border-b border-border">
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3 hidden md:table-cell">{ar ? "المزود" : "Provider"}</th>
              <th className="text-left p-3 hidden lg:table-cell">{ar ? "آخر دخول" : "Last sign-in"}</th>
              <th className="text-left p-3">{ar ? "الأدوار" : "Roles"}</th>
              <th className="text-right p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <UserRow key={u.id} u={u} ar={ar} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserRow({ u, ar }: { u: any; ar: boolean }) {
  const qc = useQueryClient();
  const setRoleFn = useServerFn(setUserRole);
  const deleteFn = useServerFn(deleteUser);
  const isOwner = u.roles.includes("owner");

  const toggle = useMutation({
    mutationFn: (vars: { role: AdminRole; enabled: boolean }) =>
      setRoleFn({ data: { user_id: u.id, role: vars.role, enabled: vars.enabled } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success(ar ? "تم التحديث" : "Updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () => deleteFn({ data: { user_id: u.id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success(ar ? "تم حذف المستخدم" : "User deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const ROLES: AdminRole[] = ["admin", "moderator", "user"];

  return (
    <tr className="border-b border-border hover:bg-background/40">
      <td className="p-3">
        <div className="flex items-center gap-2">
          {isOwner && <Crown className="size-3.5 text-primary" />}
          <span className="truncate max-w-[260px]">{u.email || "—"}</span>
        </div>
        <div className="text-[10px] text-muted-foreground font-mono">
          {u.projects_count} {ar ? "مشاريع" : "projects"}
        </div>
      </td>
      <td className="p-3 hidden md:table-cell text-xs text-muted-foreground font-mono">{u.provider}</td>
      <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground font-mono">
        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "—"}
      </td>
      <td className="p-3">
        <div className="flex gap-1.5 flex-wrap">
          {isOwner && (
            <span className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-primary/15 text-primary border border-primary/30">
              owner
            </span>
          )}
          {ROLES.map((r) => {
            const enabled = u.roles.includes(r);
            return (
              <button
                key={r}
                disabled={toggle.isPending}
                onClick={() => toggle.mutate({ role: r, enabled: !enabled })}
                className={`text-[10px] uppercase font-mono px-2 py-1 rounded border transition-colors disabled:opacity-50 ${
                  enabled
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </td>
      <td className="p-3 text-right">
        {!isOwner && (
          <button
            disabled={remove.isPending}
            onClick={() => {
              if (confirm(ar ? `حذف ${u.email}؟` : `Delete ${u.email}?`)) remove.mutate();
            }}
            className="text-muted-foreground hover:text-red-500 disabled:opacity-50"
            title={ar ? "حذف" : "Delete"}
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

function SnapshotsList({ ar, snapshots }: { ar: boolean; snapshots: any[] }) {
  if (!snapshots?.length) return null;
  return (
    <div className="border border-border bg-surface/50 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border flex items-center gap-2">
        <Archive className="size-4 text-primary" />
        <h2 className={`text-lg font-bold ${ar ? "font-arabic" : ""}`}>
          {ar ? "نسخ التطبيق" : "App Snapshots"}
        </h2>
      </div>
      <div className="divide-y divide-border">
        {snapshots.map((s) => (
          <div key={s.id} className="p-4 flex items-center gap-4 text-sm">
            <span className="font-display text-primary">{s.version}</span>
            <span className="flex-1 truncate">{s.label}</span>
            <span className="text-xs text-muted-foreground font-mono hidden md:inline">
              {s.archive_name}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {s.size_bytes ? `${(s.size_bytes / 1024).toFixed(0)} KB` : ""}
            </span>
            <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
              {new Date(s.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
