import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Upload, Film, Settings, LogOut } from "lucide-react";
import { useLang, type Lang } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/hourclips-logo.jpeg";
import type { ReactNode } from "react";

const langLabels: Record<Lang, string> = { en: "EN", ar: "عربي", fr: "FR" };

export function DashShell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const items = [
    { to: "/dashboard", label: t("dash.nav.overview"), icon: LayoutDashboard },
    { to: "/upload", label: t("dash.nav.upload"), icon: Upload },
    { to: "/clips", label: t("dash.nav.clips"), icon: Film },
    { to: "/settings", label: t("dash.nav.settings"), icon: Settings },
  ] as const;

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-surface/40 flex-col">
        <Link to="/" className="flex items-center gap-2 px-6 h-20 border-b border-border">
          <img src={logo} alt="HourClips" width={36} height={36} className="size-9 rounded-md object-cover" />
          <span className="font-display text-xl tracking-wider uppercase"><span>Hour</span><span className="text-primary">Clips</span></span>
        </Link>

        <nav className="flex-1 p-4 space-y-1">
          {items.map((it) => {
            const active = path === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                <it.icon className="size-4" />
                <span className={lang === "ar" ? "font-arabic" : ""}>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            {(["en", "ar", "fr"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex-1 px-2 py-1.5 text-[11px] font-mono transition-colors ${
                  lang === l ? "bg-primary text-primary-foreground" : "hover:bg-surface text-muted-foreground"
                }`}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground truncate font-mono">{user?.email}</div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface rounded-lg transition-colors"
          >
            <LogOut className="size-4" />
            <span className={lang === "ar" ? "font-arabic" : ""}>{t("nav.signout")}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="md:hidden border-b border-border h-16 px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="HourClips" width={32} height={32} className="size-8 rounded-md object-cover" />
            <span className="font-display text-lg uppercase"><span>Hour</span><span className="text-primary">Clips</span></span>
          </Link>
          <button onClick={signOut} className="text-xs font-mono uppercase text-muted-foreground">
            {t("nav.signout")}
          </button>
        </div>
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}
