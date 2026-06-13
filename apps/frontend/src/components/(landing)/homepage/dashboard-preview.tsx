import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CalendarRangeIcon, CheckIcon, GaugeIcon, LayoutDashboardIcon, ListChecksIcon, MoonIcon, PlusCircleIcon, SettingsIcon, SparklesIcon, TargetIcon, TriangleAlertIcon, TrophyIcon, type LucideIcon } from "lucide-react";
import Image from "next/image";
import MockFrame from "../mock-frame";
import PreviewAmbitionCard, { type PreviewAmbition } from "./preview-ambition-card";

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
  { title: "Draft the waitlist page copy", ambition: "Launch Side Project", due: "3d left", isNext: false },
];

const weekItems: { label: string; item: string; count: number }[] = [
  { label: "Tomorrow", item: "Easy 5km recovery run", count: 2 },
  { label: "Wednesday", item: "Lecture 4: gradient descent", count: 3 },
  { label: "Friday", item: "Ship the waitlist page", count: 1 },
];

const ambitions: PreviewAmbition[] = [
  { name: "Learn Machine Learning", color: "#00bfff", progress: 67, priority: "high", due: "Sep 14, 2026", definition: "Go from fundamentals to shipping a real model.", favourited: true },
  { name: "Run a Marathon", color: "#32cd32", progress: 75, priority: "medium", due: "Oct 2, 2026", definition: "Build up to 42.2km without breaking down." },
  { name: "Launch Side Project", color: "#ff7733", progress: 55, priority: "high", due: "Jul 30, 2026", definition: "From rough idea to first paying users." },
];

const sidebarNav: { title: string; icon: LucideIcon; active: boolean }[] = [
  { title: "Dashboard", icon: LayoutDashboardIcon, active: true },
  { title: "All Ambitions", icon: TargetIcon, active: false },
  { title: "Create Ambition", icon: PlusCircleIcon, active: false },
];

export default function DashboardPreview() {
  return (
    <>
      <p className="sr-only">A preview of the AmbitiousYou dashboard: stat cards for active and completed ambitions, a list of your most urgent next moves, what’s coming up this week, and progress cards for each active ambition.</p>

      {/* Decorative product illustration — fake affordances inside are hidden from AT */}
      <div aria-hidden="true">
        <MockFrame url="ambitiousyou.pro/dashboard">
          {/* App shell */}
          <div className="flex h-104 w-full bg-background sm:h-120 lg:h-150">
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
                      <p className="text-sm text-muted-foreground">Strong momentum. You’re over halfway across your active ambitions.</p>
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

                  {/* Insights: next moves + coming up */}
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
                          <div key={move.title} className={cn("flex items-start gap-3 rounded-2xl border p-3", move.isNext ? "border-primary/30 dark:border-chart-1/30 bg-primary/5 dark:bg-chart-1/5" : "border-border/60 bg-background/60")}>
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
                        <CardDescription>What’s due over the next 7 days.</CardDescription>
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

                  {/* Active ambitions */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                        <TargetIcon className="size-5 text-primary dark:text-chart-1" />
                        Your active ambitions
                      </h3>
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        All ambitions
                        <ArrowRightIcon className="size-4" />
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {ambitions.map((ambition) => (
                        <PreviewAmbitionCard key={ambition.name} ambition={ambition} className="bg-card" />
                      ))}
                    </div>
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
