import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type StatTone = "default" | "positive" | "warning" | "danger";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
  tone?: StatTone;
  /** Optional extra content rendered above the helper (e.g. a mini progress bar). */
  children?: ReactNode;
  className?: string;
}

const chipByTone: Record<StatTone, string> = {
  default: "bg-primary/10 text-primary",
  positive: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
};

export function StatCard(props: StatCardProps) {
  return (
    <Card size="sm" className="gap-3">
      <div className="flex items-start justify-between gap-3 px-4">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{props.label}</p>
          <p className="text-2xl font-semibold tabular-nums @[150px]/card:text-3xl">{props.value}</p>
        </div>
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-2xl", chipByTone[props.tone ?? "default"])} aria-hidden="true">
          {props.icon}
        </span>
      </div>
      <div className="space-y-2 px-4">
        {props.children}
        <p className="text-xs text-muted-foreground">{props.helper}</p>
      </div>
    </Card>
  );
}
