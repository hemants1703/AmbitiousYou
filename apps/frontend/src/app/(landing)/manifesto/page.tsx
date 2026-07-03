import PrimaryCta from "@/components/(landing)/primary-cta";
import LandingSection from "@/components/(landing)/landing-section";
import JsonLd from "@/components/seo/json-ld";
import { brandCopy } from "@/lib/brand";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

const title = "The Ambitious Ones";
const description =
  "A manifesto for people who think in ambitions, not errands — outcomes over busywork, honest progress, private by default.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/manifesto",
});

const principles = [
  {
    heading: "Outcomes over busywork",
    body: "We don't optimise for inbox zero. We optimise for the promotion, the degree, the launch, the race — the things that actually change your life.",
  },
  {
    heading: "Honest progress",
    body: "Real timestamps. Real streaks. No inflated scores, no gamification theatre. If you didn't move today, the calendar shows it — and that's okay, because tomorrow you can.",
  },
  {
    heading: "Private by default",
    body: "Your ambitions are yours alone. No social feeds, no performance for an audience. You run your goals for you.",
  },
  {
    heading: "Ambitions, not errands",
    body: "Groceries belong in a task app. A career switch, a semester, a product launch — those are ambitions. They deserve a system built for months, not minutes.",
  },
] as const;

export default function ManifestoPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/manifesto" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: title, path: "/manifesto" },
          ]),
        ]}
      />

      <LandingSection eyebrow="Manifesto" title="The Ambitious Ones" lede={brandCopy.identityLine} className="pt-16 md:pt-24" align="center">
        <div className="mx-auto max-w-2xl space-y-6 text-center text-base leading-relaxed text-muted-foreground">
          <p>
            There&apos;s a type of person who doesn&apos;t lack drive — they lack a system. They carry big goals in their head, in scattered notes, in half-finished lists that were never meant to hold a six-month ambition.
          </p>
          <p>
            <span translate="no">AmbitiousYou</span> exists for them. Not for people chasing inbox zero. Not for teams coordinating sprints. For the ones building toward something that takes weeks or months — and refuse to let it fade because nothing holds it together, day to day.
          </p>
          <p className="font-brand text-lg font-semibold tracking-[-0.02em] text-foreground">We call them the ambitious ones.</p>
        </div>
      </LandingSection>

      <LandingSection eyebrow="Principles" title="What we believe" align="center" className="pb-8">
        <ul className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {principles.map((item) => (
            <li key={item.heading} className="rounded-2xl border border-border/60 bg-card/60 p-6 text-left">
              <h2 className="font-brand text-lg font-semibold">{item.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ul>
      </LandingSection>

      <LandingSection eyebrow="Belonging" title="If that sounds like you, you're already one of us." align="center" className="pb-16 md:pb-24">
        <p className="mx-auto max-w-xl text-center text-base leading-relaxed text-muted-foreground">
          Using <span translate="no">AmbitiousYou</span> isn&apos;t about downloading another app. It&apos;s declaring that your ambitions deserve more than a grocery list. Claim your first ambition — it takes about a minute.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <PrimaryCta loggedOutLabel={brandCopy.cta.claimFirst} loggedOutHref="/signup" size="lg" />
          <Link href="/brief" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Read The Ambitious Brief
          </Link>
        </div>
      </LandingSection>
    </>
  );
}
