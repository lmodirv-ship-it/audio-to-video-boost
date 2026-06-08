import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

const dict = {
  en: {
    "nav.engine": "Engine",
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.cta": "Start Rendering",
    "hero.kicker": "Broadcast Quality / جودة البث",
    "hero.title.1": "Turn Long Audio",
    "hero.title.2": "Into Viral Content",
    "hero.sub":
      "Upload a 1-hour podcast. Get a YouTube-ready video with animated waveform, AI subtitles, and 5 vertical shorts — in minutes.",
    "hero.upload": "Upload Episode",
    "hero.demo": "Watch Demo",
    "features.heading": "Built for serious creators",
    "features.f1.tag": "01 // Render",
    "features.f1.title": "Audio → Visual",
    "features.f1.body":
      "Waveform backgrounds that react to every syllable. 4K rendering pipeline tuned for podcast pacing.",
    "features.f2.tag": "02 // Context",
    "features.f2.title": "AI Subtitles",
    "features.f2.body":
      "Word-accurate transcription with kinetic typography. Native Arabic + English support — no fallback fonts.",
    "features.f3.tag": "03 // Viral",
    "features.f3.title": "Smart Clips",
    "features.f3.body":
      "AI scans the full episode, finds the 5 highest-energy moments, and exports vertical 9:16 shorts.",
    "pricing.heading": "Production Plans",
    "pricing.sub": "Scalable solutions for modern creators",
    "pricing.recommended": "Recommended",
    "pricing.tier.free": "Base",
    "pricing.tier.pro": "Pro Creator",
    "pricing.tier.studio": "Studio",
    "pricing.cta.free": "Start Free",
    "pricing.cta.pro": "Acquire License",
    "pricing.cta.studio": "Go Studio",
    "footer.tag": "© 2026 PRECISION BROADCAST SYSTEMS",
    "footer.status": "System Operational",
    "nav.signin": "Sign In",
    "nav.signout": "Sign Out",
    "nav.dashboard": "Dashboard",
    "auth.title": "Access the Studio",
    "auth.sub": "Sign in to start rendering long-form audio.",
    "auth.google": "Continue with Google",
    "auth.back": "Back to home",
    "dash.title": "Studio Dashboard",
    "dash.welcome": "Welcome back",
    "dash.empty": "No renders yet. Upload your first episode to get started.",
    "dash.upload": "New Render",
  },
  ar: {
    "nav.engine": "المحرك",
    "nav.features": "المميزات",
    "nav.pricing": "الأسعار",
    "nav.cta": "ابدأ الآن",
    "hero.kicker": "جودة البث / Broadcast Quality",
    "hero.title.1": "حوّل البودكاست",
    "hero.title.2": "إلى محتوى فيروسي",
    "hero.sub":
      "ارفع حلقة بودكاست لمدة ساعة، واحصل على فيديو يوتيوب جاهز مع موجات صوتية متحركة، ترجمة بالذكاء الاصطناعي، و٥ مقاطع قصيرة عمودية — خلال دقائق.",
    "hero.upload": "ارفع حلقتك",
    "hero.demo": "شاهد التجربة",
    "features.heading": "مبني لصناع المحتوى الجادين",
    "features.f1.tag": "٠١ // الرندر",
    "features.f1.title": "صوت ← فيديو",
    "features.f1.body":
      "خلفيات موجات صوتية تتفاعل مع كل مقطع. محرك رندر 4K مضبوط لإيقاع البودكاست.",
    "features.f2.tag": "٠٢ // النص",
    "features.f2.title": "ترجمة بالذكاء الاصطناعي",
    "features.f2.body":
      "تفريغ نصي بدقة الكلمة مع تايبوغرافي متحرك. دعم كامل للعربية والإنجليزية — بدون خطوط بديلة.",
    "features.f3.tag": "٠٣ // فيروسي",
    "features.f3.title": "مقاطع ذكية",
    "features.f3.body":
      "الذكاء الاصطناعي يفحص الحلقة كاملة، يستخرج أفضل ٥ لحظات حماسية، ويصدّرها كمقاطع عمودية ٩:١٦.",
    "pricing.heading": "خطط الإنتاج",
    "pricing.sub": "حلول قابلة للتوسع لصناع المحتوى",
    "pricing.recommended": "موصى به",
    "pricing.tier.free": "أساسي",
    "pricing.tier.pro": "احترافي",
    "pricing.tier.studio": "استوديو",
    "pricing.cta.free": "ابدأ مجاناً",
    "pricing.cta.pro": "اشترك الآن",
    "pricing.cta.studio": "خطة استوديو",
    "footer.tag": "© 2026 برسيجن برودكاست سيستمز",
    "footer.status": "النظام يعمل",
  },
} as const;

type Key = keyof typeof dict.en;

type Ctx = {
  lang: Lang;
  toggle: () => void;
  t: (k: Key) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("hc-lang")) as Lang | null;
    if (stored === "ar" || stored === "en") setLang(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("hc-lang", lang);
  }, [lang]);

  const value: Ctx = {
    lang,
    toggle: () => setLang((l) => (l === "en" ? "ar" : "en")),
    t: (k) => dict[lang][k],
  };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
