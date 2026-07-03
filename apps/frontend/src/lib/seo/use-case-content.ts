import type { UseCaseSlug } from "@/lib/seo/pages";

export interface UseCaseContent {
  slug: UseCaseSlug;
  title: string;
  headline: string;
  description: string;
  story: string;
  benefits: readonly string[];
}

export const useCaseContent: Record<UseCaseSlug, UseCaseContent> = {
  "student-academic": {
    slug: "student-academic",
    title: "Goal Tracking for Students",
    headline: "Turn semesters into conquerable milestones",
    description:
      "Structure exams, papers, and certifications as ambitions with tasks and milestones — so overwhelming syllabi become trackable progress.",
    story:
      "Every exam, every paper, every certification is a stepping stone. You're not just studying to pass — you're learning to excel. Your academic journey is intense, but structured goals turn overwhelming syllabi into conquerable milestones.",
    benefits: [
      "Break each course or certification into tasks with real deadlines",
      "Mark major wins as milestones — midterms, submissions, finals",
      "See semester progress recalculate as you complete moves",
      "Track momentum across study sessions with honest streaks",
    ],
  },
  "ambitious-professional": {
    slug: "ambitious-professional",
    title: "Career Goal Tracking for Professionals",
    headline: "Build your career by design, not accident",
    description:
      "Track promotions, certifications, and leadership goals with ambitions that mix daily tasks and career-defining milestones.",
    story:
      "You're not just working a job — you're building a career. Whether it's landing that promotion, mastering a new skill, or leading your first team, you know success doesn't happen by accident. It happens by design.",
    benefits: [
      "One ambition per career objective — promotion, certification, leadership",
      "Mix checkable tasks with one-time milestones like exams or reviews",
      "Priority levels keep high-impact goals visible on your dashboard",
      "Momentum charts show whether you're building real consistency",
    ],
  },
  "entrepreneur-founder": {
    slug: "entrepreneur-founder",
    title: "Goal Tracking for Entrepreneurs",
    headline: "Organize the chaos of building something that matters",
    description:
      "Juggle product, fundraising, and growth objectives without losing sight of what you're building.",
    story:
      "You're wearing ten hats before breakfast. Product, marketing, fundraising, hiring — the chaos is real, but so is your vision. You need a system that keeps ambitious goals organized while you build something that matters.",
    benefits: [
      "Separate ambitions for product, fundraising, hiring, and growth",
      "Milestones for launches, funding rounds, and key hires",
      "Notes capture decisions and context for each objective",
      "Dashboard stats keep the big picture visible during busy weeks",
    ],
  },
  "personal-growth": {
    slug: "personal-growth",
    title: "Personal Development Goal Tracker",
    headline: "Invest in becoming your best self",
    description:
      "Track fitness goals, language learning, and creative pursuits with the same rigour you bring to work.",
    story:
      "Life isn't just about work — it's about becoming the best version of yourself. Whether it's running your first marathon, learning guitar, or finally mastering Spanish, personal growth is the ultimate investment.",
    benefits: [
      "Structure long-term pursuits like marathons or language fluency",
      "Milestones mark real progress — first 5K, conversational level, recital",
      "Contribution calendar visualises consistency over the whole year",
      "Private by default — your personal goals stay yours",
    ],
  },
};

export function getUseCaseContent(slug: string): UseCaseContent | undefined {
  return useCaseContent[slug as UseCaseSlug];
}
