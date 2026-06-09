import { createFileRoute } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/DashShell";
import { useLang, type Lang } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — HourClips" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useLang();
  const ar = lang === "ar";
  const { user } = useAuth();

  return (
    <DashShell>
      <h1 className={`text-3xl md:text-4xl mb-8 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
        {t("settings.title")}
      </h1>

      <div className="space-y-6 max-w-3xl">
        <section className="border border-border bg-surface/50 rounded-xl p-6">
          <h2 className={`text-lg font-bold mb-5 ${ar ? "font-arabic" : ""}`}>{t("settings.profile")}</h2>
          <div className="space-y-4">
            <div>
              <label className={`text-xs uppercase tracking-widest text-muted-foreground mb-2 block ${ar ? "font-arabic" : "font-mono"}`}>Email</label>
              <input defaultValue={user?.email ?? ""} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm" />
            </div>
            <div>
              <label className={`text-xs uppercase tracking-widest text-muted-foreground mb-2 block ${ar ? "font-arabic" : "font-mono"}`}>{ar ? "الاسم" : "Display Name"}</label>
              <input defaultValue={user?.user_metadata?.full_name ?? ""} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm" />
            </div>
          </div>
        </section>

        <section className="border border-border bg-surface/50 rounded-xl p-6">
          <h2 className={`text-lg font-bold mb-5 ${ar ? "font-arabic" : ""}`}>{t("settings.brand")}</h2>
          <div className="space-y-4">
            <div>
              <label className={`text-xs uppercase tracking-widest text-muted-foreground mb-2 block ${ar ? "font-arabic" : "font-mono"}`}>{ar ? "اسم العلامة" : "Brand Name"}</label>
              <input placeholder="HourClips" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm" />
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" className="size-4 accent-primary" />
              <span className={ar ? "font-arabic" : ""}>{ar ? "إظهار العلامة المائية" : "Show watermark on clips"}</span>
            </label>
          </div>
        </section>

        <section className="border border-border bg-surface/50 rounded-xl p-6">
          <h2 className={`text-lg font-bold mb-5 ${ar ? "font-arabic" : ""}`}>{t("settings.lang")}</h2>
          <div className="grid grid-cols-3 gap-3">
            {(["en", "ar", "fr"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`py-3 rounded-lg border text-sm font-bold uppercase tracking-wider transition-colors ${
                  lang === l ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-background"
                }`}
              >
                {l === "en" ? "English" : l === "ar" ? "العربية" : "Français"}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={() => toast.success(ar ? "تم الحفظ" : "Saved")}
          className="bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-tighter text-sm hover:brightness-110 transition-all rounded-lg"
        >
          {t("settings.save")}
        </button>
      </div>
    </DashShell>
  );
}
