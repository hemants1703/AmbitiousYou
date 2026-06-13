import { Button } from "@/components/ui/button";
import { CalendarCheckIcon, FlagIcon, ListChecksIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

interface DashboardEmptyStateProps {
  firstName: string;
}

const HINTS: { icon: ComponentType<{ className?: string }>; title: string; body: string }[] = [
  { icon: ListChecksIcon, title: "Track your way", body: "Break each ambition into tasks or milestones that fit how you work." },
  { icon: CalendarCheckIcon, title: "Know your next move", body: "See exactly what's due across every ambition, every day." },
  { icon: TrendingUpIcon, title: "Watch it add up", body: "Check things off and watch your progress climb." },
];

export function DashboardEmptyState(props: DashboardEmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 py-10 text-center duration-500 animate-in fade-in sm:py-16">
      <span className="flex size-16 items-center justify-center rounded-4xl bg-primary/10 dark:bg-chart-1/10 text-primary dark:text-chart-1" aria-hidden="true">
        <FlagIcon className="size-7" />
      </span>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          Welcome, <span translate="no">{props.firstName}</span>
        </h1>
        <p className="max-w-xl text-balance text-muted-foreground">This is your command center. Set your first ambition and AmbitiousYou will help you turn it into measurable, daily progress.</p>
      </div>

      <Button asChild size="lg">
        <Link href="/ambitions/create" prefetch>
          <SparklesIcon className="size-4" />
          Create your first ambition
        </Link>
      </Button>

      <div className="grid w-full gap-3 pt-2 text-left sm:grid-cols-3">
        {HINTS.map((hint) => {
          const Icon = hint.icon;
          return (
            <div key={hint.title} className="flex flex-col gap-2 rounded-3xl border border-border/60 bg-card/40 p-4">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 dark:bg-chart-1/10 text-primary dark:text-chart-1" aria-hidden="true">
                <Icon className="size-4" />
              </span>
              <p className="font-medium">{hint.title}</p>
              <p className="text-sm text-muted-foreground">{hint.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
