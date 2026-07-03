import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContributionCalendar } from "@/lib/dashboard/contribution";
import { ActivityIcon, CalendarCheckIcon, CalendarDaysIcon, FlameIcon, InfoIcon, SparklesIcon, TrophyIcon, ZapIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ContributionExportButton } from "./contribution-export-button";
import { ContributionGrid } from "./contribution-grid";

interface ContributionGraphProps {
  calendar: ContributionCalendar;
  hadErrors?: boolean;
  /** When true, completions before today were seeded from last-edit time (approximate). */
  backfillEstimated?: boolean;
}

/**
 * GitHub-style contribution calendar of moves completed per day over the last ~year. The interactive
 * grid (with per-cell tooltips) is a small client island ({@link ContributionGrid}); this server shell
 * owns the card, the empty state, and — on large screens — a contained-width layout where the calendar
 * keeps its natural size and the leftover space is filled with year-scoped insight tiles.
 */
export function ContributionGraph(props: ContributionGraphProps) {
  const { calendar } = props;
  const { stats } = calendar;

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <CalendarDaysIcon className="size-4 text-foreground" />
            Contribution calendar
          </CardTitle>
          <CardDescription>Every move you&apos;ve completed over the last year.</CardDescription>
        </div>
        <ContributionExportButton calendar={calendar} />
      </CardHeader>

      <CardContent className="space-y-4">
        {!stats.hasAnyCompletionEver ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-muted/20 p-8 text-center">
            <ActivityIcon className="size-7 text-muted-foreground/50" aria-hidden="true" />
            <p className="text-sm font-medium">No movement yet</p>
            <p className="max-w-sm text-xs text-muted-foreground">Complete a task or milestone and it&apos;ll light up here — a year of momentum, one square at a time.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-start 2xl:gap-8">
            {/* Left: the calendar, contained at its natural width on extra-wide screens. */}
            <div className="2xl:shrink-0">
              <ContributionGrid weeks={calendar.weeks} numWeeks={calendar.numWeeks} monthLabels={calendar.monthLabels} weekdayLabels={calendar.weekdayLabels} />
            </div>

            {/* Right: year-scoped insight tiles that put the leftover width to use. */}
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:min-w-0 2xl:flex-1 2xl:grid-cols-2">
              <InsightTile icon={<ActivityIcon className="size-4" />} value={String(stats.totalCompleted)} label="moves this year" />
              <InsightTile icon={<FlameIcon className="size-4" />} value={String(stats.currentStreak)} label="day current streak" />
              <InsightTile icon={<TrophyIcon className="size-4" />} value={String(stats.longestStreak)} label="day longest streak" />
              <InsightTile icon={<CalendarCheckIcon className="size-4" />} value={String(stats.activeDays)} label="active days" />
              <InsightTile icon={<SparklesIcon className="size-4" />} value={stats.bestDay ? String(stats.bestDay.count) : "—"} label={stats.bestDay ? `best day · ${stats.bestDay.label}` : "best day"} />
              <InsightTile icon={<ZapIcon className="size-4" />} value={stats.busiestWeekday ? `${stats.busiestWeekday.label}s` : "—"} label="busiest day" />
            </dl>
          </div>
        )}

        {props.hadErrors ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <InfoIcon className="size-3.5 shrink-0" />
            Some moves couldn&apos;t be loaded, so totals may be slightly low.
          </p>
        ) : null}
        {props.backfillEstimated && stats.hasAnyCompletionEver ? <p className="text-xs text-muted-foreground/80">Completions before today are estimated from last activity; new ones are exact.</p> : null}
      </CardContent>
    </Card>
  );
}

interface InsightTileProps {
  icon: ReactNode;
  value: string;
  label: string;
}

function InsightTile(props: InsightTileProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-muted/20 p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-chart-1/10 dark:text-chart-1" aria-hidden="true">
        {props.icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-base font-semibold leading-none tabular-nums">{props.value}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{props.label}</p>
      </div>
    </div>
  );
}
