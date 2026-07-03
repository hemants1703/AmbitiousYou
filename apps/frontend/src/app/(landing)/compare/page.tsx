import MarketingHubCard from "@/components/(landing)/marketing/marketing-hub-card";
import { brandCopy } from "@/lib/brand";
import PrimaryCta from "@/components/(landing)/primary-cta";
import LandingSection from "@/components/(landing)/landing-section";
import JsonLd from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { compareSlugs } from "@/lib/seo/pages";
import { breadcrumbSchema, itemListSchema, webPageSchema } from "@/lib/seo/schemas";
import { compareContent } from "@/lib/seo/compare-content";
import type { Metadata } from "next";

export const dynamic = "force-static";

const title = "Compare";
const description =
  "See how AmbitiousYou compares to Todoist, Notion, and Asana for long-term goal tracking versus daily tasks and team project management.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/compare",
});

export default function CompareHubPage() {
  const cards = compareSlugs.map((slug) => compareContent[slug]);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/compare" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Compare", path: "/compare" },
          ]),
          itemListSchema({ name: "AmbitiousYou comparisons", items: cards.map((c) => c.title) }),
        ]}
      />
      <LandingSection eyebrow="Compare" title="Purpose-built for ambitions, not inboxes" lede={description} className="pt-16 md:pt-24" align="center">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {cards.map((comparison) => (
            <MarketingHubCard key={comparison.slug} href={`/compare/${comparison.slug}`} title={comparison.title} description={comparison.summary} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <PrimaryCta loggedOutLabel={brandCopy.cta.join} loggedOutHref="/signup" />
        </div>
      </LandingSection>
    </>
  );
}
