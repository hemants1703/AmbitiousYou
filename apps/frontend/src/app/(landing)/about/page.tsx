import PrimaryCta from "@/components/(landing)/primary-cta";
import LandingSection from "@/components/(landing)/landing-section";
import JsonLd from "@/components/seo/json-ld";
import { productDefinition } from "@/lib/seo/faqs";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, organizationSchema, webPageSchema } from "@/lib/seo/schemas";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

const title = "About";
const description =
  "AmbitiousYou helps ambitious people turn long-term goals into daily momentum — free, private, and built for outcomes that matter over months, not chores.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/about" }),
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <LandingSection eyebrow="About" title="Built for people who think in ambitions, not errands" lede={productDefinition} className="pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl space-y-8 text-base leading-relaxed text-muted-foreground">
          <p>
            Most productivity tools optimise for what&apos;s due today. <span translate="no">AmbitiousYou</span> is different — it&apos;s designed for goals that take weeks or months: a promotion, a degree, a product launch, a half marathon. Each ambition holds tasks, milestones, notes, deadlines, and priorities in one place, with progress that recalculates as you move.
          </p>
          <p>
            We believe momentum should be honest. Your dashboard shows real completion data — charts of moves finished each day, a year-long contribution calendar, and streaks that only count days you actually did something. No inflated scores, no gamification theatre.
          </p>
          <p>
            Privacy is non-negotiable. Your ambitions are yours alone — no social feeds, no sharing features, no data sold to advertisers. Session-based authentication and encrypted traffic protect your account.
          </p>
        </div>
      </LandingSection>

      <LandingSection eyebrow="Values" title="What we optimise for" align="center" className="pb-8">
        <ul className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            { heading: "Outcomes over busywork", body: "Structure goals that matter, not infinite inbox lists." },
            { heading: "Honest progress", body: "Real timestamps, real streaks — nothing estimated." },
            { heading: "Accessible by default", body: "Free to use. No credit card. No artificial limits." },
          ].map((item) => (
            <li key={item.heading} className="rounded-2xl border border-border/60 bg-card/60 p-6 text-center">
              <h2 className="font-brand text-lg font-semibold">{item.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ul>
      </LandingSection>

      <LandingSection eyebrow="Creator" title="Made by a builder who needed it" align="center" className="pb-16 md:pb-24">
        <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
          AmbitiousYou is developed by{" "}
          <Link href="https://hemantsharma.tech" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
            Hemant Sharma
          </Link>
          . The product exists because generic task managers never captured how it feels to pursue something ambitious over months — and building a custom Notion setup shouldn&apos;t be a prerequisite for progress.
        </p>
        <div className="mt-10 flex justify-center">
          <PrimaryCta loggedOutLabel="Get Started Free" loggedOutHref="/signup" />
        </div>
      </LandingSection>
    </>
  );
}
