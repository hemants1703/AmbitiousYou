import type { FaqItem } from "@/lib/seo/schemas";

/**
 * FAQ content for /features. Shared by the visible Accordion and the FAQPage
 * JSON-LD so the rendered copy and the structured data can never drift.
 */
export const featuresFaq: readonly FaqItem[] = [
  {
    question: "How is AmbitiousYou different from regular task managers?",
    answer:
      "Unlike simple task managers, AmbitiousYou is specifically designed for long-term ambition tracking with dual progress methods (tasks or milestones), built-in time tracking, and powerful analytics that keep you motivated and focused on your biggest goals.",
  },
  {
    question: "Is there a free plan available?",
    answer: "Yes! AmbitiousYou offers a comprehensive free plan that includes up to 3 active ambitions, basic progress tracking, and access to our core dashboard features. No credit card required to get started.",
  },
  {
    question: "How secure is my data?",
    answer: "We take data privacy seriously. All your information is encrypted both in transit and at rest. We never sell your data to third parties, and you can export or delete your information at any time.",
  },
  {
    question: "Can I use AmbitiousYou on all my devices?",
    answer: "Absolutely! AmbitiousYou works seamlessly on desktop, tablet, and mobile devices with a responsive web design. Native mobile apps for iOS and Android are coming soon!",
  },
];
