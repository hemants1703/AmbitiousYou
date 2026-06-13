import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import LandingSection, { Eyebrow } from "../landing-section";
import MockFrame from "../mock-frame";

interface StepProps {
  number: string;
  title: string;
  description: string;
  url: string;
  reverse?: boolean;
  mock: React.ReactNode;
}

function Step(props: StepProps) {
  return (
    <div className="lp-reveal relative grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-14">
      {/* Marker on the desktop guide line */}
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary/60 dark:bg-chart-1/60 md:block" />

      <div className={cn(props.reverse && "md:order-2")}>
        <Eyebrow>{`Step ${props.number}`}</Eyebrow>
        <h3 className="mt-4 font-brand text-2xl font-semibold tracking-[-0.01em] text-balance md:text-3xl">{props.title}</h3>
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">{props.description}</p>
      </div>
      <div aria-hidden="true" className={cn(props.reverse && "md:order-1")}>
        <div className="rounded-2xl bg-linear-to-tr from-primary/15 dark:from-chart-1/15 to-secondary/10 p-1.5 shadow-lg">
          <MockFrame url={props.url} className="shadow-none">
            {props.mock}
          </MockFrame>
        </div>
      </div>
    </div>
  );
}

function GoalSetupMock() {
  return (
    <div className="bg-card/90 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold">New Ambition</span>
        <span className="text-xs text-muted-foreground">Step 1 of 3</span>
      </div>
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-background px-3 py-2.5">
          <span className="text-xs text-muted-foreground">Goal name</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: "#00bfff" }} />
            <span className="text-sm font-medium">Learn Machine Learning</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-background px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Priority</span>
            <div className="mt-1">
              <span className="rounded border border-red-500 px-1.5 py-0.5 font-mono text-xs uppercase text-red-500">High</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Deadline</span>
            <div className="mt-1 text-sm font-medium">Sep 14, 2026</div>
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
  const doneCount = actions.filter((action) => action.done).length;

  return (
    <div className="bg-card/90 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold">Today’s actions</span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <CheckIcon className="size-3.5 text-primary dark:text-chart-1" />
          {doneCount} of {actions.length} done
        </span>
      </div>
      <div className="space-y-2.5">
        {actions.map((action) => (
          <div key={action.label} className="flex items-center gap-3">
            {action.done ? (
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-primary bg-primary">
                <CheckIcon className="size-4 text-primary-foreground" />
              </span>
            ) : (
              <span className="size-6 shrink-0 rounded-md border border-border" />
            )}
            <span className={cn("text-sm", action.done && "text-muted-foreground line-through")}>{action.label}</span>
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
    <div className="bg-card/90 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold">This week</span>
        <span className="text-xs font-medium text-green-600 dark:text-green-400">On track</span>
      </div>
      <div className="mb-4 space-y-3">
        {progress.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium">{item.label}</span>
              <span className="tabular-nums text-muted-foreground">{item.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-background p-3">
        <span className="text-xs font-medium text-muted-foreground">Weekly reflection</span>
        <p className="mt-1 text-sm">Momentum is building. Next week: push the model, ease off the reading.</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <LandingSection eyebrow="How it works" title="From scattered dreams to daily momentum, in three steps" lede="No setup marathon. You’ll have your first goal moving in about a minute.">
      <div className="relative space-y-20 md:space-y-24">
        {/* Desktop guide line connecting the steps */}
        <div aria-hidden="true" className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-border/60 md:block" />

        <Step number="01" title="Set your goals with structure" description="Give each ambition a deadline, a priority, and a way to measure it. You leave with a real plan instead of a vague intention." url="ambitiousyou.pro/ambitions/create" mock={<GoalSetupMock />} />
        <Step number="02" title="Break them into daily actions" description="Every goal turns into the few things to do today, so you always know your next move and never stare at a blank page." reverse url="ambitiousyou.pro/dashboard" mock={<DailyActionsMock />} />
        <Step number="03" title="Track, reflect, and adjust weekly" description="Watch progress add up, take five minutes each week to reflect, and adjust the plan before you ever fall behind." url="ambitiousyou.pro/ambitions" mock={<WeeklyReviewMock />} />
      </div>
    </LandingSection>
  );
}
