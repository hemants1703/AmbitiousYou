import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ActivityIcon, ArrowRightIcon, CalendarCheckIcon, CalendarDaysIcon, CalendarRangeIcon, CheckIcon, FlameIcon, GaugeIcon, LayoutDashboardIcon, ListChecksIcon, MoonIcon, PlusCircleIcon, SettingsIcon, SparklesIcon, TargetIcon, TrendingUpIcon, TriangleAlertIcon, TrophyIcon, type LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import MockFrame from "../mock-frame";

type StatTone = "default" | "positive" | "warning";

const chipByTone: Record<StatTone, string> = {
  default: "bg-primary/10 dark:bg-chart-1/10 text-primary dark:text-chart-1",
  positive: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const stats: { label: string; value: string; icon: LucideIcon; tone: StatTone; helper: string; progress: number | null }[] = [
  { label: "Active", value: "3", icon: TargetIcon, tone: "default", helper: "5 total ambitions", progress: null },
  { label: "Avg progress", value: "64%", icon: GaugeIcon, tone: "default", helper: "across active ambitions", progress: 64 },
  { label: "Completed", value: "2", icon: TrophyIcon, tone: "positive", helper: "ambitions achieved", progress: null },
  { label: "Needs attention", value: "1", icon: TriangleAlertIcon, tone: "warning", helper: "due within a week", progress: null },
];

const nextMoves: { title: string; ambition: string; due: string; isNext: boolean }[] = [
  { title: "Train the model on the dataset", ambition: "Learn Machine Learning", due: "Due today", isNext: true },
  { title: "Easy 5km recovery run", ambition: "Run a Marathon", due: "Due tomorrow", isNext: false },
];

const weekItems: { label: string; item: string; count: number }[] = [
  { label: "Tomorrow", item: "Easy 5km recovery run", count: 2 },
  { label: "Wednesday", item: "Lecture 4: gradient descent", count: 3 },
];

const sidebarNav: { title: string; icon: LucideIcon; active: boolean }[] = [
  { title: "Dashboard", icon: LayoutDashboardIcon, active: true },
  { title: "All Ambitions", icon: TargetIcon, active: false },
  { title: "Create Ambition", icon: PlusCircleIcon, active: false },
];

// Contribution heatmap mock. Levels are derived deterministically (no Math.random → identical on server
// and client, so no hydration drift) to look organic: denser recently, lighter on weekends.
const HEAT_WEEKS = 30;
const heatClass: Record<number, string> = {
  0: "bg-muted",
  1: "bg-emerald-500/25",
  2: "bg-emerald-500/45",
  3: "bg-emerald-500/70",
  4: "bg-emerald-500",
};
function mockHeatLevel(week: number, day: number): number {
  const noise = Math.sin(week * 12.9898 + day * 4.1414) * 43758.5453;
  const frac = noise - Math.floor(noise); // deterministic 0..1
  const score = frac * 0.7 + (week / HEAT_WEEKS) * 0.32 - (day === 0 || day === 6 ? 0.22 : 0);
  if (score < 0.28) return 0;
  if (score < 0.46) return 1;
  if (score < 0.64) return 2;
  if (score < 0.82) return 3;
  return 4;
}
const heatWeeks: number[][] = Array.from({ length: HEAT_WEEKS }, (_, week) => Array.from({ length: 7 }, (_, day) => mockHeatLevel(week, day)));

// Movement chart mock — stacked task/milestone bar heights (px) for the last 7 days.
const movementBars: { task: number; milestone: number }[] = [
  { task: 16, milestone: 0 },
  { task: 26, milestone: 8 },
  { task: 12, milestone: 0 },
  { task: 30, milestone: 14 },
  { task: 22, milestone: 0 },
  { task: 18, milestone: 6 },
  { task: 34, milestone: 10 },
];

export default function DashboardPreview() {
  return (
    <>
      <p className="sr-only">
        A preview of the AmbitiousYou dashboard: stat cards for active and completed ambitions, the promise behind your top ambition, today&rsquo;s moves and what&rsquo;s coming up, a year-long contribution calendar of completed moves, and a momentum chart of how much you finished each day.
      </p>

      {/* Decorative product illustration — fake affordances inside are hidden from AT */}
      <div aria-hidden="true">
        <MockFrame url="ambitiousyou.pro/dashboard">
          {/* App shell */}
          <div className="flex h-128 w-full bg-background sm:h-150 lg:h-185">
            {/* Sidebar */}
            <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-background md:flex">
              <div className="flex h-14 items-center border-b border-border px-4">
                <div translate="no" className="flex items-center gap-2">
                  <Image src="/svg_logos/favicon_32px.svg" alt="" width={28} height={28} className="size-7" />
                  <span className="text-lg">
                    <span className="font-normal">Ambitious</span>
                    <span className="font-bold">You</span>
                  </span>
                </div>
              </div>

              <div className="flex-1 px-2 py-4">
                <nav className="space-y-1">
                  {sidebarNav.map((item) => (
                    <div key={item.title} className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm", item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </div>
                  ))}
                </nav>
              </div>

              <div className="border-t border-border px-2 py-2">
                <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground">
                  <SettingsIcon className="size-4" />
                  <span>Settings</span>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="flex min-w-0 flex-1 flex-col">
              {/* Top bar */}
              <div className="flex h-14 items-center justify-end gap-2 border-b border-border px-4">
                <div className="rounded-md p-2">
                  <MoonIcon className="size-4 text-muted-foreground" />
                </div>
              </div>

              {/* Dashboard content */}
              <div className="flex-1 overflow-hidden p-5">
                <div className="flex flex-col gap-5">
                  {/* Welcome header */}
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs text-muted-foreground">Monday, June 1</p>
                      <h2 className="text-xl font-bold tracking-tight">Good morning, Alex</h2>
                      <p className="text-sm text-muted-foreground">Strong momentum. You&rsquo;re over halfway across your active ambitions.</p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-1.5 rounded-4xl bg-primary px-4 text-sm font-medium text-primary-foreground sm:inline-flex sm:h-9">
                      <PlusCircleIcon className="size-4" />
                      New ambition
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {stats.map((stat) => (
                      <Card key={stat.label} size="sm" className="gap-3">
                        <div className="flex items-start justify-between gap-3 px-4">
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
                          </div>
                          <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-2xl", chipByTone[stat.tone])}>
                            <stat.icon className="size-5" />
                          </span>
                        </div>
                        <div className="space-y-2 px-4">
                          {stat.progress !== null ? (
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${stat.progress}%` }} />
                            </div>
                          ) : null}
                          <p className="text-xs text-muted-foreground">{stat.helper}</p>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Motivation banner — your "why" */}
                  <div className="rounded-3xl border border-primary/20 dark:border-chart-1/20 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-4 dark:from-chart-1/10 dark:via-chart-1/5">
                    <p className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-primary/80 dark:text-chart-1/80">
                      <SparklesIcon className="size-3" />
                      You promised yourself
                    </p>
                    <p className="mt-1.5 text-lg font-semibold tracking-tight">Become a Staff Engineer</p>
                    <p className="mt-1.5 border-l-2 border-primary/30 pl-3 text-sm text-foreground/80 dark:border-chart-1/30">Because the version of me who almost quit doesn&rsquo;t get the final say.</p>
                  </div>

                  {/* Contribution calendar — a year of completed moves */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarDaysIcon className="size-4 text-primary dark:text-chart-1" />
                        Contribution calendar
                      </CardTitle>
                      <CardDescription>Every move you&rsquo;ve completed over the last year.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
                        <div className="space-y-2">
                          <div className="grid grid-flow-col" style={{ gridTemplateRows: "repeat(7, 10px)", gridAutoColumns: "10px", gap: "3px" }}>
                            {heatWeeks.map((week, weekIndex) => week.map((level, dayIndex) => <div key={`${weekIndex}-${dayIndex}`} className={cn("rounded-xs ring-1 ring-inset ring-foreground/5", heatClass[level])} />))}
                          </div>
                          <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                            <span>Less</span>
                            {[0, 1, 2, 3, 4].map((level) => (
                              <span key={level} className={cn("size-2.5 rounded-xs ring-1 ring-inset ring-foreground/5", heatClass[level])} />
                            ))}
                            <span>More</span>
                          </div>
                        </div>
                        <dl className="grid grid-cols-2 gap-2 xl:flex-1">
                          <PreviewTile icon={<ActivityIcon className="size-3.5" />} value="248" label="moves this year" />
                          <PreviewTile icon={<FlameIcon className="size-3.5" />} value="12" label="day current streak" />
                          <PreviewTile icon={<TrophyIcon className="size-3.5" />} value="41" label="day longest streak" />
                          <PreviewTile icon={<CalendarCheckIcon className="size-3.5" />} value="156" label="active days" />
                        </dl>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Movement chart — momentum, day by day */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUpIcon className="size-4 text-foreground" />
                        Your movement
                      </CardTitle>
                      <CardDescription>Moves you&rsquo;ve completed, day by day.</CardDescription>
                      <CardAction>
                        <div className="flex items-center gap-1 rounded-3xl border border-border p-0.5 text-xs font-medium">
                          <span className="rounded-3xl bg-primary px-2.5 py-1 text-primary-foreground">7D</span>
                          <span className="px-2.5 py-1 text-muted-foreground">14D</span>
                          <span className="px-2.5 py-1 text-muted-foreground">30D</span>
                        </div>
                      </CardAction>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex h-24 items-end gap-2">
                        {movementBars.map((bar, index) => (
                          <div key={index} className="flex flex-1 flex-col justify-end gap-0.5">
                            {bar.milestone > 0 ? <div className="rounded-t-sm bg-fuchsia-500" style={{ height: `${bar.milestone}px` }} /> : null}
                            <div className={cn("bg-teal-500", bar.milestone > 0 ? "rounded-b-sm" : "rounded-sm")} style={{ height: `${bar.task}px` }} />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="size-2.5 rounded-sm bg-teal-500" /> Tasks
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="size-2.5 rounded-sm bg-fuchsia-500" /> Milestones
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Today | Coming up */}
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ListChecksIcon className="size-4 text-primary dark:text-chart-1" />
                          Your next moves
                        </CardTitle>
                        <CardDescription>The most urgent open work across every ambition.</CardDescription>
                        <CardAction>
                          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                            All ambitions
                            <ArrowRightIcon className="size-4" />
                          </span>
                        </CardAction>
                      </CardHeader>
                      <CardContent className="space-y-2.5">
                        {nextMoves.map((move) => (
                          <div key={move.title} className={cn("flex items-start gap-3 rounded-2xl border p-3", move.isNext ? "border-primary/30 bg-primary/5 dark:border-chart-1/30 dark:bg-chart-1/5" : "border-border/60 bg-background/60")}>
                            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 text-transparent">
                              <CheckIcon className="size-3.5" />
                            </span>
                            <div className="min-w-0 flex-1 space-y-1">
                              {move.isNext ? (
                                <p className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary dark:text-chart-1">
                                  <SparklesIcon className="size-3" />
                                  Your next move
                                </p>
                              ) : null}
                              <div className="flex items-start justify-between gap-2">
                                <p className="line-clamp-2 min-w-0 font-medium">{move.title}</p>
                                <Badge variant="outline" className="shrink-0 tabular-nums">{move.due}</Badge>
                              </div>
                              <p className="truncate text-xs text-muted-foreground">{move.ambition}</p>
                            </div>
                          </div>
                        ))}
                        <p className="px-1 pt-1 text-xs text-muted-foreground">+5 more open items across your ambitions</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CalendarRangeIcon className="size-4 text-primary dark:text-chart-1" />
                          Coming up this week
                        </CardTitle>
                        <CardDescription>What&rsquo;s due over the next 7 days.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {weekItems.map((group) => (
                          <div key={group.label} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 p-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{group.label}</p>
                              <p className="truncate text-xs text-muted-foreground">{group.item}</p>
                            </div>
                            <Badge variant="secondary" className="shrink-0 tabular-nums">{group.count}</Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MockFrame>
      </div>
    </>
  );
}

interface PreviewTileProps {
  icon: ReactNode;
  value: string;
  label: string;
}

function PreviewTile(props: PreviewTileProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-chart-1/10 dark:text-chart-1">{props.icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-none tabular-nums">{props.value}</p>
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{props.label}</p>
      </div>
    </div>
  );
}
