import LandingSection, { LANDING_CARD } from "@/components/(landing)/landing-section";
import JsonLd from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import { ambitionTemplates, type AmbitionTemplate } from "@/lib/seo/template-content";
import { templateSlugs } from "@/lib/seo/pages";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

const title = "Ambition Templates";
const description = "Ready-made ambition structures for students, career switchers, and other ambitious goals — use as-is or adapt to your path.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/templates",
});

const templates = templateSlugs.map((slug) => ambitionTemplates[slug]);

export default function TemplatesPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/templates" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: title, path: "/templates" },
          ]),
        ]}
      />

      <LandingSection eyebrow="Templates" title="Start with a proven structure" lede={description} className="pt-16 md:pt-24">
        <ul className="grid gap-5 md:grid-cols-2">
          {templates.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </ul>
      </LandingSection>
    </>
  );
}

function TemplateCard(props: { template: AmbitionTemplate }) {
  return (
    <li>
      <Link href={`/templates/${props.template.slug}`} className={LANDING_CARD + " block p-6 transition-colors hover:border-primary/40 dark:hover:border-chart-1/40"}>
        <h2 className="font-brand text-xl font-semibold tracking-[-0.02em]">{props.template.headline}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{props.template.description}</p>
        <p className="mt-4 text-sm font-medium text-primary dark:text-chart-1">View template →</p>
      </Link>
    </li>
  );
}
