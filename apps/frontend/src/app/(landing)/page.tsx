import Hero from "@/components/(landing)/homepage/hero";
import BeforeAfter from "@/components/(landing)/homepage/before-after";
import CTA from "@/components/(landing)/homepage/cta";
import Features from "@/components/(landing)/homepage/features";
import HowItWorks from "@/components/(landing)/homepage/how-it-works";
import HomepageMidCta from "@/components/(landing)/homepage/homepage-mid-cta";
import Outcomes from "@/components/(landing)/homepage/outcomes";
import ProblemAgitation from "@/components/(landing)/homepage/problem-agitation";
import FaqSection from "@/components/(landing)/marketing/faq-section";
import WhatIsAmbitiousYou from "@/components/(landing)/marketing/what-is-ambitiousyou";
import LastUpdated from "@/components/(landing)/marketing/last-updated";
import LandingSection from "@/components/(landing)/landing-section";
import JsonLd from "@/components/seo/json-ld";
import { homepageFaq } from "@/lib/seo/faqs";
import { marketingContentUpdated } from "@/lib/seo/content-dates";
import { faqPageSchema, organizationSchema, personSchema, softwareApplicationSchema, webSiteSchema } from "@/lib/seo/schemas";

export const dynamic = "force-static";

// Canonical and OpenGraph are inherited from the root layout (canonical "/" and
// file-based opengraph-image); structured data + extractable blocks are page-specific.
export default function Home() {
  return (
    <>
      <JsonLd data={[organizationSchema(), personSchema(), webSiteSchema(), softwareApplicationSchema(), faqPageSchema(homepageFaq)]} />
      <Hero />
      <WhatIsAmbitiousYou />
      <ProblemAgitation />
      <HowItWorks />
      <HomepageMidCta />
      <Features />
      <BeforeAfter />
      <Outcomes />
      <LandingSection eyebrow="FAQ" title="Answers in plain language" lede="Short, self-contained answers so you — and search engines — can see what AmbitiousYou is without the sales fluff." className="pb-8">
        <div className="mx-auto max-w-3xl">
          <FaqSection faqs={homepageFaq} title="Common questions" />
          <LastUpdated date={marketingContentUpdated} />
        </div>
      </LandingSection>
      <CTA />
    </>
  );
}
