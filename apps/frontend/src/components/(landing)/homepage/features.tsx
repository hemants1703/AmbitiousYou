import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BarChart3Icon, BellIcon, GaugeIcon, LockIcon, SparklesIcon, StarIcon, type LucideIcon } from "lucide-react";
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
        <props.icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
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

export default function Features() {
  return (
    <LandingSection eyebrow="Features" title="Transform How You Achieve Your Goals" lede="AmbitiousYou provides the tools you need to set, track, and accomplish your most ambitious goals.">
      <div className="lp-reveal grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
        <FeatureCard icon={BarChart3Icon} title="Goal Hierarchy" description="Organize your ambitions from big dreams to daily tasks in a structured, manageable system." className="lg:col-span-4">
          <HierarchyVignette />
        </FeatureCard>
        <FeatureCard icon={StarIcon} title="Priority Management" description="Focus on what matters most with our intuitive priority system that adapts to your changing needs." className="lg:col-span-2" />
        <FeatureCard icon={LockIcon} title="Private & Secure" description="Your ambitions are personal. We keep them private and secure and never share them with anyone." className="lg:col-span-2" />
        <FeatureCard icon={GaugeIcon} title="Progress Tracking" description="Visualize your journey with beautiful charts and analytics that keep you motivated." className="lg:col-span-4">
          <ProgressVignette />
        </FeatureCard>
        <FeatureCard icon={BellIcon} title="Smart Notifications" description="Get personalized reminders at the right time to keep you on track with your goals." comingSoon className="lg:col-span-3" />
        <FeatureCard icon={SparklesIcon} title="AI Assistance" description="Receive intelligent suggestions to overcome obstacles and optimize your approach." comingSoon className="lg:col-span-3" />
      </div>
    </LandingSection>
  );
}
