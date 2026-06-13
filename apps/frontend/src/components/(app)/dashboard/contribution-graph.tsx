import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContributionCalendar } from "@/lib/dashboard/contribution";
import { cn } from "@/lib/utils";
import { ActivityIcon, CalendarDaysIcon, InfoIcon } from "lucide-react";
import type { CSSProperties } from "react";

interface ContributionGraphProps {
  calendar: ContributionCalendar;
  hadErrors?: boolean;
  /** When true, completions before today were seeded from last-edit time (approximate). */
  backfillEstimated?: boolean;
}

const LEVEL_CLASS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-muted",
  1: "bg-emerald-500/25",
  2: "bg-emerald-500/45",
  3: "bg-emerald-500/70",
  4: "bg-emerald-500",
};

const LEVELS: (0 | 1 | 2 | 3 | 4)[] = [0, 1, 2, 3, 4];

/** Weekday rows to label on the left (Mon/Wed/Fri), GitHub-style. */
const LABELLED_WEEKDAYS = new Set([1, 3, 5]);

/**
 * A GitHub-style contribution heatmap of moves completed per day over the last ~year. Pure server
 * component — ~371 plain cells with native `title` + `aria-label` tooltips, so there's zero client JS
 * and no per-cell Radix tooltip. The month-label row and the day grid share one `gridTemplateColumns`
 * (and the weekday column shares the row template + a spacer) so everything aligns without pixel math.
 */
export function ContributionGraph(props: ContributionGraphProps) {
  const { calendar } = props;
  const { stats } = calendar;

  const cellVars = { "--cell": "11px", "--gap": "3px" } as CSSProperties;
  const columnsStyle: CSSProperties = { gridTemplateColumns: `repeat(${calendar.numWeeks}, var(--cell))`, columnGap: "var(--gap)" };
  const rowsStyle: CSSProperties = { gridTemplateRows: "repeat(7, var(--cell))", rowGap: "var(--gap)" };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDaysIcon className="size-4 text-foreground" />
          Contribution calendar
        </CardTitle>
        <CardDescription>Every move you&apos;ve completed over the last year.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!stats.hasAnyCompletionEver ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-muted/20 p-8 text-center">
            <ActivityIcon className="size-7 text-muted-foreground/50" aria-hidden="true" />
            <p className="text-sm font-medium">No movement yet</p>
            <p className="max-w-sm text-xs text-muted-foreground">Complete a task or milestone and it&apos;ll light up here — a year of momentum, one square at a time.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium tabular-nums text-foreground">{stats.totalCompleted}</span> moves in the last year
              <span aria-hidden="true"> · </span>
              <span className="font-medium tabular-nums text-foreground">{stats.activeDays}</span> active days
              <span aria-hidden="true"> · </span>
              <span className="font-medium tabular-nums text-foreground">{stats.longestStreak}</span>-day longest streak
            </p>

            <div className="overflow-x-auto">
              <div className="flex w-max gap-2" style={cellVars}>
                {/* Left: a spacer the height of the month row, then the weekday labels aligned to grid rows. */}
                <div className="flex flex-col gap-[var(--gap)]">
                  <div className="h-4" aria-hidden="true" />
                  <div className="grid text-[10px] text-muted-foreground" style={rowsStyle} aria-hidden="true">
                    {calendar.weekdayLabels.map((label, index) => (
                      <span key={label} className="flex items-center leading-none">
                        {LABELLED_WEEKDAYS.has(index) ? label : ""}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: month labels above the day grid, sharing one column template. */}
                <div className="flex flex-col gap-[var(--gap)]">
                  <div className="grid h-4 items-end text-[10px] text-muted-foreground" style={columnsStyle} aria-hidden="true">
                    {calendar.monthLabels.map((month) => (
                      <span key={`${month.weekIndex}-${month.label}`} className="whitespace-nowrap leading-none" style={{ gridColumnStart: month.weekIndex + 1 }}>
                        {month.label}
                      </span>
                    ))}
                  </div>

                  <div role="grid" aria-label="Moves completed per day over the last year" className="grid grid-flow-col" style={{ gridTemplateRows: "repeat(7, var(--cell))", gridAutoColumns: "var(--cell)", gap: "var(--gap)" }}>
                    {calendar.weeks.map((week, weekIndex) =>
                      week.map((day, dayIndex) =>
                        day === null ? (
                          <div key={`pad-${weekIndex}-${dayIndex}`} aria-hidden="true" />
                        ) : (
                          <div
                            key={day.dateKey}
                            role="gridcell"
                            title={`${day.label}: ${day.count} ${day.count === 1 ? "move" : "moves"}`}
                            aria-label={`${day.label}, ${day.count} ${day.count === 1 ? "move" : "moves"} completed`}
                            className={cn("rounded-[3px] ring-1 ring-inset ring-foreground/5", LEVEL_CLASS[day.level])}
                          />
                        ),
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground" aria-label="Activity level legend">
              <span>Less</span>
              {LEVELS.map((level) => (
                <span key={level} className={cn("size-[11px] rounded-[3px] ring-1 ring-inset ring-foreground/5", LEVEL_CLASS[level])} aria-hidden="true" />
              ))}
              <span>More</span>
            </div>
          </>
        )}

        {props.hadErrors ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <InfoIcon className="size-3.5 shrink-0" />
            Some moves couldn&apos;t be loaded, so totals may be slightly low.
          </p>
        ) : null}
        {props.backfillEstimated && stats.hasAnyCompletionEver ? (
          <p className="text-xs text-muted-foreground/80">Completions before today are estimated from last activity; new ones are exact.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
