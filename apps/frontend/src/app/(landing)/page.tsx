import AnimatedHero from "@/components/(landing)/homepage/animated-hero";
import BeforeAfter from "@/components/(landing)/homepage/before-after";
import CTA from "@/components/(landing)/homepage/cta";
import Features from "@/components/(landing)/homepage/features";
import HowItWorks from "@/components/(landing)/homepage/how-it-works";
import Outcomes from "@/components/(landing)/homepage/outcomes";
import ProblemAgitation from "@/components/(landing)/homepage/problem-agitation";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <AnimatedHero />
      <ProblemAgitation />
      <HowItWorks />
      <Features />
      <BeforeAfter />
      <Outcomes />
      <CTA />
    </>
  );
}
