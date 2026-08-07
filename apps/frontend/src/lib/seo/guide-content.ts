import type { FaqItem, HowToStep } from "@/lib/seo/schemas";
import { marketingContentPublished, marketingContentUpdated } from "@/lib/seo/content-dates";
import { productDefinition } from "@/lib/seo/faqs";

export const guideSlugs = [
  "what-is-ambition-management",
  "ambitions-vs-goals-vs-tasks",
  "how-to-track-long-term-goals",
  "career-switch-with-milestones",
  "student-semester-ambition",
  "goal-tracker-vs-todo-app",
  "honest-streaks-and-momentum",
] as const;

export type GuideSlug = (typeof guideSlugs)[number];

export interface GuideSection {
  heading: string;
  /** Lead answer — keep ~40–60 words for extractability. */
  answer: string;
  body?: readonly string[];
  steps?: readonly HowToStep[];
  bullets?: readonly string[];
}

export interface GuideContent {
  slug: GuideSlug;
  title: string;
  description: string;
  summary: string;
  datePublished: string;
  dateModified: string;
  sections: readonly GuideSection[];
  faqs?: readonly FaqItem[];
  relatedPaths?: readonly { title: string; href: string }[];
  howTo?: { name: string; description: string; steps: readonly HowToStep[] };
}

