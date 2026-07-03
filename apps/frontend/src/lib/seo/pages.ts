import type { MetadataRoute } from "next";

export type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export interface IndexablePage {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  /** Short summary for llms.txt and internal docs. */
  summary: string;
}

/** Persona slugs exposed as /use-cases/[slug] marketing pages. */
export const useCaseSlugs = [
  "student-academic",
  "ambitious-professional",
  "entrepreneur-founder",
  "personal-growth",
] as const;

export type UseCaseSlug = (typeof useCaseSlugs)[number];

/** Competitor slugs exposed as /compare/[competitor] pages. */
export const compareSlugs = ["todoist", "notion", "asana"] as const;

export type CompareSlug = (typeof compareSlugs)[number];

/** Template slugs exposed as /templates/[slug] marketing pages. */
export const templateSlugs = ["student-semester", "career-switch"] as const;

export type TemplateSlug = (typeof templateSlugs)[number];

const corePages: IndexablePage[] = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1,
    summary: "Homepage — ambition management and goal tracking for long-term outcomes.",
  },
  {
    path: "/features",
    changeFrequency: "monthly",
    priority: 0.9,
    summary: "Product features — momentum tracking, streaks, contribution calendar, and dashboard insights.",
  },
  {
    path: "/experience",
    changeFrequency: "monthly",
    priority: 0.8,
    summary: "Interactive demo — try AmbitiousYou with sample ambitions before signing up.",
  },
  {
    path: "/about",
    changeFrequency: "monthly",
    priority: 0.7,
    summary: "About AmbitiousYou — mission, values, and who built the platform.",
  },
  {
    path: "/manifesto",
    changeFrequency: "monthly",
    priority: 0.8,
    summary: "The Ambitious Ones — manifesto for people who think in ambitions, not errands.",
  },
  {
    path: "/brief",
    changeFrequency: "weekly",
    priority: 0.75,
    summary: "The Ambitious Brief — biweekly newsletter on ambitions, honest momentum, and ambition stories.",
  },
  {
    path: "/templates",
    changeFrequency: "monthly",
    priority: 0.72,
    summary: "Ambition templates — ready-made structures for students, career switchers, and more.",
  },
  {
    path: "/pricing",
    changeFrequency: "monthly",
    priority: 0.85,
    summary: "Pricing — free to use, no credit card, no ambition limits.",
  },
  {
    path: "/use-cases",
    changeFrequency: "monthly",
    priority: 0.75,
    summary: "Use cases — how different people use AmbitiousYou for their goals.",
  },
  {
    path: "/compare",
    changeFrequency: "monthly",
    priority: 0.75,
    summary: "Comparisons — how AmbitiousYou differs from task managers and note apps.",
  },
  {
    path: "/privacy-policy",
    changeFrequency: "yearly",
    priority: 0.3,
    summary: "Privacy policy — how we collect, use, and protect your data.",
  },
  {
    path: "/terms-and-conditions",
    changeFrequency: "yearly",
    priority: 0.3,
    summary: "Terms and conditions for using AmbitiousYou.",
  },
];

const useCasePages: IndexablePage[] = useCaseSlugs.map((slug) => ({
  path: `/use-cases/${slug}`,
  changeFrequency: "monthly" as const,
  priority: 0.7,
  summary: `Use case — goal tracking tailored for ${slug.replace(/-/g, " ")}.`,
}));

const comparePages: IndexablePage[] = compareSlugs.map((slug) => ({
  path: `/compare/${slug}`,
  changeFrequency: "monthly" as const,
  priority: 0.72,
  summary: `Comparison — AmbitiousYou vs ${slug.charAt(0).toUpperCase() + slug.slice(1)}.`,
}));

const templatePages: IndexablePage[] = templateSlugs.map((slug) => ({
  path: `/templates/${slug}`,
  changeFrequency: "monthly" as const,
  priority: 0.68,
  summary: `Ambition template — structured goal plan for ${slug.replace(/-/g, " ")}.`,
}));

/** All public, indexable routes. Drives sitemap.xml and llms.txt. */
export const indexablePages: readonly IndexablePage[] = [...corePages, ...useCasePages, ...comparePages, ...templatePages];

export function getIndexablePage(path: string): IndexablePage | undefined {
  return indexablePages.find((page) => page.path === path);
}
