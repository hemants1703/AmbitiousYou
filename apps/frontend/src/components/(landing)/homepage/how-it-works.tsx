import { Bricolage_Grotesque } from "next/font/google";
import { CheckIcon, FlameIcon, RouteIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface StepProps {
  number: string;
  title: string;
  description: string;
  reverse?: boolean;
  mock: React.ReactNode;
}

function Step(props: StepProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
      <div className={cn(props.reverse && "md:order-2")}>
        <span className={cn(bricolage.className, "block text-6xl md:text-7xl font-extrabold leading-none text-foreground/20 mb-3")}>{props.number}</span>
        <h3 className={cn(bricolage.className, "text-2xl md:text-3xl font-bold mb-3")}>{props.title}</h3>
        <p className="text-lg text-muted-foreground max-w-md">{props.description}</p>
      </div>
      <div className={cn(props.reverse && "md:order-1")}>
        <div className="bg-linear-to-tr from-primary/15 to-secondary/10 rounded-2xl p-1.5 shadow-lg">{props.mock}</div>
      </div>
    </div>
  );
}

function GoalSetupMock() {
  return (
    <div className="rounded-xl border border-border bg-card/90 backdrop-blur-sm p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold">New Ambition</span>
        <span className="text-xs text-muted-foreground">Step 1 of 3</span>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-background px-3 py-2.5">
          <span className="text-xs text-muted-foreground">Goal name</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: "#00bfff" }} />
            <span className="text-sm font-medium">Learn Machine Learning</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-background px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Priority</span>
            <div className="mt-1">
              <span className="text-xs font-mono px-1.5 py-0.5 rounded border border-red-500 text-red-500 uppercase">High</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Tracking</span>
            <div className="mt-1 text-sm font-medium">Milestones</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DailyActionsMock() {
  const actions = [
    { label: "Read 20 pages of the ML book", done: true },
    { label: "Watch lecture 4: gradient descent", done: true },
    { label: "Train the model on the dataset", done: false },
  ];

  return (
    <div className="rounded-xl border border-border bg-card/90 backdrop-blur-sm p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold">Today’s actions</span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          <FlameIcon className="size-3.5" />
          12-day streak
        </span>
      </div>
      <div className="space-y-2.5">
        {actions.map((action) => (
          <div key={action.label} className="flex items-center gap-3">
            {action.done ? (
              <span className="size-5 shrink-0 rounded-md bg-primary border border-primary flex items-center justify-center">
                <CheckIcon className="size-3.5 text-primary-foreground" />
              </span>
            ) : (
              <span className="size-5 shrink-0 rounded-md border border-border" />
            )}
            <span className={cn("text-sm", action.done && "line-through text-muted-foreground")}>{action.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyReviewMock() {
  const progress = [
    { label: "Learn Machine Learning", value: 67 },
    { label: "Run a Marathon", value: 75 },
  ];

  return (
    <div className="rounded-xl border border-border bg-card/90 backdrop-blur-sm p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold">This week</span>
        <span className="text-xs font-medium text-green-600 dark:text-green-400">On track</span>
      </div>
      <div className="space-y-3 mb-4">
        {progress.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground tabular-nums">{item.value}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-background p-3">
        <span className="text-xs font-medium text-muted-foreground">Weekly reflection</span>
        <p className="text-sm mt-1">Momentum is building. Next week: push the model, ease off the reading.</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-foreground/10 backdrop-blur-sm text-foreground font-medium text-sm">
            <RouteIcon className="mr-2 h-4 w-4" />
            How it works
          </div>
          <h2 className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}>From scattered dreams to daily momentum, in three steps</h2>
          <p className="text-xl text-muted-foreground">No setup marathon. You’ll have your first goal moving in about a minute.</p>
        </div>

        <div className="space-y-20">
          <Step number="01" title="Set your goals with structure" description="Give each ambition a deadline, a priority, and a way to measure it. You leave with a real plan instead of a vague intention." mock={<GoalSetupMock />} />
          <Step number="02" title="Break them into daily actions" description="Every goal turns into the few things to do today, so you always know your next move and never stare at a blank page." reverse mock={<DailyActionsMock />} />
          <Step number="03" title="Track, reflect, and adjust weekly" description="Watch progress add up, take five minutes each week to reflect, and adjust the plan before you ever fall behind." mock={<WeeklyReviewMock />} />
        </div>
      </div>
    </section>
  );
}
