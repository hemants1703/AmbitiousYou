import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type StatTone = "default" | "positive" | "warning" | "danger";
export type StatEmphasis = "subtle" | "solid";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
  tone?: StatTone;
  /**
   * `subtle` — default card with a tinted icon chip (calm).
   * `solid` — soft tone wash + stronger ring; themed icon disc (serious, not shouting).
   */
  emphasis?: StatEmphasis;
  /** Optional extra content rendered above the helper (e.g. a mini progress bar). */
  children?: ReactNode;
  className?: string;
}

const chipByTone: Record<StatTone, string> = {
  default: "bg-accent-brand/10 text-accent-brand",
  positive: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
};

/** Soft wash surfaces — readable for long sessions, still unmistakably “active.” */
const emphasisSurfaceByTone: Record<StatTone, string> = {
  default: "bg-accent-brand/8 ring-accent-brand/20",
  positive: "bg-emerald-500/10 ring-emerald-500/25 dark:bg-emerald-500/15",
  warning: "bg-amber-500/10 ring-amber-500/25 dark:bg-amber-500/15",
  danger: "bg-destructive/[0.07] ring-destructive/30 dark:bg-destructive/15 dark:ring-destructive/35",
};

const emphasisLabelByTone: Record<StatTone, string> = {
  default: "text-accent-brand/80",
  positive: "text-emerald-700/80 dark:text-emerald-300/80",
  warning: "text-amber-700/80 dark:text-amber-300/80",
  danger: "text-destructive/80",
};

const emphasisValueByTone: Record<StatTone, string> = {
  default: "text-accent-brand",
  positive: "text-emerald-700 dark:text-emerald-300",
  warning: "text-amber-700 dark:text-amber-300",
  danger: "text-destructive",
};

const emphasisHelperByTone: Record<StatTone, string> = {
  default: "text-accent-brand/70",
  positive: "text-emerald-700/70 dark:text-emerald-300/70",
  warning: "text-amber-700/70 dark:text-amber-300/70",
  danger: "text-destructive/70",
};

const emphasisChipInkByTone: Record<StatTone, string> = {
  default: "text-accent-brand",
  positive: "text-emerald-600 dark:text-emerald-500",
  warning: "text-amber-600 dark:text-amber-500",
  danger: "text-destructive",
};

export function StatCard(props: StatCardProps) {
  const tone = props.tone ?? "default";
  const isEmphasized = (props.emphasis ?? "subtle") === "solid";

  return (
    <Card
      size="sm"
      className={cn(
        "gap-3 transition-[background-color,color,box-shadow] duration-200",
        isEmphasized && emphasisSurfaceByTone[tone],
        props.className,
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4">
        <div className="min-w-0 space-y-1">
          <p
            className={cn(
              "text-xs font-medium uppercase tracking-wide",
              isEmphasized ? emphasisLabelByTone[tone] : "text-muted-foreground",
            )}
          >
            {props.label}
          </p>
          <p
            className={cn(
              "text-2xl font-semibold tabular-nums @[150px]/card:text-3xl",
              isEmphasized && emphasisValueByTone[tone],
            )}
          >
            {props.value}
          </p>
        </div>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-2xl transition-colors duration-200",
            isEmphasized
              ? cn("bg-card shadow-sm ring-1 ring-foreground/10", emphasisChipInkByTone[tone])
              : chipByTone[tone],
          )}
          aria-hidden="true"
        >
          {props.icon}
        </span>
      </div>
      <div className="space-y-2 px-4">
        {props.children}
        <p className={cn("text-xs", isEmphasized ? emphasisHelperByTone[tone] : "text-muted-foreground")}>
          {props.helper}
        </p>
      </div>
    </Card>
  );
}
