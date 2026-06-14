import { createFileRoute } from "@tanstack/react-router";
import { DashShell } from "@/components/dash/DashShell";
import { useLang, type Lang } from "@/lib/i18n";
import { useAuth } from "@/lib/use-auth";
import { useMyRoles } from "@/lib/use-roles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — HourClips" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useLang();
  const ar = lang === "ar";
  const { user } = useAuth();
  const { roles } = useMyRoles();

  const [displayName, setDisplayName] = useState("");
  const [brand, setBrand] = useState("");
  const [watermark, setWatermark] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.user_metadata?.full_name ?? user.user_metadata?.display_name ?? "");
    setBrand(user.user_metadata?.brand ?? "");
    setWatermark(user.user_metadata?.watermark ?? true);
  }, [user]);

  async function save() {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: displayName,
        display_name: displayName,
        brand,
        watermark,
      },
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success(ar ? "تم الحفظ" : "Saved");
  }

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
              <input value={user?.email ?? ""} readOnly className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground" />
            </div>
            <div>
              <label className={`text-xs uppercase tracking-widest text-muted-foreground mb-2 block ${ar ? "font-arabic" : "font-mono"}`}>
                {ar ? "الاسم" : "Display Name"}
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm"
              />
            </div>
            {roles.length > 0 && (
              <div>
                <label className={`text-xs uppercase tracking-widest text-muted-foreground mb-2 block ${ar ? "font-arabic" : "font-mono"}`}>
                  {ar ? "الأدوار" : "Roles"}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {roles.map((r) => (
                    <span key={r} className="text-[10px] uppercase font-mono px-2 py-1 rounded bg-primary/15 text-primary border border-primary/30">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="border border-border bg-surface/50 rounded-xl p-6">
          <h2 className={`text-lg font-bold mb-5 ${ar ? "font-arabic" : ""}`}>{t("settings.brand")}</h2>
          <div className="space-y-4">
            <div>
              <label className={`text-xs uppercase tracking-widest text-muted-foreground mb-2 block ${ar ? "font-arabic" : "font-mono"}`}>
                {ar ? "اسم العلامة" : "Brand Name"}
              </label>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="HourClips"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm"
              />
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={watermark}
                onChange={(e) => setWatermark(e.target.checked)}
                className="size-4 accent-primary"
              />
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
          onClick={save}
          disabled={saving}
          className="bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-tighter text-sm hover:brightness-110 transition-all rounded-lg inline-flex items-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {t("settings.save")}
        </button>
      </div>
    </DashShell>
  );
}
