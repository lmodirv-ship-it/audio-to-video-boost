import { Link, useNavigate } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function Nav() {
  const { lang, toggle, t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-2xl tracking-wider text-primary uppercase">
            HourClips
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-mono tracking-widest text-muted-foreground uppercase">
            <a href="/#engine" className="hover:text-foreground transition-colors">{t("nav.engine")}</a>
            <a href="/#features" className="hover:text-foreground transition-colors">{t("nav.features")}</a>
            <a href="/#pricing" className="hover:text-foreground transition-colors">{t("nav.pricing")}</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="px-3 py-1 text-[11px] font-mono border border-border rounded hover:bg-surface transition-colors"
          >
            {lang === "en" ? "عربي" : "EN"}
          </button>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={signOut}
                className="bg-primary text-primary-foreground text-[12px] font-bold px-4 py-2 uppercase tracking-tighter hover:brightness-110 transition-all"
              >
                {t("nav.signout")}
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-primary text-primary-foreground text-[12px] font-bold px-4 py-2 uppercase tracking-tighter hover:brightness-110 transition-all"
            >
              {t("nav.signin")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
