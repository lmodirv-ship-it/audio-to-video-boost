import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/hourclips-logo.jpeg";

export function Footer() {
  const { t, lang } = useLang();
  const ar = lang === "ar";
  return (
    <footer className="border-t border-border bg-surface/40 px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img src={logo} alt="HourClips" width={36} height={36} className="size-9 rounded-md object-cover" />
            <span className="font-display text-xl tracking-wider uppercase">
              <span>Hour</span><span className="text-primary">Clips</span>
            </span>
          </Link>
          <p className={`text-sm text-muted-foreground ${ar ? "font-arabic" : ""}`}>{t("footer.tag")}</p>
        </div>

        <div>
          <h4 className={`text-xs uppercase tracking-widest mb-4 ${ar ? "font-arabic" : "font-mono"}`}>{t("footer.product")}</h4>
          <ul className={`space-y-2 text-sm text-muted-foreground ${ar ? "font-arabic" : ""}`}>
            <li><a href="/#features" className="hover:text-primary">{t("nav.features")}</a></li>
            <li><Link to="/pricing" className="hover:text-primary">{t("nav.pricing")}</Link></li>
            <li><a href="/#how" className="hover:text-primary">{t("how.heading")}</a></li>
          </ul>
        </div>

        <div>
          <h4 className={`text-xs uppercase tracking-widest mb-4 ${ar ? "font-arabic" : "font-mono"}`}>{t("footer.company")}</h4>
          <ul className={`space-y-2 text-sm text-muted-foreground ${ar ? "font-arabic" : ""}`}>
            <li><Link to="/support" className="hover:text-primary">{t("nav.support")}</Link></li>
            <li><a href="/#faq" className="hover:text-primary">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className={`text-xs uppercase tracking-widest mb-4 ${ar ? "font-arabic" : "font-mono"}`}>{t("footer.legal")}</h4>
          <ul className={`space-y-2 text-sm text-muted-foreground ${ar ? "font-arabic" : ""}`}>
            <li><a href="#" className="hover:text-primary">Privacy</a></li>
            <li><a href="#" className="hover:text-primary">Terms</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-[10px] text-muted-foreground uppercase">© 2026 HourClips</p>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase">
          <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
          {t("footer.status")}
        </div>
      </div>
    </footer>
  );
}
