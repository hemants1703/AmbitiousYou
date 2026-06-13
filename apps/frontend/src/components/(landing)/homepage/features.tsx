import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BarChart3Icon, BellIcon, CalendarDaysIcon, FlameIcon, GaugeIcon, LockIcon, SparklesIcon, StarIcon, TrendingUpIcon, type LucideIcon } from "lucide-react";
import LandingSection, { LANDING_CARD } from "../landing-section";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  comingSoon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function FeatureCard(props: FeatureCardProps) {
  return (
    <div className={cn(LANDING_CARD, "flex flex-col p-6", props.className)}>
      <div className="flex items-center gap-2.5">
        <props.icon aria-hidden="true" className="size-5 shrink-0 text-primary dark:text-chart-1" />
        <h3 className="font-brand text-lg font-semibold tracking-[-0.01em] md:text-xl">{props.title}</h3>
        {props.comingSoon ? (
          <Badge variant="secondary" className="ml-auto shrink-0 text-xs">
            Coming soon
          </Badge>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{props.description}</p>
      {props.children}
    </div>
  );
}

function HierarchyVignette() {
  const moves = [
    { kind: "Task", label: "Read 20 pages of the ML book" },
    { kind: "Milestone", label: "Finish the fundamentals course" },
    { kind: "Task", label: "Train the model on the dataset" },
  ];

  return (
    <div aria-hidden="true" className="mt-6 rounded-xl border border-border/60 bg-background/60 p-4">
      <div className="flex items-center gap-2">
        <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: "#00bfff" }} />
        <span className="truncate text-sm font-medium">Learn Machine Learning</span>
        <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">67%</span>
      </div>
      <div className="mt-3 space-y-2 border-l border-border/60 pl-4">
        {moves.map((move) => (
          <div key={move.label} className="flex items-center gap-2">
            <span className={cn("shrink-0 rounded border px-1 font-mono text-[10px] uppercase", move.kind === "Milestone" ? "border-violet-500/50 text-violet-600 dark:text-violet-400" : "border-border text-muted-foreground")}>{move.kind}</span>
            <span className="truncate text-xs text-muted-foreground">{move.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressVignette() {
  const rows = [
    { label: "Learn Machine Learning", color: "#00bfff", value: 67 },
    { label: "Run a Marathon", color: "#32cd32", value: 75 },
    { label: "Launch Side Project", color: "#ff7733", value: 55 },
  ];

  return (
    <div aria-hidden="true" className="mt-6 space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="truncate font-medium">{row.label}</span>
            <span className="ml-2 shrink-0 tabular-nums text-muted-foreground">{row.value}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full" style={{ width: `${row.value}%`, backgroundColor: row.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MomentumVignette() {
  const bars = [
    { task: 9, milestone: 0 },
    { task: 14, milestone: 4 },
    { task: 7, milestone: 0 },
    { task: 16, milestone: 6 },
    { task: 11, milestone: 0 },
    { task: 8, milestone: 3 },
    { task: 18, milestone: 5 },
  ];

  return (
    <div aria-hidden="true" className="mt-6 rounded-xl border border-border/60 bg-background/60 p-4">
      <div className="mb-3 flex items-center gap-1.5 text-xs">
        <FlameIcon className="size-3.5 text-orange-500" />
        <span className="font-medium">12-day streak</span>
        <span className="ml-auto tabular-nums text-muted-foreground">248 this year</span>
      </div>
      <div className="flex h-16 items-end gap-1.5">
        {bars.map((bar, index) => (
          <div key={index} className="flex flex-1 flex-col justify-end gap-0.5">
            {bar.milestone > 0 ? <div className="rounded-t-sm bg-fuchsia-500" style={{ height: `${bar.milestone * 2}px` }} /> : null}
            <div className={cn("bg-teal-500", bar.milestone > 0 ? "rounded-b-sm" : "rounded-sm")} style={{ height: `${bar.task * 2}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const HEAT_CLASS: Record<number, string> = {
  0: "bg-muted",
  1: "bg-emerald-500/25",
  2: "bg-emerald-500/45",
  3: "bg-emerald-500/70",
  4: "bg-emerald-500",
};
// Deterministic mini-heatmap (no Math.random → no hydration drift): denser recently, lighter on weekends.
const miniHeatWeeks: number[][] = Array.from({ length: 20 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const noise = Math.sin(week * 9.17 + day * 3.33) * 9999;
    const score = (noise - Math.floor(noise)) * 0.8 + (week / 20) * 0.2 - (day === 0 || day === 6 ? 0.2 : 0);
    return score < 0.3 ? 0 : score < 0.5 ? 1 : score < 0.68 ? 2 : score < 0.84 ? 3 : 4;
  }),
);

function ContributionVignette() {
  return (
    <div aria-hidden="true" className="mt-6 rounded-xl border border-border/60 bg-background/60 p-4">
      <div className="overflow-x-auto">
        <div className="grid w-max grid-flow-col" style={{ gridTemplateRows: "repeat(7, 12px)", gridAutoColumns: "12px", gap: "3px" }}>
          {miniHeatWeeks.map((week, weekIndex) => week.map((level, dayIndex) => <div key={`${weekIndex}-${dayIndex}`} className={cn("rounded-xs ring-1 ring-inset ring-foreground/5", HEAT_CLASS[level])} />))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className={cn("size-2.5 rounded-xs ring-1 ring-inset ring-foreground/5", HEAT_CLASS[level])} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <LandingSection eyebrow="Features" title="Transform How You Achieve Your Goals" lede="AmbitiousYou provides the tools you need to set, track, and accomplish your most ambitious goals.">
      <div className="lp-reveal grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
        <FeatureCard icon={BarChart3Icon} title="Goal Hierarchy" description="Organize your ambitions from big dreams to daily tasks in a structured, manageable system." className="lg:col-span-4">
          <HierarchyVignette />
        </FeatureCard>
        <FeatureCard icon={StarIcon} title="Priority Management" description="Focus on what matters most with our intuitive priority system that adapts to your changing needs." className="lg:col-span-2" />
        <FeatureCard icon={TrendingUpIcon} title="Momentum & Streaks" description="Watch how many moves you complete each day over the last week, two weeks, or month — with a streak that only counts real progress." className="lg:col-span-2">
          <MomentumVignette />
        </FeatureCard>
        <FeatureCard icon={CalendarDaysIcon} title="Your Year at a Glance" description="A contribution calendar turns every completed move into a square, so a whole year of consistency is visible in one look." className="lg:col-span-4">
          <ContributionVignette />
        </FeatureCard>
        <FeatureCard icon={GaugeIcon} title="Progress Tracking" description="Visualize your journey with beautiful charts and analytics that keep you motivated." className="lg:col-span-4">
          <ProgressVignette />
        </FeatureCard>
        <FeatureCard icon={LockIcon} title="Private & Secure" description="Your ambitions are personal. We keep them private and secure and never share them with anyone." className="lg:col-span-2" />
        <FeatureCard icon={BellIcon} title="Smart Notifications" description="Get personalized reminders at the right time to keep you on track with your goals." comingSoon className="lg:col-span-3" />
        <FeatureCard icon={SparklesIcon} title="AI Assistance" description="Receive intelligent suggestions to overcome obstacles and optimize your approach." comingSoon className="lg:col-span-3" />
      </div>
    </LandingSection>
  );
}
