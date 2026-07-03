import { productDefinition } from "@/lib/seo/faqs";

/** Citeable product summary for crawlers and AI systems — id anchors llms.txt references. */
export default function WhatIsAmbitiousYou() {
  return (
    <section id="what-is-ambitiousyou" aria-label="What is AmbitiousYou" className="sr-only">
      <h2>What is AmbitiousYou?</h2>
      <p itemProp="description">{productDefinition}</p>
    </section>
  );
}
