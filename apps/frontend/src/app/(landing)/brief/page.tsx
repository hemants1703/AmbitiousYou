import PrimaryCta from "@/components/(landing)/primary-cta";
import LandingSection, { LANDING_CARD } from "@/components/(landing)/landing-section";
import JsonLd from "@/components/seo/json-ld";
import { brandCopy } from "@/lib/brand";
import { briefConfig, contentPillars } from "@/lib/marketing/content-pillars";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

const title = briefConfig.title;
const description = briefConfig.tagline;

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/brief",
});

export default function BriefPage() {
  const subscribeHref = `mailto:${briefConfig.subscribeEmail}?subject=${encodeURIComponent(briefConfig.subscribeSubject)}`;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/brief" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: title, path: "/brief" },
          ]),
        ]}
      />

      <LandingSection eyebrow="Newsletter" title={briefConfig.title} lede={briefConfig.tagline} className="pt-16 md:pt-24" align="center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4">
          <PrimaryCta loggedOutLabel="Join the ambitious ones" loggedOutHref="/signup" size="lg" />
          <Link href={subscribeHref} className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Subscribe via email
          </Link>
          <Link href={briefConfig.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Follow on LinkedIn
          </Link>
          <Link href="/ambitious-ones-badge.svg" download className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Download the Ambitious Ones badge
          </Link>
        </div>
      </LandingSection>

      <LandingSection eyebrow="Themes" title="What you'll read about" lede="Recognition beats tips. Each issue picks up one of these threads — ideas for people who think in ambitions, not errands." align="center">
        <ul className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          {contentPillars.map((pillar) => (
            <li key={pillar.id} className={LANDING_CARD + " p-6 text-left"}>
              <h2 className="font-brand text-lg font-semibold">{pillar.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.excerpt}</p>
            </li>
          ))}
        </ul>
      </LandingSection>

      <LandingSection eyebrow="Start here" title="New to the tribe?" align="center" className="pb-16 md:pb-24">
        <p className="mx-auto max-w-xl text-center text-base leading-relaxed text-muted-foreground">
          Read <Link href="/manifesto" className="underline underline-offset-4 hover:text-foreground">The Ambitious Ones manifesto</Link>, then {brandCopy.cta.claimFirst.toLowerCase()}.
        </p>
      </LandingSection>
    </>
  );
}
