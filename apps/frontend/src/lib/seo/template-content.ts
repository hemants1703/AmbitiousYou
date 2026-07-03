import type { CreateAmbitionDraft } from "@/lib/(app)/create-ambition-draft";
import type { TemplateSlug } from "@/lib/seo/pages";

function toDateInputValue(date: Date): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return toDateInputValue(date);
}

function daysAgo(days: number): string {
  return daysFromNow(-days);
}

export interface AmbitionTemplate {
  slug: TemplateSlug;
  title: string;
  headline: string;
  description: string;
  story: string;
  moves: readonly { kind: "task" | "milestone"; title: string; description: string; daysOffset: number }[];
  draft: Omit<CreateAmbitionDraft, "moves"> & {
    moves: Omit<CreateAmbitionDraft["moves"][number], "id">[];
  };
}

function buildDraft(
  base: Omit<CreateAmbitionDraft, "moves">,
  moves: readonly { kind: "task" | "milestone"; title: string; description: string; daysOffset: number }[],
): AmbitionTemplate["draft"] {
  return {
    ...base,
    moves: moves.map((move) => ({
      kind: move.kind,
      title: move.title,
      description: move.description,
      date: daysFromNow(move.daysOffset),
    })),
  };
}

const studentMoves = [
  { kind: "milestone" as const, title: "Secure research assistant renewal", description: "Confirm the RA position for next semester with the lab", daysOffset: 30 },
  { kind: "task" as const, title: "Complete Algorithm Design project", description: "Implement and benchmark sorting algorithms", daysOffset: 15 },
  { kind: "task" as const, title: "Prepare for Database Systems midterm", description: "Review normalization, indexing, and query optimization", daysOffset: 25 },
  { kind: "task" as const, title: "Final exam preparation — all subjects", description: "Comprehensive review for finals week", daysOffset: 60 },
  { kind: "milestone" as const, title: "Finish the semester with a 9+ GPA", description: "Final grades posted across all six courses", daysOffset: 70 },
];

const careerSwitchMoves = [
  { kind: "milestone" as const, title: "Complete Product Management fundamentals course", description: "Reforge PM course + certification", daysOffset: 30 },
  { kind: "milestone" as const, title: "Build portfolio with 3 PM case studies", description: "Document product thinking through real-world analyses", daysOffset: 45 },
  { kind: "milestone" as const, title: "Network with 20 PMs in target companies", description: "Coffee chats, LinkedIn outreach, PM community events", daysOffset: 60 },
  { kind: "milestone" as const, title: "Get 5 PM role interviews", description: "Apply strategically, leverage network referrals", daysOffset: 90 },
  { kind: "milestone" as const, title: "Accept PM offer", description: "Negotiate and accept role at aligned company", daysOffset: 120 },
];

export const ambitionTemplates: Record<TemplateSlug, AmbitionTemplate> = {
  "student-semester": {
    slug: "student-semester",
    title: "Semester Excellence Template",
    headline: "Turn semesters into conquerable milestones",
    description: "A ready-made ambition structure for students — exams, papers, and certifications as trackable moves.",
    story:
      "Every exam, every paper, every certification is a stepping stone. This template breaks an overwhelming semester into tasks with real deadlines and milestones for the wins that matter.",
    moves: studentMoves,
    draft: buildDraft(
      {
        ambitionName: "Achieve 9+ GPA This Semester",
        ambitionDefinition: "Excel in all courses while maintaining research and extracurricular commitments",
        ambitionMotivation: "I'm building academic excellence by design, not by cramming.",
        priority: "high",
        startDate: daysAgo(7),
        endDate: daysFromNow(75),
      },
      studentMoves,
    ),
  },
  "career-switch": {
    slug: "career-switch",
    title: "Career Switch Playbook",
    headline: "Transition industries with a system, not chaos",
    description: "A structured ambition for career switchers — learning, portfolio, networking, and landing the role.",
    story:
      "Starting over takes strategic learning, networking, and proving yourself in a new domain. This template maps the path from fundamentals to offer acceptance.",
    moves: careerSwitchMoves,
    draft: buildDraft(
      {
        ambitionName: "Transition to Product Management",
        ambitionDefinition: "Land a PM role at a tech company through skill building, portfolio work, and networking",
        ambitionMotivation: "I'm brave enough to start over — and disciplined enough to finish.",
        priority: "high",
        startDate: daysAgo(14),
        endDate: daysFromNow(120),
      },
      careerSwitchMoves,
    ),
  },
};

export function getAmbitionTemplate(slug: string): AmbitionTemplate | undefined {
  return ambitionTemplates[slug as TemplateSlug];
}

/** Hydrate a template draft with fresh move ids for localStorage. */
export function hydrateTemplateDraft(template: AmbitionTemplate): CreateAmbitionDraft {
  return {
    ...template.draft,
    moves: template.draft.moves.map((move) => ({
      ...move,
      id: crypto.randomUUID(),
    })),
  };
}
