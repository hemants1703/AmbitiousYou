import type { CompareSlug } from "@/lib/seo/pages";

export interface ComparisonFeature {
  label: string;
  ambitiousyou: string;
  competitor: string;
}

export interface CompareContent {
  slug: CompareSlug;
  name: string;
  title: string;
  description: string;
  summary: string;
  features: readonly ComparisonFeature[];
  whenAmbitiousYou: readonly string[];
  whenCompetitor: readonly string[];
}

export const compareContent: Record<CompareSlug, CompareContent> = {
  todoist: {
    slug: "todoist",
    name: "Todoist",
    title: "AmbitiousYou vs Todoist",
    description:
      "An honest comparison between AmbitiousYou and Todoist for long-term goal tracking versus daily task management.",
    summary:
      "Todoist excels at capturing and completing daily tasks. AmbitiousYou is built for multi-month ambitions that combine tasks, milestones, notes, and automatic progress tracking.",
    features: [
      { label: "Primary focus", ambitiousyou: "Long-term ambitions and outcomes", competitor: "Daily tasks and projects" },
      { label: "Milestones", ambitiousyou: "Built-in, mixed freely with tasks", competitor: "Available as project sections" },
      { label: "Progress tracking", ambitiousyou: "Auto-recalculates per ambition", competitor: "Manual project progress" },
      { label: "Momentum & streaks", ambitiousyou: "Charts, calendar, honest day-streaks", competitor: "Karma and productivity stats" },
      { label: "Pricing", ambitiousyou: "Free", competitor: "Free tier with paid Pro plans" },
      { label: "Best for", ambitiousyou: "Career, academic, and life goals over months", competitor: "Inbox zero and daily productivity" },
    ],
    whenAmbitiousYou: [
      "You want to track a promotion, degree, or fitness goal over months",
      "You need milestones and tasks in one ambition with real progress %",
      "You want momentum charts without paying for premium features",
    ],
    whenCompetitor: [
      "You mainly need a fast daily todo inbox",
      "You rely on labels, filters, and integrations for task workflows",
      "You want native mobile apps with offline sync",
    ],
  },
  notion: {
    slug: "notion",
    name: "Notion",
    title: "AmbitiousYou vs Notion",
    description:
      "Compare AmbitiousYou's purpose-built ambition tracking with Notion's flexible workspace approach.",
    summary:
      "Notion is a powerful all-in-one workspace you configure yourself. AmbitiousYou is a focused app for ambitions — no templates or databases required.",
    features: [
      { label: "Setup time", ambitiousyou: "First ambition in about a minute", competitor: "Requires building your own system" },
      { label: "Structure", ambitiousyou: "Opinionated: ambitions → moves → progress", competitor: "Flexible pages, databases, templates" },
      { label: "Progress tracking", ambitiousyou: "Automatic per ambition", competitor: "Manual formulas or rollups" },
      { label: "Momentum insights", ambitiousyou: "Built-in charts and streaks", competitor: "Custom views if you build them" },
      { label: "Pricing", ambitiousyou: "Free", competitor: "Free tier with paid Plus/Business" },
      { label: "Best for", ambitiousyou: "Focused goal tracking out of the box", competitor: "Notes, wikis, and custom workflows" },
    ],
    whenAmbitiousYou: [
      "You want goal tracking without designing a database",
      "You care about momentum, streaks, and progress dashboards",
      "You prefer a single-purpose tool over a workspace",
    ],
    whenCompetitor: [
      "You need notes, docs, and wikis alongside tasks",
      "You enjoy building custom templates and dashboards",
      "You want team collaboration and shared workspaces",
    ],
  },
  asana: {
    slug: "asana",
    name: "Asana",
    title: "AmbitiousYou vs Asana",
    description:
      "How AmbitiousYou compares to Asana for personal ambitions versus team project management.",
    summary:
      "Asana is designed for team project management with assignments and timelines. AmbitiousYou is a personal ambition tracker for long-term individual goals.",
    features: [
      { label: "Primary audience", ambitiousyou: "Individuals pursuing personal ambitions", competitor: "Teams managing shared projects" },
      { label: "Goal structure", ambitiousyou: "Ambitions with mixed tasks and milestones", competitor: "Projects, sections, and tasks" },
      { label: "Collaboration", ambitiousyou: "Private by default, no sharing", competitor: "Team workspaces, assignments, comments" },
      { label: "Personal insights", ambitiousyou: "Streaks, contribution calendar, momentum", competitor: "Workload and project status views" },
      { label: "Pricing", ambitiousyou: "Free", competitor: "Free tier with paid Premium/Business" },
      { label: "Best for", ambitiousyou: "Personal career, academic, and life goals", competitor: "Cross-functional team delivery" },
    ],
    whenAmbitiousYou: [
      "Your goals are personal — career growth, learning, fitness",
      "You want progress and momentum tracking without team overhead",
      "You prefer simplicity over project management features",
    ],
    whenCompetitor: [
      "You manage work across a team with assignees and dependencies",
      "You need timelines, portfolios, and reporting for stakeholders",
      "You want integrations with Slack, Google, and enterprise tools",
    ],
  },
};

export function getCompareContent(slug: string): CompareContent | undefined {
  return compareContent[slug as CompareSlug];
}
