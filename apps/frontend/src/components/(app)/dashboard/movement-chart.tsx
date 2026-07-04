"use client";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type MovementSeries, type MovementWindow } from "@/lib/dashboard/movement";
import { ActivityIcon, FlameIcon, InfoIcon, TrendingUpIcon, TrophyIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface MovementChartProps {
  /** Pre-built series for each window, so toggling is instant (no refetch, no client date math). */
  series: Record<MovementWindow, MovementSeries>;
  hadErrors?: boolean;
  /** When true, completions before today were seeded from last-edit time (approximate). */
  backfillEstimated?: boolean;
}

// Bar fills use the app's move-kind hues (teal = task, fuchsia = milestone) to stay consistent with
// MoveKindBadge / MOVE_KIND_STYLE; the chart config maps these to --color-taskCount / --color-milestoneCount.
const chartConfig = {
  taskCount: { label: "Tasks", color: "oklch(0.704 0.14 182.503)" }, // teal-500
  milestoneCount: { label: "Milestones", color: "oklch(0.667 0.295 322.15)" }, // fuchsia-500
} satisfies ChartConfig;

const WINDOW_OPTIONS: MovementWindow[] = [7, 14, 30];

export function MovementChart(props: MovementChartProps) {
  const [window, setWindow] = useState<MovementWindow>(7);
  const active = props.series[window];
  const stats = active.stats;
  // The streak is a "current" fact, not a per-window one — read it from the widest window so it doesn't
  // shrink just because you're viewing 7 days.
  const currentStreak = props.series[30].stats.currentStreak;

  // Thin x-axis labels so the 14/30-day windows don't collide.
  const tickInterval = window <= 7 ? 0 : window <= 14 ? 1 : 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="size-4 text-foreground" />
          Your movement
        </CardTitle>
        <CardDescription>Moves you&apos;ve completed, day by day.</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={String(window)}
            onValueChange={(value) => {
              if (value) setWindow(Number(value) as MovementWindow);
            }}
            variant="outline"
            size="sm"
            aria-label="Time range">
            {WINDOW_OPTIONS.map((option) => (
              <ToggleGroupItem
                key={option}
                value={String(option)}
                className="px-3 tabular-nums data-[state=on]:border-accent-brand data-[state=on]:bg-accent-brand/5">
                {option}D
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MovementStat icon={<ActivityIcon className="size-4" />} value={String(stats.totalCompleted)} label={`done in ${window} days`} />
          <MovementStat icon={<TrendingUpIcon className="size-4" />} value={stats.dailyAverage.toFixed(1)} label="per day average" />
          <MovementStat icon={<FlameIcon className="size-4" />} value={String(currentStreak)} label={currentStreak === 1 ? "day streak" : "day streak"} />
          <MovementStat icon={<TrophyIcon className="size-4" />} value={stats.bestDay ? String(stats.bestDay.total) : "—"} label={stats.bestDay ? `best day · ${stats.bestDay.label}` : "best day"} />
        </dl>

        {!stats.hasAnyCompletionEver ? (
          <MovementEmptyState />
        ) : (
          <>
            <ChartContainer config={chartConfig} className="aspect-[16/5] w-full">
              <BarChart accessibilityLayer data={active.days} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval={tickInterval} minTickGap={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="taskCount" stackId="moves" fill="var(--color-taskCount)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="milestoneCount" stackId="moves" fill="var(--color-milestoneCount)" radius={[4, 4, 0, 0]} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
            {stats.totalCompleted === 0 ? (
              <p className="text-center text-xs text-muted-foreground">No moves completed in the last {window} days — pick one off your list to get going.</p>
            ) : null}
          </>
        )}

        {stats.ambitionsCompletedInWindow > 0 ? (
          <p className="text-xs text-muted-foreground">
            <AmbitionsCompletedFootnote count={stats.ambitionsCompletedInWindow} />
          </p>
        ) : null}
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

interface MovementStatProps {
  icon: ReactNode;
  value: string;
  label: string;
}

function MovementStat(props: MovementStatProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-muted/20 p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent-brand/10 text-accent-brand" aria-hidden="true">
        {props.icon}
      </span>
      <div className="min-w-0">
        <p className="text-lg font-semibold leading-none tabular-nums">{props.value}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{props.label}</p>
      </div>
    </div>
  );
}

function MovementEmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-muted/20 p-8 text-center">
      <ActivityIcon className="size-7 text-muted-foreground/50" aria-hidden="true" />
      <p className="text-sm font-medium">No movement yet</p>
      <p className="max-w-sm text-xs text-muted-foreground">Complete a task or milestone and it&apos;ll show up here — momentum builds one move at a time.</p>
    </div>
  );
}

function AmbitionsCompletedFootnote(props: { count: number }) {
  const tail =
    props.count === 1
      ? " ambition completed in this window — that's real progress."
      : " ambitions completed in this window — that's real progress.";

  return (
    <>
      <span className="font-medium text-foreground tabular-nums">{props.count}</span>
      {tail}
    </>
  );
}
