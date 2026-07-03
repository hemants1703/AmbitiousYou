import PrimaryCta from "@/components/(landing)/primary-cta";
import LandingSection from "@/components/(landing)/landing-section";
import JsonLd from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { useCaseSlugs } from "@/lib/seo/pages";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import { getUseCaseContent } from "@/lib/seo/use-case-content";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

interface UseCasePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return useCaseSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: UseCasePageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const content = getUseCaseContent(slug);
  if (!content) return {};

  return createPageMetadata({
    title: content.title,
    description: content.description,
    path: `/use-cases/${slug}`,
  });
}

export default async function UseCaseDetailPage(props: UseCasePageProps) {
  const { slug } = await props.params;
  const content = getUseCaseContent(slug);
  if (!content) notFound();

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title: content.title, description: content.description, path: `/use-cases/${slug}` }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Use Cases", path: "/use-cases" },
            { name: content.title, path: `/use-cases/${slug}` },
          ]),
        ]}
      />
      <article className="pt-16 md:pt-24">
        <LandingSection eyebrow="Use case" title={content.headline} lede={content.description}>
          <div className="mx-auto max-w-3xl space-y-8">
            <p className="text-base leading-relaxed text-muted-foreground">{content.story}</p>
            <section>
              <h2 className="font-brand text-xl font-semibold tracking-[-0.02em]">How AmbitiousYou helps</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {content.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
            <div className="flex flex-wrap gap-4 pt-4">
              <PrimaryCta loggedOutLabel="Get Started Free" loggedOutHref="/signup" />
              <Link href="/experience" className="inline-flex items-center text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
                Try the interactive demo
              </Link>
            </div>
          </div>
        </LandingSection>
      </article>
    </>
  );
}
