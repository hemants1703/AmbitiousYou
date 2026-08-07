import { productDefinition } from "@/lib/seo/faqs";
import { LANDING_CARD } from "@/components/(landing)/landing-section";
import { cn } from "@/lib/utils";

interface WhatIsAmbitiousYouProps {
  /** When true, render as a compact inline block (e.g. below hero). Default: full section. */
  compact?: boolean;
  className?: string;
}

/**
 * Visible, citeable product definition for people and AI systems.
 * `id` anchors llms.txt / OKF references.
 */
export default function WhatIsAmbitiousYou(props: WhatIsAmbitiousYouProps) {
  if (props.compact) {
    return (
      <section id="what-is-ambitiousyou" aria-labelledby="what-is-heading" className={cn("scroll-mt-24", props.className)}>
        <h2 id="what-is-heading" className="font-brand text-xl font-semibold tracking-[-0.02em] md:text-2xl">
          What is AmbitiousYou?
        </h2>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-muted-foreground">{productDefinition}</p>
      </section>
    );
  }

  return (
    <section id="what-is-ambitiousyou" aria-labelledby="what-is-heading" className={cn("w-full scroll-mt-24 py-12 md:py-16", props.className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className={cn(LANDING_CARD, "p-6 md:p-8")}>
          <h2 id="what-is-heading" className="font-brand text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
            What is AmbitiousYou?
          </h2>
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-muted-foreground md:text-lg">{productDefinition}</p>
          <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
            Use it for outcomes that take weeks or months — a promotion, a degree, a product launch — not for daily errands. Progress recalculates as you complete moves; your dashboard shows real momentum, not inflated scores.
          </p>
        </div>
      </div>
    </section>
  );
}
