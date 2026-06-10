import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CalendarIcon, CalendarRangeIcon, CheckIcon, ChevronRightIcon, GaugeIcon, HeartIcon, LayoutDashboardIcon, ListChecksIcon, MoonIcon, PlusCircleIcon, SettingsIcon, SparklesIcon, TargetIcon, TriangleAlertIcon, TrophyIcon, type LucideIcon } from "lucide-react";
import Image from "next/image";

type StatTone = "default" | "positive" | "warning";

const chipByTone: Record<StatTone, string> = {
  default: "bg-primary/10 text-primary",
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

const ambitions: { name: string; color: string; progress: number; priority: string; tracking: string; due: string; definition: string; favourited: boolean }[] = [
  { name: "Learn Machine Learning", color: "#00bfff", progress: 67, priority: "high", tracking: "milestone", due: "Sep 14, 2026", definition: "Go from fundamentals to shipping a real model.", favourited: true },
  { name: "Run a Marathon", color: "#32cd32", progress: 75, priority: "medium", tracking: "task", due: "Oct 2, 2026", definition: "Build up to 42.2km without breaking down.", favourited: false },
  { name: "Launch Side Project", color: "#ff7733", progress: 55, priority: "high", tracking: "milestone", due: "Jul 30, 2026", definition: "From rough idea to first paying users.", favourited: false },
];

const priorityBorder: Record<string, string> = {
  high: "border-red-500",
  medium: "border-yellow-500",
  low: "border-green-500",
};

const sidebarNav: { title: string; icon: LucideIcon; active: boolean }[] = [
  { title: "Dashboard", icon: LayoutDashboardIcon, active: true },
  { title: "All Ambitions", icon: TargetIcon, active: false },
  { title: "Create Ambition", icon: PlusCircleIcon, active: false },
];

export default function DashboardPreview() {
  return (
    <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-2xl border border-primary/10 overflow-hidden">
      {/* Browser-like chrome */}
      <div className="bg-muted/60 border-b border-border flex items-center p-3">
        <div className="flex gap-1.5 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-background/70 rounded-full h-6 px-3 text-xs flex items-center justify-center text-muted-foreground">ambitiousyou.pro/dashboard</div>
      </div>

      {/* App shell */}
      <div className="flex h-150 w-full bg-background">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-background md:flex">
          <div className="flex h-14 items-center border-b border-border px-4">
            <div className="flex items-center gap-2">
              <Image src="/svg_logos/favicon_32px.svg" alt="AmbitiousYou" width={28} height={28} className="size-7!" style={{ width: "auto", height: "auto" }} />
              <span className="text-lg">
                <span className="font-normal">Ambitious</span>
                <span className="font-bold">You</span>
              </span>
            </div>
          </div>

          <div className="flex-1 px-2 py-4">
            <nav className="space-y-1">
              {sidebarNav.map((item) => (
                <div key={item.title} className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors", item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
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
                      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-2xl", chipByTone[stat.tone])} aria-hidden="true">
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
                      <ListChecksIcon className="size-4 text-primary" />
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
                      <div key={move.title} className={cn("flex items-start gap-3 rounded-2xl border p-3", move.isNext ? "border-primary/30 bg-primary/5" : "border-border/60 bg-background/60")}>
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 text-transparent" aria-hidden="true">
                          <CheckIcon className="size-3.5" />
                        </span>
                        <div className="min-w-0 flex-1 space-y-1">
                          {move.isNext ? (
                            <p className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
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
                      <CalendarRangeIcon className="size-4 text-primary" />
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
                    <TargetIcon className="size-5 text-primary" />
                    Your active ambitions
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    All ambitions
                    <ArrowRightIcon className="size-4" />
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {ambitions.map((ambition) => (
                    <Card key={ambition.name} className="bg-card">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                          <div className="mt-2 flex min-w-0 items-center gap-1.5">
                            {ambition.favourited ? <HeartIcon className="size-4 shrink-0 fill-pink-500 text-pink-500" aria-hidden="true" /> : null}
                            <CardTitle className="line-clamp-1">{ambition.name}</CardTitle>
                          </div>
                          <Badge variant="outline" className={cn("font-mono text-xs font-bold uppercase", priorityBorder[ambition.priority])}>{ambition.priority}</Badge>
                        </div>
                        <CardDescription className="line-clamp-1">{ambition.definition}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="mb-1 flex justify-between text-sm">
                              <span>Progress</span>
                              <span className="tabular-nums">{ambition.progress}%</span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-primary/20">
                              <div className="h-full rounded-full" style={{ width: `${ambition.progress}%`, backgroundColor: ambition.color }} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <GaugeIcon className="size-3.5" />
                              <span className="text-xs font-black uppercase tracking-tighter">{ambition.tracking}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="size-3.5" />
                              <span>Due {ambition.due}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center overflow-hidden rounded-full font-mono text-xs font-bold uppercase text-black">
                            <span className="bg-gray-200 px-2 pt-px">Status</span>
                            <span className="bg-green-400 px-2 pt-px">Active</span>
                          </div>
                          <ChevronRightIcon className="size-4" />
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
