import type { AmbitionEndDateChange } from "@/types";
import { HistoryIcon } from "lucide-react";

interface EndDateHistoryProps {
  history: AmbitionEndDateChange[];
  currentEndDate: Date | string;
  ambitionStatus?: "active" | "completed" | "missed";
}

function formatDay(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function formatChangedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function extensionLabel(count: number) {
  if (count === 0) {
    return "Never extended";
  }
  if (count === 1) {
    return "Extended 1 time";
  }
  return `Extended ${count} times`;
}

/**
 * At-a-glance log of forward end-date moves for the edit ambition sidebar.
 * Newest extensions first so the latest push is immediately visible.
 */
export function EndDateHistory(props: EndDateHistoryProps) {
  const history = props.history ?? [];
  const count = history.length;
  const newestFirst = [...history].reverse();
  const isMissed = props.ambitionStatus === "missed";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <HistoryIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <h3 className="text-sm font-semibold tracking-tight">End date log</h3>
        </div>
        <p className={`text-xs font-medium tabular-nums ${count > 0 ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground"}`}>
          {extensionLabel(count)}
        </p>
      </div>

      {isMissed ? (
        <p className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:text-amber-100">
          This ambition missed its window. Extending the end date reopens it and leaves a permanent mark here.
        </p>
      ) : null}

      {count === 0 ? (
        <p className="text-sm text-muted-foreground">
          {isMissed
            ? "No extensions yet — move the end date later to reopen moves and start the accountability log."
            : "No extensions yet. The current end date is still the original target."}
        </p>
      ) : (
        <ol className="relative space-y-0 border-l border-border/70 pl-4" aria-label="End date change history">
          <li className="relative pb-4">
            <span className="absolute top-1.5 -left-[1.285rem] size-2.5 rounded-full border-2 border-background bg-accent-brand" aria-hidden="true" />
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current</p>
            <p className="text-sm font-medium tabular-nums">{formatDay(props.currentEndDate)}</p>
          </li>

          {newestFirst.map((change, index) => (
            <li key={`${change.changedAt}-${change.previousEndDate}-${change.newEndDate}`} className={index === newestFirst.length - 1 ? "relative" : "relative pb-4"}>
              <span className="absolute top-1.5 -left-[1.285rem] size-2.5 rounded-full border-2 border-background bg-muted-foreground/50" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">
                Extended on <span className="tabular-nums">{formatChangedAt(change.changedAt)}</span>
              </p>
              <p className="text-sm font-medium tabular-nums">
                <span className="text-muted-foreground line-through decoration-muted-foreground/60">{formatDay(change.previousEndDate)}</span>
                <span className="mx-1.5 text-muted-foreground" aria-hidden="true">
                  →
                </span>
                <span>{formatDay(change.newEndDate)}</span>
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
