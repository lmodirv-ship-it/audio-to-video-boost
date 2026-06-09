import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar" | "fr";

const dict = {
  en: {
    "nav.home": "Home",
    "nav.engine": "Engine",
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.support": "Support",
    "nav.blog": "Blog",
    "nav.cta": "Start Free",
    "nav.signin": "Sign In",
    "nav.signup": "Sign Up",
    "nav.signout": "Sign Out",
    "nav.dashboard": "Dashboard",

    "hero.kicker": "Broadcast Quality",
    "hero.title.1": "Turn every podcast episode into",
    "hero.title.2": "50 pieces of content",
    "hero.sub":
      "Upload one podcast episode and get short vertical videos, text quotes, captions, and ready-to-post snippets in minutes.",
    "hero.upload": "Start Free Now",
    "hero.demo": "Watch How It Works",
    "hero.note": "No credit card required  •  7-day free trial",

    "stats.creators": "Creators",
    "stats.clips": "Clips Generated",
    "stats.time": "Time Saved",

    "trust.heading": "Trusted by thousands of creators & companies",

    "features.heading": "Features built ",
    "features.heading.accent": "for creators",
    "features.f1.tag": "AI Clips",
    "features.f1.title": "Smart Highlights",
    "features.f1.body": "We auto-detect the best moments in your episode and turn them into ready clips.",
    "features.f2.tag": "Subtitles",
    "features.f2.title": "AI Translation",
    "features.f2.body": "Accurate captions in 50+ languages with speaker detection.",
    "features.f3.tag": "Export",
    "features.f3.title": "Publish-Ready",
    "features.f3.body": "Optimized aspect ratios for every platform with your brand.",
    "features.f4.tag": "Schedule",
    "features.f4.title": "Auto Publishing",
    "features.f4.body": "Schedule and publish to all platforms on your timetable.",
    "features.f5.tag": "Analytics",
    "features.f5.title": "Advanced Insights",
    "features.f5.body": "Track performance and learn what drives reach.",
    "features.f6.tag": "Platforms",
    "features.f6.title": "Everywhere",
    "features.f6.body": "Native support for TikTok, YouTube Shorts & Instagram Reels.",

    "how.heading": "How it works",
    "how.s1.title": "1. Upload",
    "how.s1.body": "Drop an audio or video file, or paste a YouTube link.",
    "how.s2.title": "2. AI Processing",
    "how.s2.body": "Our engine transcribes, finds the gold, and edits the cuts.",
    "how.s3.title": "3. Publish",
    "how.s3.body": "Download or schedule directly to TikTok, Reels & Shorts.",

    "pricing.heading": "Production Plans",
    "pricing.sub": "Scalable solutions for modern creators",
    "pricing.recommended": "Most Popular",
    "pricing.tier.free": "Free",
    "pricing.tier.pro": "Pro Creator",
    "pricing.tier.studio": "Studio",
    "pricing.cta.free": "Start Free",
    "pricing.cta.pro": "Get Pro",
    "pricing.cta.studio": "Go Studio",
    "pricing.month": "/month",

    "faq.heading": "Frequently Asked Questions",
    "faq.q1": "How long does processing take?",
    "faq.a1": "A 1-hour episode is processed in 5–10 minutes on average.",
    "faq.q2": "Which platforms are supported?",
    "faq.a2": "TikTok, YouTube Shorts, Instagram Reels, Twitter/X, LinkedIn.",
    "faq.q3": "Can I cancel anytime?",
    "faq.a3": "Yes, you can cancel or change your plan at any time, no questions asked.",
    "faq.q4": "Are subtitles accurate in Arabic?",
    "faq.a4": "Yes — we use specialised models for Arabic, English and 50+ languages.",

    "footer.tag": "Turn podcasts into viral clips.",
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.status": "All Systems Operational",

    "auth.title": "Welcome back",
    "auth.sub": "Sign in to your HourClips studio.",
    "auth.google": "Continue with Google",
    "auth.signup.title": "Create your studio",
    "auth.signup.sub": "Start turning long-form audio into viral content.",
    "auth.back": "Back to home",
    "auth.have": "Already have an account?",
    "auth.dont": "Don't have an account?",

    "dash.title": "Studio Dashboard",
    "dash.welcome": "Welcome back",
    "dash.empty": "No renders yet. Upload your first episode to get started.",
    "dash.upload": "New Render",
    "dash.nav.overview": "Overview",
    "dash.nav.episodes": "Episodes",
    "dash.nav.clips": "Clips",
    "dash.nav.upload": "Upload",
    "dash.nav.settings": "Settings",

    "upload.title": "Upload Episode",
    "upload.drop": "Drop your audio or video file here",
    "upload.or": "or paste a YouTube link",
    "upload.btn": "Start Processing",

    "clips.title": "Generated Clips",
    "clips.empty": "Process your first episode to see clips here.",

    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.brand": "Brand & Watermark",
    "settings.lang": "Language",
    "settings.save": "Save Changes",

    "support.title": "Support",
    "support.sub": "We're here to help — typically reply within 2 hours.",
    "support.email": "Email us",
    "support.docs": "Documentation",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.engine": "المحرك",
    "nav.features": "المميزات",
    "nav.pricing": "الأسعار",
    "nav.support": "الدعم",
    "nav.blog": "المدونة",
    "nav.cta": "ابدأ مجاناً",
    "nav.signin": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",
    "nav.signout": "خروج",
    "nav.dashboard": "لوحة التحكم",

    "hero.kicker": "جودة البث / احترافية",
    "hero.title.1": "حوّل كل حلقة بودكاست إلى",
    "hero.title.2": "50 قطعة محتوى",
    "hero.sub":
      "ارفع حلقة بودكاست واحدة، واحصل على فيديوهات قصيرة، اقتباسات نصية، ومنشورات جاهزة للنشر على جميع منصات التواصل الاجتماعي.",
    "hero.upload": "ابدأ مجاناً الآن",
    "hero.demo": "شاهد كيف يعمل",
    "hero.note": "لا تحتاج إلى بطاقة ائتمان  •  تجربة مجانية لمدة 7 أيام",

    "stats.creators": "منشئ محتوى",
    "stats.clips": "مقطع تم إنشاؤه",
    "stats.time": "توفير في الوقت",

    "trust.heading": "يثق بنا آلاف المنشئين والشركات",

    "features.heading": "مميزات مصممة ",
    "features.heading.accent": "للمنشئين",
    "features.f1.tag": "قصاصات ذكية",
    "features.f1.title": "أبرز اللحظات",
    "features.f1.body": "نحدد تلقائياً أفضل اللحظات في حلقة البودكاست الخاصة بك تلقائياً.",
    "features.f2.tag": "ترجمة",
    "features.f2.title": "ترجمة بالذكاء الاصطناعي",
    "features.f2.body": "ترجمة دقيقة لأكثر من 50 لغة مع تعرف على المتحدثين.",
    "features.f3.tag": "تصدير",
    "features.f3.title": "تصدير جاهز للنشر",
    "features.f3.body": "مقاطع محسّنة لكل منصة بأبعاد مثالية وعلامتك التجارية.",
    "features.f4.tag": "جدولة",
    "features.f4.title": "جدولة النشر",
    "features.f4.body": "انشر تلقائياً على جميع المنصات وفق جدول زمني.",
    "features.f5.tag": "تحليلات",
    "features.f5.title": "تحليلات متقدمة",
    "features.f5.body": "تتبع الأداء وما يحقق أفضل انتشار وتفاعل.",
    "features.f6.tag": "منصات",
    "features.f6.title": "في كل مكان",
    "features.f6.body": "دعم كامل لتيك توك ويوتيوب شورتس وإنستغرام ريلز.",

    "how.heading": "كيف يعمل",
    "how.s1.title": "١. ارفع",
    "how.s1.body": "أسقط ملف صوت أو فيديو، أو ألصق رابط يوتيوب.",
    "how.s2.title": "٢. معالجة بالذكاء",
    "how.s2.body": "محركنا ينسخ النص، يستخرج الذهب، ويصنع المونتاج.",
    "how.s3.title": "٣. انشر",
    "how.s3.body": "حمّل أو جدول مباشرة على تيك توك وريلز وشورتس.",

    "pricing.heading": "خطط الإنتاج",
    "pricing.sub": "حلول قابلة للتوسع لصناع المحتوى",
    "pricing.recommended": "الأكثر شعبية",
    "pricing.tier.free": "مجاني",
    "pricing.tier.pro": "احترافي",
    "pricing.tier.studio": "استوديو",
    "pricing.cta.free": "ابدأ مجاناً",
    "pricing.cta.pro": "اشترك الآن",
    "pricing.cta.studio": "خطة استوديو",
    "pricing.month": "/شهرياً",

    "faq.heading": "الأسئلة الشائعة",
    "faq.q1": "كم تستغرق المعالجة؟",
    "faq.a1": "حلقة بمدة ساعة تتم معالجتها في 5 إلى 10 دقائق في المتوسط.",
    "faq.q2": "ما المنصات المدعومة؟",
    "faq.a2": "تيك توك، يوتيوب شورتس، إنستغرام ريلز، تويتر/إكس، لينكدإن.",
    "faq.q3": "هل يمكنني الإلغاء في أي وقت؟",
    "faq.a3": "نعم، يمكنك إلغاء أو تغيير خطتك في أي وقت دون أسئلة.",
    "faq.q4": "هل الترجمة دقيقة بالعربية؟",
    "faq.a4": "نعم — نستخدم نماذج متخصصة للعربية والإنجليزية و50+ لغة.",

    "footer.tag": "حوّل البودكاست إلى مقاطع فيروسية.",
    "footer.product": "المنتج",
    "footer.company": "الشركة",
    "footer.legal": "قانوني",
    "footer.status": "جميع الأنظمة تعمل",

    "auth.title": "مرحباً بعودتك",
    "auth.sub": "سجل دخولك إلى استوديو HourClips.",
    "auth.google": "تابع مع Google",
    "auth.signup.title": "أنشئ حسابك",
    "auth.signup.sub": "ابدأ تحويل الصوت الطويل إلى محتوى فيروسي.",
    "auth.back": "عودة للرئيسية",
    "auth.have": "لديك حساب بالفعل؟",
    "auth.dont": "ليس لديك حساب؟",

    "dash.title": "لوحة الاستوديو",
    "dash.welcome": "مرحباً بعودتك",
    "dash.empty": "لا توجد عمليات معالجة بعد. ارفع أول حلقة لك للبدء.",
    "dash.upload": "معالجة جديدة",
    "dash.nav.overview": "نظرة عامة",
    "dash.nav.episodes": "الحلقات",
    "dash.nav.clips": "المقاطع",
    "dash.nav.upload": "رفع",
    "dash.nav.settings": "الإعدادات",

    "upload.title": "رفع حلقة",
    "upload.drop": "أفلت ملف الصوت أو الفيديو هنا",
    "upload.or": "أو ألصق رابط يوتيوب",
    "upload.btn": "بدء المعالجة",

    "clips.title": "المقاطع المنتجة",
    "clips.empty": "عالج أول حلقة لرؤية المقاطع هنا.",

    "settings.title": "الإعدادات",
    "settings.profile": "الملف الشخصي",
    "settings.brand": "العلامة والعلامة المائية",
    "settings.lang": "اللغة",
    "settings.save": "حفظ التغييرات",

    "support.title": "الدعم",
    "support.sub": "نحن هنا للمساعدة — عادة نرد خلال ساعتين.",
    "support.email": "راسلنا",
    "support.docs": "الوثائق",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.engine": "Moteur",
    "nav.features": "Fonctionnalités",
    "nav.pricing": "Tarifs",
    "nav.support": "Support",
    "nav.blog": "Blog",
    "nav.cta": "Commencer",
    "nav.signin": "Connexion",
    "nav.signup": "S'inscrire",
    "nav.signout": "Déconnexion",
    "nav.dashboard": "Tableau de bord",

    "hero.kicker": "Qualité Broadcast",
    "hero.title.1": "Transformez chaque épisode en",
    "hero.title.2": "50 contenus viraux",
    "hero.sub":
      "Téléchargez un épisode de podcast et obtenez des vidéos courtes, des citations, des sous-titres et des publications prêtes en quelques minutes.",
    "hero.upload": "Commencer gratuitement",
    "hero.demo": "Voir la démo",
    "hero.note": "Aucune carte requise  •  Essai gratuit de 7 jours",

    "stats.creators": "Créateurs",
    "stats.clips": "Clips générés",
    "stats.time": "Temps économisé",

    "trust.heading": "Approuvé par des milliers de créateurs et entreprises",

    "features.heading": "Conçu ",
    "features.heading.accent": "pour les créateurs",
    "features.f1.tag": "Clips IA",
    "features.f1.title": "Moments forts",
    "features.f1.body": "Nous détectons automatiquement les meilleurs moments de votre épisode.",
    "features.f2.tag": "Sous-titres",
    "features.f2.title": "Traduction IA",
    "features.f2.body": "Sous-titres précis dans plus de 50 langues avec détection des locuteurs.",
    "features.f3.tag": "Export",
    "features.f3.title": "Prêt à publier",
    "features.f3.body": "Ratios optimisés pour chaque plateforme avec votre marque.",
    "features.f4.tag": "Planification",
    "features.f4.title": "Publication auto",
    "features.f4.body": "Planifiez et publiez sur toutes les plateformes selon votre calendrier.",
    "features.f5.tag": "Analytique",
    "features.f5.title": "Statistiques avancées",
    "features.f5.body": "Suivez les performances et apprenez ce qui fonctionne.",
    "features.f6.tag": "Plateformes",
    "features.f6.title": "Partout",
    "features.f6.body": "Support natif TikTok, YouTube Shorts et Instagram Reels.",

    "how.heading": "Comment ça marche",
    "how.s1.title": "1. Téléchargez",
    "how.s1.body": "Déposez un fichier audio ou vidéo, ou collez un lien YouTube.",
    "how.s2.title": "2. Traitement IA",
    "how.s2.body": "Notre moteur transcrit, trouve les pépites et édite les coupes.",
    "how.s3.title": "3. Publiez",
    "how.s3.body": "Téléchargez ou planifiez directement sur TikTok, Reels & Shorts.",

    "pricing.heading": "Plans de production",
    "pricing.sub": "Solutions évolutives pour créateurs modernes",
    "pricing.recommended": "Le plus populaire",
    "pricing.tier.free": "Gratuit",
    "pricing.tier.pro": "Pro Créateur",
    "pricing.tier.studio": "Studio",
    "pricing.cta.free": "Commencer",
    "pricing.cta.pro": "Obtenir Pro",
    "pricing.cta.studio": "Passer Studio",
    "pricing.month": "/mois",

    "faq.heading": "Questions fréquentes",
    "faq.q1": "Combien de temps prend le traitement ?",
    "faq.a1": "Un épisode d'1h est traité en 5 à 10 minutes en moyenne.",
    "faq.q2": "Quelles plateformes sont supportées ?",
    "faq.a2": "TikTok, YouTube Shorts, Instagram Reels, Twitter/X, LinkedIn.",
    "faq.q3": "Puis-je annuler à tout moment ?",
    "faq.a3": "Oui, annulez ou changez de plan à tout moment, sans question.",
    "faq.q4": "Les sous-titres sont-ils précis en français ?",
    "faq.a4": "Oui — nous utilisons des modèles spécialisés pour 50+ langues.",

    "footer.tag": "Transformez les podcasts en clips viraux.",
    "footer.product": "Produit",
    "footer.company": "Entreprise",
    "footer.legal": "Légal",
    "footer.status": "Tous les systèmes opérationnels",

    "auth.title": "Bon retour",
    "auth.sub": "Connectez-vous à votre studio HourClips.",
    "auth.google": "Continuer avec Google",
    "auth.signup.title": "Créez votre studio",
    "auth.signup.sub": "Commencez à transformer l'audio long en contenu viral.",
    "auth.back": "Retour à l'accueil",
    "auth.have": "Déjà un compte ?",
    "auth.dont": "Pas de compte ?",

    "dash.title": "Tableau de bord",
    "dash.welcome": "Bon retour",
    "dash.empty": "Aucun rendu pour le moment. Téléchargez votre premier épisode.",
    "dash.upload": "Nouveau rendu",
    "dash.nav.overview": "Aperçu",
    "dash.nav.episodes": "Épisodes",
    "dash.nav.clips": "Clips",
    "dash.nav.upload": "Téléverser",
    "dash.nav.settings": "Paramètres",

    "upload.title": "Téléverser un épisode",
    "upload.drop": "Déposez votre fichier audio ou vidéo ici",
    "upload.or": "ou collez un lien YouTube",
    "upload.btn": "Démarrer le traitement",

    "clips.title": "Clips générés",
    "clips.empty": "Traitez votre premier épisode pour voir les clips ici.",

    "settings.title": "Paramètres",
    "settings.profile": "Profil",
    "settings.brand": "Marque & Filigrane",
    "settings.lang": "Langue",
    "settings.save": "Enregistrer",

    "support.title": "Support",
    "support.sub": "Nous sommes là pour aider — réponse sous 2h en général.",
    "support.email": "Écrivez-nous",
    "support.docs": "Documentation",
  },
} as const;

type Key = keyof typeof dict.en;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (k: Key) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("hc-lang")) as Lang | null;
    if (stored === "ar" || stored === "en" || stored === "fr") setLang(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("hc-lang", lang);
  }, [lang]);

  const order: Lang[] = ["en", "ar", "fr"];
  const value: Ctx = {
    lang,
    setLang,
    toggle: () => setLang((l) => order[(order.indexOf(l) + 1) % order.length]),
    t: (k) => dict[lang][k] ?? dict.en[k],
  };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
