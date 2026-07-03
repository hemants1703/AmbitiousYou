import type { FaqItem } from "@/lib/seo/schemas";

/** Canonical product definition — citeable by search engines and AI systems. */
export const productDefinition =
  "AmbitiousYou is a free web app for long-term goal tracking. Each ambition combines tasks, milestones, notes, deadlines, and priorities — with a dashboard that recalculates progress, tracks momentum, and shows honest day-streaks. Private by default, no credit card required.";

export const featuresFaq: readonly FaqItem[] = [
  {
    question: "How is AmbitiousYou different from regular task managers?",
    answer:
      "Task managers are built for chores. AmbitiousYou is built for long-term goals: each ambition is made of moves — a free mix of checkable tasks and one-time milestones — plus notes, a deadline, a priority, and a colour of its own. As you complete moves, the ambition's progress recalculates, and your dashboard turns everything into stats and insights that keep the big picture in view.",
  },
  {
    question: "How does AmbitiousYou track my momentum and streaks?",
    answer:
      "Every move is timestamped the moment you complete it, so your dashboard shows real momentum — a chart of how many tasks and milestones you finished each day over the last 7, 14, or 30 days, a contribution calendar of the whole year, and a day-streak that only counts days you actually completed something. Nothing is estimated or inflated.",
  },
  {
    question: "Is there a free plan available?",
    answer: "AmbitiousYou is free to use. There are no billing tiers, no credit card, and no cap on how many ambitions you create — sign up and start.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your ambitions are private by default. There are no sharing or social features, so nothing you write is visible to anyone else. Access is protected by session-based authentication, traffic is encrypted in transit, and we never sell your data. If you'd like your data removed, contact support@ambitiousyou.pro.",
  },
  {
    question: "Can I use AmbitiousYou on all my devices?",
    answer: "AmbitiousYou is a responsive web app — open it in any modern browser on desktop, tablet, or phone and your ambitions are there. There are no native iOS or Android apps right now.",
  },
];

export const pricingFaq: readonly FaqItem[] = [
  {
    question: "Is AmbitiousYou really free?",
    answer: "Yes. AmbitiousYou is free to use with no billing tiers, no trial period, and no credit card required at signup.",
  },
  {
    question: "Are there limits on ambitions or moves?",
    answer: "No artificial caps. Create as many ambitions as you need, each with any mix of tasks and milestones.",
  },
  {
    question: "Will you add paid plans later?",
    answer: "We may introduce optional paid features in the future, but the core ambition-tracking experience you use today will remain free.",
  },
];

export const compareFaq: readonly FaqItem[] = [
  {
    question: "Should I replace my task manager with AmbitiousYou?",
    answer:
      "Not necessarily. AmbitiousYou is for long-term ambitions — career goals, academic targets, fitness milestones — not daily errands. Many people keep a simple todo app for chores and use AmbitiousYou for outcomes that matter over months.",
  },
  {
    question: "What makes AmbitiousYou different from Notion or Todoist?",
    answer:
      "Notion is a flexible workspace; Todoist excels at tasks. AmbitiousYou is purpose-built for ambitions: structured goals with mixed tasks and milestones, automatic progress recalculation, momentum charts, and streaks — without building your own system from scratch.",
  },
];
