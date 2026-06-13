"use client";

import type { ContributionDay, ContributionMonthLabel, ContributionWeek } from "@/lib/dashboard/contribution";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

interface ContributionGridProps {
  weeks: ContributionWeek[];
  numWeeks: number;
  monthLabels: ContributionMonthLabel[];
  weekdayLabels: string[];
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

interface ActiveTip {
  day: ContributionDay;
  left: number;
  top: number;
}

/**
 * The interactive heatmap grid for the contribution calendar. Client-only so each cell can drive a
 * single shared, styled tooltip (one portal element, not ~371 Radix tooltips) showing that day's full
 * data — date, total, task/milestone split. The month-label row and day grid share one
 * `gridTemplateColumns` (and the weekday column shares the row template + a spacer) so everything aligns
 * with no pixel math; the grid scrolls horizontally on narrow screens.
 */
export function ContributionGrid(props: ContributionGridProps) {
  const [active, setActive] = useState<ActiveTip | null>(null);

  const showTip = useCallback((element: HTMLElement, day: ContributionDay) => {
    const rect = element.getBoundingClientRect();
    setActive({ day, left: rect.left + rect.width / 2, top: rect.top });
  }, []);
  const hideTip = useCallback(() => setActive(null), []);

  const cellVars = { "--cell": "13px", "--gap": "3px" } as CSSProperties;
  const columnsStyle: CSSProperties = { gridTemplateColumns: `repeat(${props.numWeeks}, var(--cell))`, columnGap: "var(--gap)" };
  const rowsStyle: CSSProperties = { gridTemplateRows: "repeat(7, var(--cell))", rowGap: "var(--gap)" };

  // Memoised so a hover (which only moves the tooltip) doesn't re-render all ~371 squares.
  const cells = useMemo(
    () =>
      props.weeks.map((week, weekIndex) =>
        week.map((day, dayIndex) =>
          day === null ? (
            <div key={`pad-${weekIndex}-${dayIndex}`} aria-hidden="true" />
          ) : (
            <div
              key={day.dateKey}
              role="gridcell"
              aria-label={`${day.label}, ${day.count} ${day.count === 1 ? "move" : "moves"} completed`}
              onMouseEnter={(event) => showTip(event.currentTarget, day)}
              onMouseLeave={hideTip}
              className={cn("rounded-[3px] ring-1 ring-inset ring-foreground/5 transition-[box-shadow] hover:ring-foreground/25", LEVEL_CLASS[day.level])}
            />
          ),
        ),
      ),
    [props.weeks, showTip, hideTip],
  );

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <div className="flex w-max gap-2" style={cellVars}>
          {/* Spacer (height of the month row) + weekday labels aligned to grid rows. */}
          <div className="flex flex-col gap-[var(--gap)]">
            <div className="h-4" aria-hidden="true" />
            <div className="grid text-[10px] text-muted-foreground" style={rowsStyle} aria-hidden="true">
              {props.weekdayLabels.map((label, index) => (
                <span key={label} className="flex items-center leading-none">
                  {LABELLED_WEEKDAYS.has(index) ? label : ""}
                </span>
              ))}
            </div>
          </div>

          {/* Month labels above the day grid, sharing one column template. */}
          <div className="flex flex-col gap-[var(--gap)]">
            <div className="grid h-4 items-end text-[10px] text-muted-foreground" style={columnsStyle} aria-hidden="true">
              {props.monthLabels.map((month) => (
                <span key={`${month.weekIndex}-${month.label}`} className="whitespace-nowrap leading-none" style={{ gridColumnStart: month.weekIndex + 1 }}>
                  {month.label}
                </span>
              ))}
            </div>

            <div role="grid" aria-label="Moves completed per day over the last year" className="grid grid-flow-col" style={{ gridTemplateRows: "repeat(7, var(--cell))", gridAutoColumns: "var(--cell)", gap: "var(--gap)" }}>
              {cells}
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

      {active
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none fixed z-50 rounded-xl bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10"
              style={{ left: active.left, top: active.top - 6, transform: "translate(-50%, -100%)" }}>
              <p className="font-medium">{active.day.label}</p>
              <p className="text-muted-foreground">{active.day.count === 0 ? "No moves completed" : `${active.day.count} ${active.day.count === 1 ? "move" : "moves"} completed`}</p>
              {active.day.count > 0 ? (
                <p className="tabular-nums text-muted-foreground">
                  {active.day.taskCount} {active.day.taskCount === 1 ? "task" : "tasks"} · {active.day.milestoneCount} {active.day.milestoneCount === 1 ? "milestone" : "milestones"}
                </p>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
