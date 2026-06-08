import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — HourClips" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email || "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            {t("dash.welcome")}, {name}
          </span>
        </div>
        <h1 className={`mb-12 ${lang === "ar" ? "font-arabic font-bold text-5xl" : "font-display text-6xl uppercase tracking-tight"}`}>
          {t("dash.title")}
        </h1>

        <div className="border border-border bg-surface p-12 text-center">
          <p className={`text-muted-foreground mb-8 ${lang === "ar" ? "font-arabic" : ""}`}>
            {t("dash.empty")}
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-tighter hover:brightness-110 transition-all">
            {t("dash.upload")}
          </button>
        </div>
      </main>
    </div>
  );
}
