import { Progress } from "@/components/ui/progress";
import { formatAmbitionDate, summarizeAmbitionWindow, type AmbitionWindowSummary } from "@/lib/(app)/ambition-window";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AmbitionTrackingProps {
  progressPercent: number;
  startDate: Date | string;
  endDate: Date | string;
  ambitionStatus?: "active" | "completed" | "missed";
}

/**
 * Work and time as parallel tracks — same information as before, but labeled so
 * two progress bars never read as the same metric.
 */
export function AmbitionTracking(props: AmbitionTrackingProps) {
  const summary = summarizeAmbitionWindow(props.startDate, props.endDate, { ambitionStatus: props.ambitionStatus });
  const progress = Math.min(Math.max(props.progressPercent, 0), 100);

  return (
    <div className="divide-y divide-border/50" role="region" aria-label="Ambition tracking">
      <TrackingTrack dimension="Work">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">Ambition progress</p>
          <p className="text-sm font-semibold tabular-nums">{progress}%</p>
        </div>
        <Progress value={progress} className="mt-1.5 h-1.5" aria-label="Ambition progress" />
      </TrackingTrack>

      <TrackingTrack dimension="Time">
        <div className="relative">
          <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full",
                summary.phase === "overdue" || summary.phase === "missed"
                  ? "bg-destructive/70"
                  : summary.phase === "completed"
                    ? "bg-emerald-500"
                    : "bg-primary/80 dark:bg-chart-1/80",
              )}
              style={{ width: `${summary.elapsedPercent}%` }}
              role="progressbar"
              aria-valuenow={summary.elapsedPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Time elapsed in ambition window"
            />
            {summary.phase === "in_progress" ? (
              <span
                className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 border-background bg-foreground dark:bg-chart-1"
                style={{ left: `calc(${summary.elapsedPercent}% - 5px)` }}
                aria-hidden="true"
              />
            ) : null}
          </div>
          <div className="mt-1 flex justify-between text-[11px] tabular-nums text-muted-foreground">
            <span>{formatAmbitionDate(props.startDate)}</span>
            <span>{formatAmbitionDate(props.endDate)}</span>
          </div>
        </div>

        <p className="mt-1.5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{summary.totalDays}-day window</span>
          <span aria-hidden="true"> · </span>
          <CompactStats summary={summary} />
        </p>

        <p className="mt-1 text-xs text-muted-foreground">{summary.encouragement}</p>
      </TrackingTrack>
    </div>
  );
}

function TrackingTrack(props: { dimension: "Work" | "Time"; children: ReactNode }) {
  return (
    <div className="grid gap-2 pb-4 last:pb-0 sm:grid-cols-[4.25rem_1fr] sm:gap-4 first:pt-0 [&:not(:first-child)]:pt-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:pt-0.5">{props.dimension}</p>
      <div className="min-w-0">{props.children}</div>
    </div>
  );
}

function CompactStats(props: { summary: AmbitionWindowSummary }) {
  const { summary } = props;

  if (summary.phase === "not_started") {
    return (
      <span className="tabular-nums">
        Opens in {summary.daysUntilStart} {summary.daysUntilStart === 1 ? "day" : "days"}
      </span>
    );
  }

  if (summary.phase === "completed") {
    return <span className="text-emerald-700 dark:text-emerald-300">Completed</span>;
  }

  if (summary.phase === "missed") {
    return <span>Closed without finish</span>;
  }

  if (summary.phase === "overdue") {
    return (
      <span className="font-medium text-destructive tabular-nums">
        {summary.overdueDays} {summary.overdueDays === 1 ? "day" : "days"} past target
      </span>
    );
  }

  return (
    <span className="tabular-nums">
      Day {summary.elapsedDays + 1}
      <span aria-hidden="true"> · </span>
      {summary.elapsedDays} elapsed
      <span aria-hidden="true"> · </span>
      <span className={cn(summary.remainingDays <= 3 && "font-medium text-foreground")}>{summary.remainingDays} left</span>
    </span>
  );
}
