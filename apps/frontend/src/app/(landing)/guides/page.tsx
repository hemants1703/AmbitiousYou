import MarketingHubCard from "@/components/(landing)/marketing/marketing-hub-card";
import LandingSection from "@/components/(landing)/landing-section";
import LastUpdated from "@/components/(landing)/marketing/last-updated";
import JsonLd from "@/components/seo/json-ld";
import { getAllGuides } from "@/lib/seo/guide-content";
import { marketingContentUpdated } from "@/lib/seo/content-dates";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema, webPageSchema } from "@/lib/seo/schemas";
import type { Metadata } from "next";

export const dynamic = "force-static";

const title = "Guides";
const description =
  "Practical guides on ambition management, long-term goal tracking, career switches, semester planning, and honest momentum — written for people, structured for clarity.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/guides",
});

export default function GuidesHubPage() {
  const guides = getAllGuides();

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/guides", dateModified: marketingContentUpdated }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]),
          itemListSchema({ name: "AmbitiousYou guides", items: guides.map((g) => g.title) }),
        ]}
      />
      <LandingSection eyebrow="Guides" title="Ambition management, explained clearly" lede={description} className="pt-16 md:pt-24" align="center">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <MarketingHubCard key={guide.slug} href={`/guides/${guide.slug}`} title={guide.title} description={guide.summary} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <LastUpdated />
        </div>
      </LandingSection>
    </>
  );
}
