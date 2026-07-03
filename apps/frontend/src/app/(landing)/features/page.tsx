import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon, CheckIcon, FilterIcon, LayoutDashboardIcon, PlusCircleIcon, TargetIcon, TrendingUpIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";
import PrimaryCta from "@/components/(landing)/primary-cta";
import ComparisonLedger from "@/components/(landing)/comparison-ledger";
import LandingSection, { Eyebrow, LANDING_CARD } from "@/components/(landing)/landing-section";
import MockFrame from "@/components/(landing)/mock-frame";
import JsonLd from "@/components/seo/json-ld";
import WhatIsAmbitiousYou from "@/components/(landing)/marketing/what-is-ambitiousyou";
import { featuresFaq } from "@/components/(landing)/features/faq-data";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/schemas";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const dynamic = "force-static";

const description =
  "Discover the powerful features of AmbitiousYou — momentum tracking, honest day-streaks, a year-long contribution calendar, and a dashboard that turns every completed move into visible progress.";

export const metadata: Metadata = createPageMetadata({
  title: "Features",
  description,
  path: "/features",
  ogImageAlt: "AmbitiousYou Features",
});

const coreFeatures: { icon: LucideIcon; title: string; description: string; coreIdea?: boolean }[] = [
  {
    icon: LayoutDashboardIcon,
    title: "Ambition Dashboard",
    description: "Visualize all your goals in one place with our intuitive dashboard that provides at-a-glance progress tracking and priority management.",
  },
  {
    icon: TargetIcon,
    title: "Tasks & Milestones, Together",
    description: "Every ambition is built from moves — mix checkable tasks and one-time milestones in whatever blend fits the goal. No forced either-or.",
    coreIdea: true,
  },
  {
    icon: FilterIcon,
    title: "Custom Organization",
    description: "Categorize and prioritize your ambitions with flexible color-coding, and filtering options for perfect organization.",
  },
  {
    icon: PlusCircleIcon,
    title: "Quick Ambition Creation",
    description: "Our streamlined ambition creation process gets you from idea to execution in minutes, not hours.",
  },
  {
    icon: TrendingUpIcon,
    title: "Momentum & Honest Streaks",
    description: "See exactly how many moves you complete each day over the last week, two weeks, or month — with a day-streak that only counts real completions, never busywork.",
  },
  {
    icon: CalendarDaysIcon,
    title: "A Year of Progress at a Glance",
    description: "A GitHub-style contribution calendar turns every completed move into a square, so your consistency across the whole year is visible in a single look.",
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Create Your Ambition",
    description: "Define your goal with our guided setup process, setting deadlines, priorities, and your first moves.",
  },
  {
    step: "02",
    title: "Track Your Progress",
    description: "Break your ambition into moves — tasks and milestones — and watch your progress fill in visually.",
  },
  {
    step: "03",
    title: "Achieve & Celebrate",
    description: "Reach your goals faster with data-backed insights and celebrate your accomplishments along the way.",
  },
];

const benefits = ["Every ambition, its moves, notes, and progress — in one place instead of five apps", "Set up your first ambition in about a minute — no setup marathon", "Progress recalculates as you check off moves, so you always know where you stand"];

const differencePairs = [
  { without: "Goals scattered across multiple apps and notes", with: "All ambitions organized in one unified system" },
  { without: "Unclear progress tracking leads to abandoned ambitions", with: "Visual progress tracking keeps you motivated daily" },
  { without: "Overwhelming feeling when managing multiple goals", with: "Prioritization tools ensure focus on what matters most" },
  { without: "No visibility into how far along any goal actually is", with: "Dashboard insights show where your effort is paying off" },
];

function AmbitionVignette() {
  const moves = [
    { kind: "Milestone", label: "Complete the AWS certification", done: true },
    { kind: "Task", label: "Write the architecture design doc", done: true },
    { kind: "Milestone", label: "Lead the Q2 architecture review", done: false },
  ];

  return (
    <div aria-hidden="true" className="rounded-2xl bg-linear-to-tr from-primary/15 dark:from-chart-1/15 to-secondary/10 p-1.5 shadow-lg">
      <MockFrame url="ambitiousyou.pro/ambitions" className="shadow-none">
        <div className="bg-card/90 p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: "#00bfff" }} />
              <span className="truncate text-sm font-semibold">Get Promoted to Senior Engineer</span>
            </div>
            <span className="shrink-0 rounded border border-red-500 px-1.5 py-0.5 font-mono text-xs uppercase text-red-500">High</span>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium">Progress</span>
              <span className="tabular-nums text-muted-foreground">2 of 3 moves · 67%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: "67%" }} />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {moves.map((move) => (
              <div key={move.label} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2">
                {move.done ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-primary bg-primary">
                    <CheckIcon className="size-3.5 text-primary-foreground" />
                  </span>
                ) : (
                  <span className="size-5 shrink-0 rounded-md border border-border" />
                )}
                <span className={cn("min-w-0 truncate text-sm", move.done && "text-muted-foreground line-through")}>{move.label}</span>
                <span className={cn("ml-auto shrink-0 rounded border px-1 font-mono text-[10px] uppercase", move.kind === "Milestone" ? "border-violet-500/50 text-violet-600 dark:text-violet-400" : "border-border text-muted-foreground")}>{move.kind}</span>
              </div>
            ))}
          </div>
        </div>
      </MockFrame>
    </div>
  );
}

