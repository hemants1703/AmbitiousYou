import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/seo/schemas";

interface FaqSectionProps {
  title?: string;
  faqs: readonly FaqItem[];
  id?: string;
}

/** Visible FAQ accordion — pair with `faqPageSchema` for AI/search extractability. */
export default function FaqSection(props: FaqSectionProps) {
  const title = props.title ?? "Common questions";

  return (
    <section id={props.id} className="scroll-mt-24">
      <h2 className="font-brand text-lg font-semibold md:text-xl">{title}</h2>
      <Accordion type="single" collapsible className="mt-4">
        {props.faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
