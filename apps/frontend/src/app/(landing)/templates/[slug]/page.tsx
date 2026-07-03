import LandingSection from "@/components/(landing)/landing-section";
import { TemplateApplyButton } from "@/components/(landing)/templates/template-apply-button";
import JsonLd from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { templateSlugs } from "@/lib/seo/pages";
import { getAmbitionTemplate } from "@/lib/seo/template-content";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

interface TemplatePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return templateSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: TemplatePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const template = getAmbitionTemplate(slug);
  if (!template) return {};

  return createPageMetadata({
    title: template.title,
    description: template.description,
    path: `/templates/${slug}`,
  });
}

export default async function TemplateDetailPage(props: TemplatePageProps) {
  const { slug } = await props.params;
  const template = getAmbitionTemplate(slug);
  if (!template) notFound();

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title: template.title, description: template.description, path: `/templates/${slug}` }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Templates", path: "/templates" },
            { name: template.title, path: `/templates/${slug}` },
          ]),
        ]}
      />

      <article className="pt-16 md:pt-24">
        <LandingSection eyebrow="Template" title={template.headline} lede={template.description}>
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-base leading-relaxed text-muted-foreground">{template.story}</p>

            <section>
              <h2 className="font-brand text-xl font-semibold tracking-[-0.02em]">Included moves</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {template.moves.map((move) => (
                  <li key={move.title} className="flex gap-2">
                    <span className="shrink-0 font-mono text-xs uppercase text-primary dark:text-chart-1">{move.kind}</span>
                    <span>{move.title}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="pt-4">
              <TemplateApplyButton template={template} />
            </div>
          </div>
        </LandingSection>
      </article>
    </>
  );
}
