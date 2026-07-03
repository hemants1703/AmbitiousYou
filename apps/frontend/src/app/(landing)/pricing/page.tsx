import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { brandCopy } from "@/lib/brand";
import PrimaryCta from "@/components/(landing)/primary-cta";
import LandingSection from "@/components/(landing)/landing-section";
import JsonLd from "@/components/seo/json-ld";
import { pricingFaq } from "@/lib/seo/faqs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqPageSchema, webPageSchema } from "@/lib/seo/schemas";
import type { Metadata } from "next";

export const dynamic = "force-static";

const title = "Pricing";
const description = "AmbitiousYou is free to use — no credit card, no billing tiers, and no cap on ambitions. Start tracking your goals today.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/pricing",
  keywords: ["free goal tracker", "free ambition app", "free productivity app", "goal tracking pricing"],
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/pricing" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          faqPageSchema(pricingFaq),
        ]}
      />
      <LandingSection eyebrow="Pricing" title="Free. Actually free." lede={description} className="pt-16 md:pt-24" align="center">
        <div className="mx-auto max-w-lg rounded-2xl border border-primary/30 bg-card/80 p-8 text-center shadow-sm">
          <p className="font-brand text-5xl font-semibold tracking-[-0.03em]">$0</p>
          <p className="mt-2 text-lg text-muted-foreground">Forever, for the core experience</p>
          <ul className="mt-8 space-y-3 text-left text-sm text-muted-foreground">
            {[
              "Unlimited ambitions",
              "Tasks and milestones in any mix",
              "Dashboard insights, streaks, and momentum charts",
              "Private notes and priority management",
              "No credit card required",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <PrimaryCta loggedOutLabel={brandCopy.cta.join} loggedOutHref="/signup" />
          </div>
        </div>
      </LandingSection>

      <LandingSection eyebrow="FAQ" title="Pricing questions" align="center" className="pb-16 md:pb-24">
        <Accordion type="single" collapsible className="mx-auto w-full max-w-2xl">
          {pricingFaq.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </LandingSection>
    </>
  );
}
