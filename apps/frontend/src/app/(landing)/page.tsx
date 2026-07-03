import Hero from "@/components/(landing)/homepage/hero";
import BeforeAfter from "@/components/(landing)/homepage/before-after";
import CTA from "@/components/(landing)/homepage/cta";
import Features from "@/components/(landing)/homepage/features";
import HowItWorks from "@/components/(landing)/homepage/how-it-works";
import HomepageMidCta from "@/components/(landing)/homepage/homepage-mid-cta";
import Outcomes from "@/components/(landing)/homepage/outcomes";
import ProblemAgitation from "@/components/(landing)/homepage/problem-agitation";
import WhatIsAmbitiousYou from "@/components/(landing)/marketing/what-is-ambitiousyou";
import JsonLd from "@/components/seo/json-ld";
import { organizationSchema, softwareApplicationSchema, webSiteSchema } from "@/lib/seo/schemas";

export const dynamic = "force-static";

// Canonical and OpenGraph are inherited from the root layout (canonical "/" and
// og:url already point to this homepage); only the structured data is page-specific.
export default function Home() {
  return (
    <>
      <JsonLd data={[organizationSchema(), webSiteSchema(), softwareApplicationSchema()]} />
      <WhatIsAmbitiousYou />
      <Hero />
      <ProblemAgitation />
      <HowItWorks />
      <HomepageMidCta />
      <Features />
      <BeforeAfter />
      <Outcomes />
      <CTA />
    </>
  );
}
