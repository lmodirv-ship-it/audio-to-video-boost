import { useLang } from "@/lib/i18n";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQ() {
  const { t, lang } = useLang();
  const ar = lang === "ar";
  const items = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];
  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className={`text-center text-4xl md:text-5xl mb-12 ${ar ? "font-arabic font-bold" : "font-display uppercase"}`}>
          {t("faq.heading")}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className={`text-left text-lg hover:text-primary ${ar ? "font-arabic" : ""}`}>
                {it.q}
              </AccordionTrigger>
              <AccordionContent className={`text-muted-foreground ${ar ? "font-arabic" : ""}`}>
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
