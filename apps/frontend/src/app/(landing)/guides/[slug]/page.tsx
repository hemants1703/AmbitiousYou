import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { brandCopy } from "@/lib/brand";
import PrimaryCta from "@/components/(landing)/primary-cta";
import LandingSection from "@/components/(landing)/landing-section";
import LastUpdated from "@/components/(landing)/marketing/last-updated";
import JsonLd from "@/components/seo/json-ld";
import { getGuideContent, guideSlugs } from "@/lib/seo/guide-content";
import { createPageMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema, faqPageSchema, howToSchema, webPageSchema } from "@/lib/seo/schemas";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";


interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: GuidePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const content = getGuideContent(slug);
  if (!content) return {};

  return createPageMetadata({
    title: content.title,
    description: content.description,
    path: `/guides/${slug}`,
    keywords: ["ambition management", "goal tracking", "long-term goals", content.title],
  });
}

export default async function GuideDetailPage(props: GuidePageProps) {
  const { slug } = await props.params;
  const content = getGuideContent(slug);
  if (!content) notFound();

  const schemas = [
    webPageSchema({
      title: content.title,
      description: content.description,
      path: `/guides/${slug}`,
      dateModified: content.dateModified,
      datePublished: content.datePublished,
    }),
    articleSchema({
      title: content.title,
      description: content.description,
      path: `/guides/${slug}`,
      datePublished: content.datePublished,
      dateModified: content.dateModified,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: content.title, path: `/guides/${slug}` },
    ]),
    ...(content.howTo ? [howToSchema(content.howTo)] : []),
    ...(content.faqs && content.faqs.length > 0 ? [faqPageSchema(content.faqs)] : []),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <article className="pt-16 md:pt-24">
        <LandingSection eyebrow="Guide" title={content.title} lede={content.description}>
          <div className="mx-auto max-w-3xl space-y-12">
            <LastUpdated date={content.dateModified} className="text-sm text-muted-foreground" />

            {content.sections.map((section) => (
              <section key={section.heading} className="scroll-mt-24 space-y-4">
                <h2 className="font-brand text-xl font-semibold tracking-[-0.02em] md:text-2xl">{section.heading}</h2>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{section.answer}</p>
                {section.body?.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {section.steps ? (
                  <ol className="list-decimal space-y-3 pl-5 text-base leading-relaxed text-muted-foreground">
                    {section.steps.map((step) => (
                      <li key={step.name}>
                        <span className="font-medium text-foreground">{step.name}: </span>
                        {step.text}
                      </li>
                    ))}
                  </ol>
                ) : null}
                {section.bullets ? (
                  <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {content.faqs && content.faqs.length > 0 ? (
              <section className="scroll-mt-24">
                <h2 className="font-brand text-xl font-semibold">Common questions</h2>
                <Accordion type="single" collapsible className="mt-4">
                  {content.faqs.map((faq, index) => (
                    <AccordionItem key={faq.question} value={`guide-faq-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ) : null}

            {content.relatedPaths && content.relatedPaths.length > 0 ? (
              <section className="scroll-mt-24">
                <h2 className="font-brand text-xl font-semibold">Related</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {content.relatedPaths.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-accent-brand underline-offset-4 hover:underline">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="flex justify-center pt-4">
              <PrimaryCta loggedOutLabel={brandCopy.cta.claimFirst} loggedOutHref="/signup" />
            </div>
          </div>
        </LandingSection>
      </article>
    </>
  );
}