export default function Features() {
  return (
    <div className="flex w-full flex-col items-center">
      <JsonLd
        data={[
          faqPageSchema(featuresFaq),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Features", path: "/features" },
          ]),
        ]}
      />

      <WhatIsAmbitiousYou />

      {/* Hero */}
      <section className="relative w-full px-4 pt-16 md:px-6 md:pt-20">
        {/* <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80" style={{ background: "radial-gradient(32rem 14rem at 50% 0%, color-mix(in oklch, oklch(0.56 0.24 300) 9%, transparent) 0%, transparent 70%)" }} /> */}
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="lp-hero-enter font-brand text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-balance sm:text-5xl md:text-6xl">Features Built for the Ambitious</h1>
          <p className="lp-hero-enter-2 mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">Tools designed to elevate your performance, streamline your workflow, and help you achieve your most ambitious goals.</p>
          <div className="lp-hero-enter-3 mt-8 flex flex-col gap-3 min-[400px]:flex-row">
            <PrimaryCta loggedOutLabel="Get Started Free" loggedOutHref="/signup" size="lg" />
            <Button asChild size="lg" variant="outline">
              <Link prefetch={true} href="/experience">
                Try It Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <LandingSection eyebrow="Core features" title="Core Features" lede="Everything you need to take your productivity to the next level." className="pb-12 md:pb-16">
        <div className="lp-reveal grid grid-cols-1 gap-5 md:grid-cols-2">
          {coreFeatures.map((feature) => (
            <div key={feature.title} className={cn(LANDING_CARD, "p-6", feature.coreIdea && "border-primary/30 dark:border-chart-1/30")}>
              {feature.coreIdea ? (
                <p className="lp-eyebrow mb-3 font-mono text-xs font-medium uppercase tracking-[0.18em]">The core idea</p>
              ) : null}
              <div className="flex items-center gap-2.5">
                <feature.icon aria-hidden="true" className="size-5 shrink-0 text-primary dark:text-chart-1" />
                <h3 className="font-brand text-lg font-semibold tracking-[-0.01em] md:text-xl">{feature.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      {/* How AmbitiousYou Works */}
      <LandingSection id="how-it-works" eyebrow="The process" title="How AmbitiousYou Works" lede="Our simple process helps you transform goals into achievements." className="py-12 md:py-16">
        <ol className="lp-reveal grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {howItWorksSteps.map((item) => (
            <li key={item.step} className="border-t border-border/60 pt-5">
              <Eyebrow index={item.step}>Step</Eyebrow>
              <h3 className="mt-3 font-brand text-lg font-semibold tracking-[-0.01em] md:text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{item.description}</p>
            </li>
          ))}
        </ol>
      </LandingSection>

      {/* Benefits */}
      <section className="w-full scroll-mt-24 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="lp-reveal">
              <Eyebrow>Why ambitious people choose us</Eyebrow>
              <h2 className="mt-4 font-brand text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">Transform your potential into exceptional results</h2>
              <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground md:text-lg">It’s built for people who refuse to settle — one calm, private place where every goal actually moves.</p>

              <ul className="mt-7 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-green-500" />
                    <p className="text-base font-medium leading-snug">{benefit}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <PrimaryCta loggedOutLabel="Start Your Journey" loggedOutHref="/signup" />
              </div>
            </div>

            <div className="lp-reveal">
              <AmbitionVignette />
            </div>
          </div>
        </div>
      </section>

      {/* The Ambitious Difference */}
      <LandingSection eyebrow="The difference" title="The Ambitious Difference" lede="See how your life transforms when you start using AmbitiousYou." align="center" className="py-12 md:py-16">
        <ComparisonLedger pairs={differencePairs} />
      </LandingSection>

      {/* FAQ */}
      <LandingSection eyebrow="FAQ" title="Frequently Asked Questions" lede="Everything you need to know about getting started with AmbitiousYou." align="center" className="py-12 md:py-16">
        <div className="lp-reveal mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {featuresFaq.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </LandingSection>

      {/* CTA */}
      <section className="w-full py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="lp-reveal relative mx-auto max-w-2xl text-center">
            <h2 className="font-brand text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">Ready to achieve your most ambitious goals?</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">Start for free today — your first ambition takes about a minute to set up. No credit card required.</p>
            <div className="mt-8 flex justify-center">
              <PrimaryCta loggedOutLabel="Get Started Free" loggedOutHref="/signup" size="lg" className="px-8" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
