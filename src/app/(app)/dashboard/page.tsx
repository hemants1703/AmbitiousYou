import { MotionWrapper } from "@/components/MotionWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AmbitionPriorityBadge } from "@/features/(app)/ambitions/components/AmbitionPriorityBadge";
import confirmSession from "@/lib/auth/confirmSession";
import { motivationalQuotes } from "@/lib/motivationalQuotes";
import { AmbitionsService } from "@/services/ambitionsService";
import { InfoCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import "@/styles/AmbitionCard.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard for your ambitions and progress",
};

export default async function DashboardPage() {
  // Session check helper, redirects to login if not authenticated
  const session = await confirmSession();

  if (!session) {
    redirect("/login", RedirectType.replace);
  }

  const userData = session.user;

  const ambitionsService = new AmbitionsService();

  // Fetch data using services
  const ambitions = await ambitionsService.fetchUserAmbitions(userData.id);
  const tasks = await ambitionsService.fetchUserTasks(userData.id);
  const milestones = await ambitionsService.fetchUserMilestones(userData.id);

  // Handle errors - throw to trigger error page
  if (ambitions instanceof Error) throw ambitions;
  if (tasks instanceof Error) throw tasks;
  if (milestones instanceof Error) throw milestones;

  const totalTasksAndMilestones = tasks.length + milestones.length;
  const completedTasksAndMilestones =
    tasks.filter((task) => task.taskCompleted === true).length +
    milestones.filter((milestone) => milestone.milestoneCompleted === true).length;
  const nearCompletionAmbitions = ambitions.filter(
    (ambition) => ambition.ambitionPercentageCompleted && ambition.ambitionPercentageCompleted >= 80
  );
  // Pick a random motivational quote (SSR)
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  const randomMotivationalQuote = motivationalQuotes[randomIndex];

  // Calculate greeting server-side
  const hour = new Date().getHours();
  let greeting = "Welcome";
  if (hour >= 5 && hour < 12) greeting = "Good morning";
  else if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  // Prepare ambitions summary for dashboard (active ambitions only)
  const activeAmbitions = ambitions.filter((a) => a.ambitionStatus === "active");
  const ambitionsSummary = activeAmbitions.map((ambition) => {
    const ambitionTasks = tasks.filter((t) => t.ambitionId === ambition.id);
    const ambitionMilestones = milestones.filter((m) => m.ambitionId === ambition.id);
    const completed =
      ambition.ambitionTrackingMethod === "task"
        ? ambitionTasks.filter((t) => t.taskCompleted).length
        : ambitionMilestones.filter((m) => m.milestoneCompleted).length;
    const total =
      ambition.ambitionTrackingMethod === "task" ? ambitionTasks.length : ambitionMilestones.length;
    return {
      id: ambition.id,
      name: ambition.ambitionName,
      color: ambition.ambitionColor,
      percentage: ((completedTasksAndMilestones / totalTasksAndMilestones) * 100).toFixed(0),
      trackingMethod: ambition.ambitionTrackingMethod,
      completed,
      total,
      priority: ambition.ambitionPriority,
    };
  });

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-10 pb-12 p-6 md:p-10 pt-8 bg-background">
        {/* Welcome Banner */}
        <MotionWrapper
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border bg-card/90 p-8 shadow-sm relative overflow-hidden mb-2"
        >
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                {greeting} <span className="text-primary">{userData.name.split(" ")[0]}</span>,
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Here&apos;s your progress at a glance.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="gap-2 flex justify-center items-center px-6 py-3 text-lg font-semibold rounded-xl border border-primary/30 bg-background hover:bg-primary/10 transition-colors"
            >
              <Link prefetch={true} href="/ambitions/new?ref=dashboard">
                <PlusCircledIcon className="h-5 w-5" />
                New Ambition
              </Link>
            </Button>
          </div>
        </MotionWrapper>

        {/* Key Stats */}
        <MotionWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {/* Active Ambitions */}
          <div className="rounded-2xl border bg-card/80 p-6 flex flex-col items-center shadow-sm">
            <span className="text-muted-foreground text-base mb-1 font-medium">
              Active Ambitions
            </span>
            <span className="text-3xl font-extrabold tracking-tight">
              {ambitionsSummary.length}
            </span>
            <Badge
              variant="outline"
              className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs px-2 py-1 rounded-lg"
            >
              {nearCompletionAmbitions.length} near completion
            </Badge>
          </div>
          {/* Completed Tasks & Milestones */}
          <div className="rounded-2xl border bg-card/80 p-6 flex flex-col items-center shadow-sm">
            <span className="text-muted-foreground text-base mb-1 font-medium">
              Completed Tasks & Milestones
            </span>
            <span className="text-3xl font-extrabold tracking-tight">{`${completedTasksAndMilestones}/${totalTasksAndMilestones}`}</span>
            <Progress
              value={
                totalTasksAndMilestones > 0
                  ? (completedTasksAndMilestones / totalTasksAndMilestones) * 100
                  : 0
              }
              className="h-2 mt-2 w-full"
            />
          </div>
          {/* Productivity Score */}
          <div className="rounded-2xl border bg-card/80 p-6 flex flex-col items-center shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-muted-foreground text-base font-medium">
                Productivity Score
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer">
                    <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="text-xs max-w-xs">
                  Productivity Score is the percentage of completed tasks and milestones out of your
                  total. (Completed / Total) × 100
                </TooltipContent>
              </Tooltip>
            </div>
            {(() => {
              const score =
                totalTasksAndMilestones > 0
                  ? Math.round((completedTasksAndMilestones / totalTasksAndMilestones) * 100)
                  : 0;
              const stars = Math.max(1, Math.ceil(score / 20));
              return (
                <>
                  <span className="text-3xl font-extrabold tracking-tight">{score}%</span>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < stars ? "text-yellow-400 text-xl" : "text-muted-foreground text-xl"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
          {/* Motivational Quote */}
          <div className="rounded-2xl border bg-card/80 p-6 flex flex-col items-center shadow-sm">
            <span className="text-muted-foreground text-base mb-1 font-medium">
              Motivational Quote
            </span>
            <blockquote className="border-l-4 border-primary pl-4 italic mt-2 text-center text-base">
              &quot;{randomMotivationalQuote.quote}&quot;
            </blockquote>
            <span className="text-right text-xs text-muted-foreground mt-2">
              — {randomMotivationalQuote.author}
            </span>
          </div>
        </MotionWrapper>

        {/* Ambitions List */}
        <MotionWrapper
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-extrabold mb-6 tracking-tight">Your Active Ambitions</h2>
          {ambitionsSummary.length === 0 ? (
            <div className="text-muted-foreground text-lg">
              No active ambitions yet. Start by creating one!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ambitionsSummary.map((ambition) => (
                <Link
                  href={`/ambitions/${ambition.id}?ref=dashboard`}
                  prefetch={true}
                  key={ambition.id}
                  className="ambition-card active:scale-[0.99] active:translate-y-px active:brightness-80 border rounded-2xl p-5 flex flex-col gap-2 bg-background/80 shadow-sm hover:shadow-md transition-colors cursor-pointer"
                  style={
                    {
                      "--ambition-color": ambition.color ?? "#64ccc5",
                    } as React.CSSProperties
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span
                        className="block size-3 aspect-square rounded-full"
                        style={{ background: ambition.color ?? "#64ccc5" }}
                      />
                      <span className="font-semibold text-lg tracking-tight line-clamp-1">
                        {ambition.name}
                      </span>
                    </span>
                    <AmbitionPriorityBadge ambitionPriority={ambition.priority!} />
                  </div>
                  {/* <Progress value={ambition.percentage} className="h-2" /> */}
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>
                      {ambition.completed}/{ambition.total}{" "}
                      {ambition.trackingMethod === "task" ? "tasks" : "milestones"} completed
                    </span>
                    <span>{ambition.percentage}%</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </MotionWrapper>
      </div>
    </TooltipProvider>
  );
}
