import { useLang } from "@/lib/i18n";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-display text-xl tracking-wider text-primary uppercase">HourClips</span>
          <p className="font-mono text-[10px] text-muted-foreground">{t("footer.tag")}</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase">
          <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
          {t("footer.status")}
        </div>
      </div>
    </footer>
  );
}
