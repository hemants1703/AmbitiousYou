import { Ambition, Task, Milestone } from "@/db/schema";

export interface PersonaAmbition {
  ambition: Omit<Ambition, "userId" | "createdAt" | "updatedAt">;
  tasks?: Omit<Task, "userId" | "createdAt" | "updatedAt">[];
  milestones?: Omit<Milestone, "userId" | "createdAt" | "updatedAt">[];
}

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  story: string;
  icon: string;
  color: string;
  ambitions: PersonaAmbition[];
}

// Helper to create dates relative to today
const today = new Date();
const daysFromNow = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date;
};
const daysAgo = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() - days);
  return date;
};

export const personas: Persona[] = [
  {
    id: "ambitious-professional",
    name: "Ambitious Professionals",
    tagline: "Climbing career ladders, managing promotions & skill development",
    story:
      "You're not just working a job—you're building a career. Whether it's landing that promotion, mastering a new skill, or leading your first team, you know success doesn't happen by accident. It happens by design.",
    icon: "briefcase",
    color: "#00bfff",
    ambitions: [
      {
        ambition: {
          id: "demo-prof-1",
          ambitionName: "Get Promoted to Senior Engineer",
          ambitionDefinition:
            "Achieve senior engineer title by Q2 through demonstrated technical leadership and project delivery",
          ambitionTrackingMethod: "milestone",
          ambitionStartDate: daysAgo(30),
          ambitionEndDate: daysFromNow(120),
          ambitionCompletionDate: null,
          ambitionStatus: "active",
          ambitionPriority: "high",
          ambitionPercentageCompleted: 40,
          ambitionColor: "#00bfff",
          isFavourited: true,
        },
        milestones: [
          {
            id: "ms-prof-1",
            ambitionId: "demo-prof-1",
            milestone: "Complete AWS Solutions Architect certification",
            milestoneDescription: "Pass the AWS SAA-C03 exam with 800+ score",
            milestoneCompleted: true,
            milestoneTargetDate: daysAgo(10),
          },
          {
            id: "ms-prof-2",
            ambitionId: "demo-prof-1",
            milestone: "Lead architecture review for Project Atlas",
            milestoneDescription: "Present and defend system design to senior leadership",
            milestoneCompleted: true,
            milestoneTargetDate: daysAgo(5),
          },
          {
            id: "ms-prof-3",
            ambitionId: "demo-prof-1",
            milestone: "Mentor 2 junior engineers",
            milestoneDescription: "Establish weekly 1:1s and help with their growth plans",
            milestoneCompleted: false,
            milestoneTargetDate: daysFromNow(30),
          },
          {
            id: "ms-prof-4",
            ambitionId: "demo-prof-1",
            milestone: "Deliver Q2 performance review presentation",
            milestoneDescription: "Document achievements and make case for promotion",
            milestoneCompleted: false,
            milestoneTargetDate: daysFromNow(90),
          },
          {
            id: "ms-prof-5",
            ambitionId: "demo-prof-1",
            milestone: "Receive promotion confirmation",
            milestoneDescription: "Official title change to Senior Engineer",
            milestoneCompleted: false,
            milestoneTargetDate: daysFromNow(120),
          },
        ],
      },
    ],
  },
  {
    id: "student-academic",
    name: "Students & Academics",
    tagline: "Pursuing academic excellence, certifications, learning goals",
    story:
      "Every exam, every paper, every certification is a stepping stone. You're not just studying to pass—you're learning to excel. Your academic journey is intense, but you know that structured goals turn overwhelming syllabi into conquerable milestones.",
    icon: "graduation-cap",
    color: "#9966cc",
    ambitions: [
      {
        ambition: {
          id: "demo-student-1",
          ambitionName: "Achieve 9+ GPA This Semester",
          ambitionDefinition:
            "Excel in all 6 courses while maintaining research assistant position",
          ambitionTrackingMethod: "task",
          ambitionStartDate: daysAgo(45),
          ambitionEndDate: daysFromNow(75),
          ambitionCompletionDate: null,
          ambitionStatus: "active",
          ambitionPriority: "high",
          ambitionPercentageCompleted: 55,
          ambitionColor: "#9966cc",
          isFavourited: true,
        },
        tasks: [
          {
            id: "task-student-1",
            ambitionId: "demo-student-1",
            task: "Complete Data Structures assignment #4",
            taskDescription: "Binary tree implementations and analysis",
            taskCompleted: true,
            taskDeadline: daysAgo(20),
          },
          {
            id: "task-student-2",
            ambitionId: "demo-student-1",
            task: "Submit ML research paper draft",
            taskDescription: "First draft of neural network optimization paper",
            taskCompleted: true,
            taskDeadline: daysAgo(10),
          },
          {
            id: "task-student-3",
            ambitionId: "demo-student-1",
            task: "Prepare for Database Systems midterm",
            taskDescription: "Review normalization, indexing, and query optimization",
            taskCompleted: true,
            taskDeadline: daysAgo(5),
          },
          {
            id: "task-student-4",
            ambitionId: "demo-student-1",
            task: "Complete Algorithm Design project",
            taskDescription: "Implement and benchmark sorting algorithms",
            taskCompleted: false,
            taskDeadline: daysFromNow(15),
          },
          {
            id: "task-student-5",
            ambitionId: "demo-student-1",
            task: "Final exam preparation - all subjects",
            taskDescription: "Comprehensive review for finals week",
            taskCompleted: false,
            taskDeadline: daysFromNow(60),
          },
        ],
      },
    ],
  },
  {
    id: "entrepreneur-founder",
    name: "Entrepreneurs & Founders",
    tagline: "Building products while juggling multiple business objectives",
    story:
      "You're wearing ten hats before breakfast. Product, marketing, fundraising, hiring—the chaos is real, but so is your vision. You need a system that keeps your ambitious goals organized while you build something that matters.",
    icon: "rocket",
    color: "#ff7733",
    ambitions: [
      {
        ambition: {
          id: "demo-founder-1",
          ambitionName: "Launch MVP & Get First 100 Users",
          ambitionDefinition:
            "Ship the core product and validate market fit through early adoption",
          ambitionTrackingMethod: "milestone",
          ambitionStartDate: daysAgo(60),
          ambitionEndDate: daysFromNow(60),
          ambitionCompletionDate: null,
          ambitionStatus: "active",
          ambitionPriority: "high",
          ambitionPercentageCompleted: 60,
          ambitionColor: "#ff7733",
          isFavourited: true,
        },
        milestones: [
          {
            id: "ms-founder-1",
            ambitionId: "demo-founder-1",
            milestone: "Complete core feature development",
            milestoneDescription: "User auth, dashboard, and primary workflow functional",
            milestoneCompleted: true,
            milestoneTargetDate: daysAgo(30),
          },
          {
            id: "ms-founder-2",
            ambitionId: "demo-founder-1",
            milestone: "Deploy to production",
            milestoneDescription: "Set up CI/CD, monitoring, and go live",
            milestoneCompleted: true,
            milestoneTargetDate: daysAgo(15),
          },
          {
            id: "ms-founder-3",
            ambitionId: "demo-founder-1",
            milestone: "Launch on Product Hunt",
            milestoneDescription: "Prepare assets, coordinate launch day, engage community",
            milestoneCompleted: true,
            milestoneTargetDate: daysAgo(5),
          },
          {
            id: "ms-founder-4",
            ambitionId: "demo-founder-1",
            milestone: "Reach 50 active users",
            milestoneDescription: "Organic growth from launch and referrals",
            milestoneCompleted: false,
            milestoneTargetDate: daysFromNow(20),
          },
          {
            id: "ms-founder-5",
            ambitionId: "demo-founder-1",
            milestone: "Hit 100 users milestone",
            milestoneDescription: "Market validation achieved, ready for seed conversations",
            milestoneCompleted: false,
            milestoneTargetDate: daysFromNow(45),
          },
        ],
      },
    ],
  },
  {
    id: "personal-growth",
    name: "Personal Growth Seekers",
    tagline: "Fitness goals, learning instruments, language acquisition",
    story:
      "Life isn't just about work—it's about becoming the best version of yourself. Whether it's running your first marathon, learning guitar, or finally mastering Spanish, you know that personal growth is the ultimate investment.",
    icon: "heart",
    color: "#32cd32",
    ambitions: [
      {
        ambition: {
          id: "demo-growth-1",
          ambitionName: "Run a Half Marathon",
          ambitionDefinition:
            "Complete 21.1km race in under 2 hours by the city marathon in spring",
          ambitionTrackingMethod: "milestone",
          ambitionStartDate: daysAgo(90),
          ambitionEndDate: daysFromNow(90),
          ambitionCompletionDate: null,
          ambitionStatus: "active",
          ambitionPriority: "medium",
          ambitionPercentageCompleted: 50,
          ambitionColor: "#32cd32",
          isFavourited: false,
        },
        milestones: [
          {
            id: "ms-growth-1",
            ambitionId: "demo-growth-1",
            milestone: "Complete first 5K run",
            milestoneDescription: "Build base endurance with regular 5K training runs",
            milestoneCompleted: true,
            milestoneTargetDate: daysAgo(60),
          },
          {
            id: "ms-growth-2",
            ambitionId: "demo-growth-1",
            milestone: "Run 10K without stopping",
            milestoneDescription: "Increase distance while maintaining comfortable pace",
            milestoneCompleted: true,
            milestoneTargetDate: daysAgo(30),
          },
          {
            id: "ms-growth-3",
            ambitionId: "demo-growth-1",
            milestone: "Complete 15K training run",
            milestoneDescription: "Long run preparation, focus on pacing strategy",
            milestoneCompleted: false,
            milestoneTargetDate: daysFromNow(30),
          },
          {
            id: "ms-growth-4",
            ambitionId: "demo-growth-1",
            milestone: "Race day - Complete half marathon",
            milestoneDescription: "21.1km in under 2 hours, enjoy the finish line!",
            milestoneCompleted: false,
            milestoneTargetDate: daysFromNow(90),
          },
        ],
      },
    ],
  },
  {
    id: "career-switcher",
    name: "Career Switchers",
    tagline: "Transitioning industries, managing complex learning paths",
    story:
      "You're brave enough to start over. Transitioning from one career to another is no small feat—it requires strategic learning, networking, and proving yourself in a new domain. Your path is unconventional, but your determination is unshakeable.",
    icon: "refresh",
    color: "#ff69b4",
    ambitions: [
      {
        ambition: {
          id: "demo-switch-1",
          ambitionName: "Transition from Marketing to Product Management",
          ambitionDefinition:
            "Land a PM role at a tech company within 8 months through skill building and networking",
          ambitionTrackingMethod: "milestone",
          ambitionStartDate: daysAgo(120),
          ambitionEndDate: daysFromNow(120),
          ambitionCompletionDate: null,
          ambitionStatus: "active",
          ambitionPriority: "high",
          ambitionPercentageCompleted: 45,
          ambitionColor: "#ff69b4",
          isFavourited: true,
        },
        milestones: [
          {
            id: "ms-switch-1",
            ambitionId: "demo-switch-1",
            milestone: "Complete Product Management fundamentals course",
            milestoneDescription: "Reforge PM course + certification",
            milestoneCompleted: true,
            milestoneTargetDate: daysAgo(90),
          },
          {
            id: "ms-switch-2",
            ambitionId: "demo-switch-1",
            milestone: "Build portfolio with 3 PM case studies",
            milestoneDescription: "Document product thinking through real-world analyses",
            milestoneCompleted: true,
            milestoneTargetDate: daysAgo(45),
          },
          {
            id: "ms-switch-3",
            ambitionId: "demo-switch-1",
            milestone: "Network with 20 PMs in target companies",
            milestoneDescription: "Coffee chats, LinkedIn outreach, PM community events",
            milestoneCompleted: false,
            milestoneTargetDate: daysFromNow(30),
          },
          {
            id: "ms-switch-4",
            ambitionId: "demo-switch-1",
            milestone: "Get 5 PM role interviews",
            milestoneDescription: "Apply strategically, leverage network referrals",
            milestoneCompleted: false,
            milestoneTargetDate: daysFromNow(75),
          },
          {
            id: "ms-switch-5",
            ambitionId: "demo-switch-1",
            milestone: "Accept PM offer",
            milestoneDescription: "Negotiate and accept role at aligned company",
            milestoneCompleted: false,
            milestoneTargetDate: daysFromNow(120),
          },
        ],
      },
    ],
  },
  {
    id: "multi-passionate",
    name: "Multi-passionate Creators",
    tagline: "Juggling creative projects, side hustles, content creation",
    story:
      "You can't pick just one passion—and why should you? You're building a YouTube channel while writing a novel while launching an Etsy shop. The world tells you to focus, but you know that multiple passions fuel your creative fire.",
    icon: "palette",
    color: "#fcda03",
    ambitions: [
      {
        ambition: {
          id: "demo-creator-1",
          ambitionName: "Grow YouTube Channel to 10K Subscribers",
          ambitionDefinition: "Build an engaged audience for tech tutorials and creative vlogs",
          ambitionTrackingMethod: "task",
          ambitionStartDate: daysAgo(180),
          ambitionEndDate: daysFromNow(180),
          ambitionCompletionDate: null,
          ambitionStatus: "active",
          ambitionPriority: "medium",
          ambitionPercentageCompleted: 35,
          ambitionColor: "#fcda03",
          isFavourited: true,
        },
        tasks: [
          {
            id: "task-creator-1",
            ambitionId: "demo-creator-1",
            task: "Publish weekly video #1-10",
            taskDescription: "Establish consistent upload schedule with quality content",
            taskCompleted: true,
            taskDeadline: daysAgo(90),
          },
          {
            id: "task-creator-2",
            ambitionId: "demo-creator-1",
            task: "Optimize channel branding and thumbnails",
            taskDescription: "Create cohesive visual identity, A/B test thumbnail styles",
            taskCompleted: true,
            taskDeadline: daysAgo(60),
          },
          {
            id: "task-creator-3",
            ambitionId: "demo-creator-1",
            task: "Collaborate with 3 other creators",
            taskDescription: "Cross-promotion and guest appearances",
            taskCompleted: false,
            taskDeadline: daysFromNow(45),
          },
          {
            id: "task-creator-4",
            ambitionId: "demo-creator-1",
            task: "Launch community Discord server",
            taskDescription: "Build engaged community beyond just video views",
            taskCompleted: false,
            taskDeadline: daysFromNow(90),
          },
          {
            id: "task-creator-5",
            ambitionId: "demo-creator-1",
            task: "Reach 10K subscriber milestone",
            taskDescription: "Celebrate with special video and community event",
            taskCompleted: false,
            taskDeadline: daysFromNow(180),
          },
        ],
      },
    ],
  },
  {
    id: "high-performer",
    name: "High Performers",
    tagline: "Productivity enthusiasts optimizing every aspect of life",
    story:
      "You don't settle for average—in anything. Your morning routine is optimized, your focus sessions are timed, and your goals are tracked with precision. You're constantly iterating on yourself, and you need tools that match your intensity.",
    icon: "chart-line",
    color: "#00ced1",
    ambitions: [
      {
        ambition: {
          id: "demo-performer-1",
          ambitionName: "Optimize Daily Productivity System",
          ambitionDefinition:
            "Build and refine a personal productivity system that maximizes deep work and minimizes friction",
          ambitionTrackingMethod: "task",
          ambitionStartDate: daysAgo(30),
          ambitionEndDate: daysFromNow(60),
          ambitionCompletionDate: null,
          ambitionStatus: "active",
          ambitionPriority: "high",
          ambitionPercentageCompleted: 65,
          ambitionColor: "#00ced1",
          isFavourited: true,
        },
        tasks: [
          {
            id: "task-perf-1",
            ambitionId: "demo-performer-1",
            task: "Audit current workflow and identify bottlenecks",
            taskDescription: "Track time for 1 week, analyze where energy is wasted",
            taskCompleted: true,
            taskDeadline: daysAgo(25),
          },
          {
            id: "task-perf-2",
            ambitionId: "demo-performer-1",
            task: "Implement time-blocking system",
            taskDescription: "3 deep work blocks daily, protected calendar time",
            taskCompleted: true,
            taskDeadline: daysAgo(20),
          },
          {
            id: "task-perf-3",
            ambitionId: "demo-performer-1",
            task: "Set up automation for repetitive tasks",
            taskDescription: "Email filters, text expanders, app shortcuts",
            taskCompleted: true,
            taskDeadline: daysAgo(10),
          },
          {
            id: "task-perf-4",
            ambitionId: "demo-performer-1",
            task: "Establish weekly review ritual",
            taskDescription: "Friday 30-min reflection and next week planning",
            taskCompleted: false,
            taskDeadline: daysFromNow(15),
          },
          {
            id: "task-perf-5",
            ambitionId: "demo-performer-1",
            task: "Measure and iterate - hit 6hrs daily deep work",
            taskDescription: "Track metrics for 30 days, optimize until target hit",
            taskCompleted: false,
            taskDeadline: daysFromNow(60),
          },
        ],
      },
    ],
  },
];

export const getPersonaById = (id: string): Persona | undefined => {
  return personas.find((persona) => persona.id === id);
};

export const getPersonaIcon = (iconName: string): string => {
  const iconMap: Record<string, string> = {
    briefcase: "IconBriefcase",
    "graduation-cap": "IconSchool",
    rocket: "IconRocket",
    heart: "IconHeart",
    refresh: "IconRefresh",
    palette: "IconPalette",
    "chart-line": "IconChartLine",
  };
  return iconMap[iconName] || "IconTarget";
};