export const guideContent: Record<GuideSlug, GuideContent> = {
  "what-is-ambition-management": {
    slug: "what-is-ambition-management",
    title: "What Is Ambition Management?",
    description:
      "Ambition management is structuring long-term goals with tasks, milestones, and honest progress — not treating life outcomes like a daily todo list.",
    summary: "Definition of ambition management and how it differs from task and habit apps.",
    datePublished: marketingContentPublished,
    dateModified: marketingContentUpdated,
    sections: [
      {
        heading: "What is ambition management?",
        answer:
          "Ambition management is the practice of running long-term personal outcomes — careers, degrees, launches, fitness targets — as structured ambitions with tasks, milestones, deadlines, and progress you can trust. It sits above daily todos: chores keep life moving; ambitions keep direction.",
        body: [
          productDefinition,
          "Most productivity tools optimise for what is due today. Ambition management optimises for what must be true in three, six, or twelve months — and breaks that into moves you can complete without losing the plot.",
        ],
      },
      {
        heading: "What belongs in an ambition?",
        answer:
          "A clear ambition usually includes a named outcome, a time window, priority, notes for context, and a mix of checkable tasks plus one-time milestones. Progress should recalculate as work completes — not as a manual percentage you invent.",
        bullets: [
          "Outcome you can recognise when finished",
          "Start and target dates that match reality",
          "Tasks for repeatable or checklist work",
          "Milestones for irreversible wins",
          "Private notes for motivation and constraints",
        ],
      },
      {
        heading: "Who needs ambition management?",
        answer:
          "Anyone whose important work spans weeks or months: students finishing a semester, professionals switching roles, founders shipping a product, or people rebuilding habits around a life goal. If inbox zero does not equal progress on what matters, you need ambition management.",
      },
    ],
    faqs: [
      {
        question: "Is ambition management the same as OKRs?",
        answer:
          "Related, but not identical. OKRs are often team-oriented frameworks. Ambition management here means personal, private structure for long-term goals with day-to-day moves and honest momentum.",
      },
      {
        question: "Do I still need a todo app?",
        answer:
          "Often yes. Keep a light todo tool for errands and inbox capture. Use ambition management for outcomes that require sustained progress over months.",
      },
    ],
    relatedPaths: [
      { title: "Ambitions vs goals vs tasks", href: "/guides/ambitions-vs-goals-vs-tasks" },
      { title: "Features", href: "/features" },
      { title: "Templates", href: "/templates" },
    ],
  },
  "ambitions-vs-goals-vs-tasks": {
    slug: "ambitions-vs-goals-vs-tasks",
    title: "Ambitions vs Goals vs Tasks",
    description:
      "Clear definitions: tasks are units of work, goals are outcomes, ambitions are structured long-term goals with moves, progress, and momentum.",
    summary: "How ambitions, goals, and tasks differ — and how AmbitiousYou models them.",
    datePublished: marketingContentPublished,
    dateModified: marketingContentUpdated,
    sections: [
      {
        heading: "What is a task?",
        answer:
          "A task is a unit of work you can complete and check off — write the brief, submit the form, run the workout. Tasks are necessary but incomplete as a system for multi-month outcomes.",
      },
      {
        heading: "What is a goal?",
        answer:
          "A goal is a desired outcome: finish the degree, land the role, ship the launch. Without structure, goals stay vague intentions. Ambitions turn goals into runnable systems.",
      },
      {
        heading: "What is an ambition in AmbitiousYou?",
        answer:
          "An ambition is a long-term goal with structure: mixed tasks and milestones (moves), notes, deadlines, priority, colour, and automatic progress. Your dashboard then shows momentum and honest day-streaks from real completions.",
        body: [
          "Think of ambitions as the container, moves as the work, and the dashboard as the truth layer. You do not invent progress — completions timestamp it.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can one ambition have both tasks and milestones?",
        answer: "Yes. AmbitiousYou mixes checkable tasks and one-time milestones freely inside the same ambition — no forced either-or.",
      },
    ],
    relatedPaths: [
      { title: "What is ambition management?", href: "/guides/what-is-ambition-management" },
      { title: "How to track long-term goals", href: "/guides/how-to-track-long-term-goals" },
    ],
  },
  "how-to-track-long-term-goals": {
    slug: "how-to-track-long-term-goals",
    title: "How to Track Long-Term Goals",
    description:
      "A practical step-by-step method to track long-term goals with ambitions, moves, deadlines, and honest momentum — without gamification theatre.",
    summary: "Step-by-step guide to tracking multi-month goals with structure and real progress.",
    datePublished: marketingContentPublished,
    dateModified: marketingContentUpdated,
    howTo: {
      name: "How to track long-term goals",
      description: "Structure a multi-month outcome as an ambition with moves, then review honest momentum weekly.",
      steps: [
        { name: "Name the outcome", text: "Write a specific end-state you will recognise when finished — not a vague theme." },
        { name: "Set a realistic window", text: "Choose start and target dates that match the work, not fantasy calendars." },
        { name: "Break into moves", text: "Add a mix of tasks and milestones that cover learning, delivery, and irreversible wins." },
        { name: "Work in short sessions", text: "Complete moves regularly; let progress recalculate from completions." },
        { name: "Review momentum weekly", text: "Use charts, calendar, and streaks to see truth — then adjust moves, not the story." },
      ],
    },
    sections: [
      {
        heading: "How to track long-term goals",
        answer:
          "Name a clear outcome, set a realistic time window, break work into tasks and milestones, complete moves consistently, and review honest momentum weekly. Avoid tools that inflate streaks or hide missed days — truth compounds better than theatre.",
        steps: [
          { name: "Name the outcome", text: "Write a specific end-state you will recognise when finished — not a vague theme." },
          { name: "Set a realistic window", text: "Choose start and target dates that match the work, not fantasy calendars." },
          { name: "Break into moves", text: "Add a mix of tasks and milestones that cover learning, delivery, and irreversible wins." },
          { name: "Work in short sessions", text: "Complete moves regularly; let progress recalculate from completions." },
          { name: "Review momentum weekly", text: "Use charts, calendar, and streaks to see truth — then adjust moves, not the story." },
        ],
      },
      {
        heading: "Why automatic progress matters",
        answer:
          "Manual progress percentages drift into optimism. When progress recalculates from completed moves, your dashboard stays honest — and course-correction happens earlier.",
      },
    ],
    faqs: [
      {
        question: "How often should I review long-term goals?",
        answer: "A light weekly review of momentum plus a monthly look at milestones is enough for most personal ambitions.",
      },
    ],
    relatedPaths: [
      { title: "Templates", href: "/templates" },
      { title: "Honest streaks and momentum", href: "/guides/honest-streaks-and-momentum" },
      { title: "Try the experience", href: "/experience" },
    ],
  },
  "career-switch-with-milestones": {
    slug: "career-switch-with-milestones",
    title: "How to Plan a Career Switch with Milestones",
    description:
      "Plan a career transition with milestones for learning, portfolio, networking, and interviews — structured as one ambition with honest progress.",
    summary: "Career switch playbook using milestones and tasks inside a single ambition.",
    datePublished: marketingContentPublished,
    dateModified: marketingContentUpdated,
    howTo: {
      name: "How to plan a career switch with milestones",
      description: "Map a career transition into learning, proof, network, and offer milestones.",
      steps: [
        { name: "Define the target role", text: "Name the role and constraints (location, level, industry) so milestones stay specific." },
        { name: "Sequence learning milestones", text: "List courses or skills that unlock credible applications." },
        { name: "Build proof", text: "Create portfolio pieces or case studies as milestone wins, not endless tasks." },
        { name: "Network with intent", text: "Set countable outreach milestones (conversations, referrals) with deadlines." },
        { name: "Run the interview arc", text: "Track applications and interviews as moves until you accept an offer." },
      ],
    },
    sections: [
      {
        heading: "How to plan a career switch with milestones",
        answer:
          "Treat the switch as one ambition: define the target role, sequence learning and portfolio milestones, add networking and interview tasks, then track honest momentum until you accept an offer. Milestones mark irreversible progress; tasks fill the gaps between them.",
        steps: [
          { name: "Define the target role", text: "Name the role and constraints so milestones stay specific." },
          { name: "Sequence learning milestones", text: "List courses or skills that unlock credible applications." },
          { name: "Build proof", text: "Create portfolio pieces or case studies as milestone wins." },
          { name: "Network with intent", text: "Set countable outreach milestones with deadlines." },
          { name: "Run the interview arc", text: "Track applications and interviews until you accept an offer." },
        ],
      },
      {
        heading: "Why not only a todo list?",
        answer:
          "Career switches fail when effort is busy but unsequenced. A todo list captures activity; milestones force a path from fundamentals to offer.",
      },
    ],
    relatedPaths: [
      { title: "Career Switch template", href: "/templates/career-switch" },
      { title: "Ambitious professional use case", href: "/use-cases/ambitious-professional" },
    ],
  },
  "student-semester-ambition": {
    slug: "student-semester-ambition",
    title: "How Students Should Structure a Semester Ambition",
    description:
      "Turn a chaotic semester into one ambition with exam tasks, paper milestones, and honest weekly momentum — without cramming as a strategy.",
    summary: "Semester planning as an ambition with tasks, milestones, and deadlines.",
    datePublished: marketingContentPublished,
    dateModified: marketingContentUpdated,
    howTo: {
      name: "How to structure a semester as an ambition",
      description: "Map courses into tasks and milestones with real deadlines across the term.",
      steps: [
        { name: "Name the semester outcome", text: "Example: finish with a target GPA while keeping research commitments." },
        { name: "Import hard deadlines", text: "Add exams, papers, and labs as dated tasks or milestones." },
        { name: "Insert leading work", text: "Schedule study blocks and drafts before high-stakes dates." },
        { name: "Protect recovery", text: "Leave buffer moves before finals week so the plan survives reality." },
        { name: "Review weekly", text: "Check momentum mid-week and rebalance overdue work early." },
      ],
    },
    sections: [
      {
        heading: "How students should structure a semester ambition",
        answer:
          "Create one ambition for the semester outcome, load every hard deadline as a dated move, insert leading study and draft work before exams, and review momentum weekly. Treat finals and major papers as milestones — irreversible checkpoints, not vague hopes.",
        steps: [
          { name: "Name the semester outcome", text: "Example: finish with a target GPA while keeping research commitments." },
          { name: "Import hard deadlines", text: "Add exams, papers, and labs as dated tasks or milestones." },
          { name: "Insert leading work", text: "Schedule study blocks and drafts before high-stakes dates." },
          { name: "Protect recovery", text: "Leave buffer moves before finals week." },
          { name: "Review weekly", text: "Rebalance overdue work early using honest progress." },
        ],
      },
    ],
    relatedPaths: [
      { title: "Semester template", href: "/templates/student-semester" },
      { title: "Student use case", href: "/use-cases/student-academic" },
    ],
  },
  "goal-tracker-vs-todo-app": {
    slug: "goal-tracker-vs-todo-app",
    title: "Goal Tracker vs Todo App — When to Use Which",
    description:
      "Use a todo app for daily capture and chores; use a goal tracker / ambition manager for multi-month outcomes with milestones and honest progress.",
    summary: "Honest comparison of when todo apps win vs when ambition trackers win.",
    datePublished: marketingContentPublished,
    dateModified: marketingContentUpdated,
    sections: [
      {
        heading: "When a todo app is enough",
        answer:
          "Choose a todo app when work is short-cycle: errands, inbox processing, recurring chores, and same-day delivery. Speed of capture and completion matter more than multi-month structure.",
        bullets: ["Daily errands and reminders", "Inbox zero workflows", "Recurring household or admin tasks"],
      },
      {
        heading: "When you need a goal tracker",
        answer:
          "Choose a goal tracker when the outcome spans weeks or months and needs milestones, notes, priorities, and progress that does not lie. Career switches, degrees, launches, and fitness arcs fit here.",
        bullets: ["Outcomes with multi-week horizons", "Mix of tasks and milestones", "Need for momentum and streak truth"],
      },
      {
        heading: "Can you use both?",
        answer:
          "Yes — and many people should. Keep todos for chores; keep ambitions for direction. Replacing one with the other usually creates either chaos or busywork.",
        body: [
          "AmbitiousYou is built for the ambition layer: free, private, with automatic progress and honest streaks. It is not trying to replace every todo inbox.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is AmbitiousYou a Todoist alternative?",
        answer:
          "Only if your primary need is long-term goal structure. For daily task inbox workflows, Todoist (or similar) often remains the better fit — see our comparison pages.",
      },
    ],
    relatedPaths: [
      { title: "AmbitiousYou vs Todoist", href: "/compare/todoist" },
      { title: "AmbitiousYou vs Notion", href: "/compare/notion" },
      { title: "Compare hub", href: "/compare" },
    ],
  },
  "honest-streaks-and-momentum": {
    slug: "honest-streaks-and-momentum",
    title: "Honest Streaks and Momentum — Measure Progress Without Theatre",
    description:
      "Honest day-streaks count only days you completed real work. Momentum charts show completions over time — no inflated scores, no gamification theatre.",
    summary: "How honest streaks and momentum charts create trustworthy progress signals.",
    datePublished: marketingContentPublished,
    dateModified: marketingContentUpdated,
    sections: [
      {
        heading: "What is an honest day-streak?",
        answer:
          "An honest day-streak counts only days you actually completed a move — a task or milestone. Miss a day and the streak resets. That pressure is the point: consistency you can trust beats decorative fire icons.",
      },
      {
        heading: "What is momentum tracking?",
        answer:
          "Momentum tracking shows how many moves you finished each day over 7, 14, or 30 days, plus a year-long activity calendar. Patterns become visible: weekend collapse, midweek spikes, exam cram — so you can adjust.",
      },
      {
        heading: "Why avoid inflated scores?",
        answer:
          "Gamified scores that reward busywork teach the wrong lesson. When every completion is timestamped and streaks refuse to lie, your dashboard becomes a coach you can believe.",
        body: [
          "AmbitiousYou timestamps completions and recalculates ambition progress from those facts. No estimated percentages. No social leaderboards.",
        ],
      },
    ],
    relatedPaths: [
      { title: "Features", href: "/features" },
      { title: "How to track long-term goals", href: "/guides/how-to-track-long-term-goals" },
    ],
  },
};

export function getGuideContent(slug: string): GuideContent | undefined {
  return guideContent[slug as GuideSlug];
}

export function getAllGuides(): GuideContent[] {
  return guideSlugs.map((slug) => guideContent[slug]);
}
