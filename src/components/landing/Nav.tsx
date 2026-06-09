import { Link, useNavigate } from "@tanstack/react-router";
import { useLang, type Lang } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/hourclips-logo.jpeg";
import { Sparkles } from "lucide-react";

const langLabels: Record<Lang, string> = { en: "EN", ar: "عربي", fr: "FR" };

export function Nav() {
  const { lang, setLang, t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  const langs: Lang[] = ["en", "ar", "fr"];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="HourClips" width={40} height={40} className="size-10 rounded-lg object-cover" />
          <span className="font-display text-2xl tracking-wider uppercase">
            <span className="text-foreground">Hour</span><span className="text-primary">Clips</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[12px] font-mono tracking-widest text-muted-foreground uppercase">
          <Link to="/" className="hover:text-foreground transition-colors">{t("nav.home")}</Link>
          <a href="/#features" className="hover:text-foreground transition-colors">{t("nav.features")}</a>
          <Link to="/pricing" className="hover:text-foreground transition-colors">{t("nav.pricing")}</Link>
          <Link to="/support" className="hover:text-foreground transition-colors">{t("nav.support")}</Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center border border-border rounded-md overflow-hidden">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1.5 text-[11px] font-mono transition-colors ${
                  lang === l ? "bg-primary text-primary-foreground" : "hover:bg-surface text-muted-foreground"
                }`}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground px-3"
              >
                {t("nav.dashboard")}
              </Link>
              <button
                onClick={signOut}
                className="bg-surface border border-border text-foreground text-[12px] font-bold px-4 py-2 uppercase tracking-tighter hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                {t("nav.signout")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground px-3"
              >
                {t("nav.signin")}
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-primary-foreground text-[12px] font-bold px-4 py-2.5 uppercase tracking-tighter hover:brightness-110 transition-all inline-flex items-center gap-2 shadow-[0_0_20px_-5px_var(--primary)]"
              >
                <Sparkles className="size-3.5" />
                {t("nav.cta")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
