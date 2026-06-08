import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — HourClips" },
      { name: "description", content: "Sign in to HourClips to render long-form podcast episodes into video and shorts." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);

  async function signInGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      toast.error(result.error.message ?? "Sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="font-display text-3xl tracking-wider text-primary uppercase block text-center mb-12">
          HourClips
        </Link>
        <div className="border border-border bg-surface p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                {lang === "ar" ? "وصول آمن" : "Secure Access"}
              </span>
            </div>
            <h1 className={`text-3xl mb-2 ${lang === "ar" ? "font-arabic font-bold" : "font-display uppercase tracking-tight"}`}>
              {t("auth.title")}
            </h1>
            <p className={`text-sm text-muted-foreground ${lang === "ar" ? "font-arabic" : ""}`}>
              {t("auth.sub")}
            </p>
          </div>

          <button
            onClick={signInGoogle}
            disabled={busy}
            className="w-full bg-foreground text-background py-4 font-bold uppercase tracking-tighter hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 11v2.8h6.6c-.3 1.7-2 5-6.6 5-4 0-7.2-3.3-7.2-7.3S8 4.2 12 4.2c2.3 0 3.8.9 4.7 1.8l3.2-3C17.9 1.3 15.2 0 12 0 5.4 0 0 5.4 0 12s5.4 12 12 12c6.9 0 11.5-4.9 11.5-11.7 0-.8-.1-1.5-.2-2.3H12z" />
            </svg>
            {busy ? "..." : t("auth.google")}
          </button>

          <div className="mt-6 text-center">
            <Link to="/" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
              ← {t("auth.back")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
