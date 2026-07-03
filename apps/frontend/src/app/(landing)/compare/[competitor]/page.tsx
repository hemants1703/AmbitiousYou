import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { brandCopy } from "@/lib/brand";
import PrimaryCta from "@/components/(landing)/primary-cta";
import LandingSection from "@/components/(landing)/landing-section";
import JsonLd from "@/components/seo/json-ld";
import { compareFaq } from "@/lib/seo/faqs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { compareSlugs } from "@/lib/seo/pages";
import { breadcrumbSchema, faqPageSchema, webPageSchema } from "@/lib/seo/schemas";
import { getCompareContent } from "@/lib/seo/compare-content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

interface ComparePageProps {
  params: Promise<{ competitor: string }>;
}

export function generateStaticParams() {
  return compareSlugs.map((competitor) => ({ competitor }));
}

export async function generateMetadata(props: ComparePageProps): Promise<Metadata> {
  const { competitor } = await props.params;
  const content = getCompareContent(competitor);
  if (!content) return {};

  return createPageMetadata({
    title: content.title,
    description: content.description,
    path: `/compare/${competitor}`,
    keywords: [`${content.name} alternative`, "goal tracking app", "ambition management"],
  });
}

export default async function CompareDetailPage(props: ComparePageProps) {
  const { competitor } = await props.params;
  const content = getCompareContent(competitor);
  if (!content) notFound();

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title: content.title, description: content.description, path: `/compare/${competitor}` }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Compare", path: "/compare" },
            { name: content.title, path: `/compare/${competitor}` },
          ]),
          faqPageSchema(compareFaq),
        ]}
      />
      <article className="pt-16 md:pt-24">
        <LandingSection eyebrow="Comparison" title={content.title} lede={content.summary}>
          <div className="mx-auto max-w-4xl space-y-10">
            <div className="overflow-x-auto rounded-2xl border border-border/60">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <caption className="sr-only">{content.title} feature comparison</caption>
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40">
                    <th scope="col" className="p-4 font-semibold">
                      Feature
                    </th>
                    <th scope="col" className="p-4 font-semibold">
                      AmbitiousYou
                    </th>
                    <th scope="col" className="p-4 font-semibold">
                      {content.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {content.features.map((row) => (
                    <tr key={row.label} className="border-b border-border/40 last:border-0">
                      <th scope="row" className="p-4 font-medium text-muted-foreground">
                        {row.label}
                      </th>
                      <td className="p-4">{row.ambitiousyou}</td>
                      <td className="p-4">{row.competitor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <section>
                <h2 className="font-brand text-lg font-semibold">Choose AmbitiousYou when…</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {content.whenAmbitiousYou.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="font-brand text-lg font-semibold">Choose {content.name} when…</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {content.whenCompetitor.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section>
              <h2 className="font-brand text-lg font-semibold">Common questions</h2>
              <Accordion type="single" collapsible className="mt-4">
                {compareFaq.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`compare-faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="flex justify-center pt-4">
              <PrimaryCta loggedOutLabel={brandCopy.cta.join} loggedOutHref="/signup" />
            </div>
          </div>
        </LandingSection>
      </article>
    </>
  );
}
