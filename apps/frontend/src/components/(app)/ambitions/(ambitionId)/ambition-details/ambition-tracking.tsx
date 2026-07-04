import { Progress } from "@/components/ui/progress";
import { formatAmbitionDate, summarizeAmbitionWindow, type AmbitionWindowSummary } from "@/lib/(app)/ambition-window";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Shared rhythm for Why / Work / Time rows on the ambition detail hero. */
export const AMBITION_DIMENSION_ROW = "grid gap-2 pb-4 last:pb-0 sm:grid-cols-[4.25rem_1fr] sm:gap-4 first:pt-0 [&:not(:first-child)]:pt-4";

export const AMBITION_DIMENSION_LABEL = "text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground";

interface AmbitionTrackingProps {
  progressPercent: number;
  startDate: Date | string;
  endDate: Date | string;
  ambitionStatus?: "active" | "completed" | "missed";
  /** When true, omits the outer region wrapper — parent groups Why + Work + Time. */
  embedded?: boolean;
}

/**
 * Work and time as parallel tracks — same information as before, but labeled so
 * two progress bars never read as the same metric.
 */
export function AmbitionTracking(props: AmbitionTrackingProps) {
  const summary = summarizeAmbitionWindow(props.startDate, props.endDate, { ambitionStatus: props.ambitionStatus });
  const progress = Math.min(Math.max(props.progressPercent, 0), 100);

  const tracks = (
    <>
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
                    : "bg-accent-brand/80",
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
                className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 border-background bg-accent-brand"
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
    </>
  );

  if (props.embedded) {
    return <div className="divide-y divide-border/50">{tracks}</div>;
  }

  return (
    <div className="divide-y divide-border/50" role="region" aria-label="Ambition tracking">
      {tracks}
    </div>
  );
}

function TrackingTrack(props: { dimension: "Work" | "Time"; children: ReactNode }) {
  return (
    <div className={AMBITION_DIMENSION_ROW}>
      <p className={cn(AMBITION_DIMENSION_LABEL, "sm:pt-0.5")}>{props.dimension}</p>
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
