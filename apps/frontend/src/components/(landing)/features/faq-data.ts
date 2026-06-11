import type { FaqItem } from "@/lib/seo/schemas";

/**
 * FAQ content for /features. Shared by the visible Accordion and the FAQPage
 * JSON-LD so the rendered copy and the structured data can never drift.
 * Every claim here must describe the product as it actually is — no invented
 * limits, tiers, or features.
 */
export const featuresFaq: readonly FaqItem[] = [
  {
    question: "How is AmbitiousYou different from regular task managers?",
    answer:
      "Task managers are built for chores. AmbitiousYou is built for long-term goals: each ambition is made of moves — a free mix of checkable tasks and one-time milestones — plus notes, a deadline, a priority, and a colour of its own. As you complete moves, the ambition’s progress recalculates, and your dashboard turns everything into stats and insights that keep the big picture in view.",
  },
  {
    question: "Is there a free plan available?",
    answer: "AmbitiousYou is free to use. There are no billing tiers, no credit card, and no cap on how many ambitions you create — sign up and start.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your ambitions are private by default. There are no sharing or social features, so nothing you write is visible to anyone else. Access is protected by session-based authentication, traffic is encrypted in transit, and we never sell your data. If you’d like your data removed, contact support@ambitiousyou.pro.",
  },
  {
    question: "Can I use AmbitiousYou on all my devices?",
    answer: "AmbitiousYou is a responsive web app — open it in any modern browser on desktop, tablet, or phone and your ambitions are there. There are no native iOS or Android apps right now.",
  },
];
