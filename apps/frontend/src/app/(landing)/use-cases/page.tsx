import MarketingHubCard from "@/components/(landing)/marketing/marketing-hub-card";
import { brandCopy } from "@/lib/brand";
import PrimaryCta from "@/components/(landing)/primary-cta";
import LandingSection from "@/components/(landing)/landing-section";
import JsonLd from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { useCaseSlugs } from "@/lib/seo/pages";
import { breadcrumbSchema, itemListSchema, webPageSchema } from "@/lib/seo/schemas";
import { useCaseContent } from "@/lib/seo/use-case-content";
import type { Metadata } from "next";

export const dynamic = "force-static";

const title = "Use Cases";
const description =
  "See how students, professionals, founders, and personal-growth seekers use AmbitiousYou to track long-term goals with tasks, milestones, and momentum.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/use-cases",
});

export default function UseCasesPage() {
  const cards = useCaseSlugs.map((slug) => useCaseContent[slug]);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/use-cases" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Use Cases", path: "/use-cases" },
          ]),
          itemListSchema({ name: "AmbitiousYou use cases", items: cards.map((c) => c.title) }),
        ]}
      />
      <LandingSection eyebrow="Use cases" title="Ambitious goals look different for everyone" lede={description} className="pt-16 md:pt-24" align="center">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {cards.map((useCase) => (
            <MarketingHubCard key={useCase.slug} href={`/use-cases/${useCase.slug}`} title={useCase.title} description={useCase.headline} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <PrimaryCta loggedOutLabel={brandCopy.cta.join} loggedOutHref="/signup" />
        </div>
      </LandingSection>
    </>
  );
}
