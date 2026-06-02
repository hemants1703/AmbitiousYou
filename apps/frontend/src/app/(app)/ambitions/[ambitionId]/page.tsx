import AmbitionDetailsSection from "@/components/(app)/ambitions/(ambitionId)/ambition-details/ambition-details-section";
import AmbitionOptionsDropdown from "@/components/(app)/ambitions/(ambitionId)/ambition-details/ambition-options-dropdown";
import MarkMilestoneAsCompletedDialog from "@/components/(app)/ambitions/(ambitionId)/Milestones/mark-milestone-as-completed-dialog";

import { AmbitionPriorityBadge } from "@/components/(app)/ambitions/ambition-priority-badge";
import { AmbitionStatusBadge } from "@/components/(app)/ambitions/ambition-status-badge";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAmbitionDetails, type AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import { getNotes } from "@/lib/api/notes/get-notes";
import { getTasks } from "@/lib/api/tasks/get-tasks";
import { getMilestones } from "@/lib/api/milestones/get-milestones";
import { requireUser } from "@/lib/auth";
import { Ambition, Milestone, Note, Task } from "@ambitiousyou/shared/types";
import { CalendarClockIcon, CalendarDaysIcon, CheckCircle2Icon, ChevronLeftIcon, FlagIcon, HeartIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { cache, type ReactNode } from "react";

interface AmbitionDetailsPageProps {
  params: Promise<{ ambitionId: string }>;
  searchParams: Promise<{
    mark_milestone_as_completed?: string;
    ref?: string | undefined;
  }>;
}

const getAmbitionData = cache(async (sessionToken: string, ambitionId: string): Promise<AmbitionDetails | null> => {
  return await getAmbitionDetails(sessionToken, ambitionId);
});

export async function generateMetadata(props: AmbitionDetailsPageProps): Promise<Metadata> {
  const { sessionToken } = await requireUser();

  const { ambitionId } = await props.params;

  const ambition = await getAmbitionData(sessionToken, ambitionId);
  if (!ambition) {
    throw new Error(`Failed to fetch ambition ${ambitionId}`);
  }

  return {
    title: ambition.ambitionName,
  };
}

export default async function AmbitionDetailsPage(props: AmbitionDetailsPageProps) {
  const { user: userDetails, sessionToken } = await requireUser();

  const { ambitionId } = await props.params;
  const searchParams = await props.searchParams;

  const [ambition, fetchedNotes, fetchedTasks, fetchedMilestones] = await Promise.all([
    getAmbitionData(sessionToken, ambitionId),
    getNotes(sessionToken, ambitionId),
    getTasks(sessionToken, ambitionId),
    getMilestones(sessionToken, ambitionId),
  ]);

  if (!ambition) {
    throw new Error(`Failed to fetch ambition ${ambitionId}`);
  }

  // The `/ambitions/:id/details` endpoint does not return tasks/milestones, so we read each
  // collection from its dedicated list endpoint (mirroring how notes are fetched above).
  const tasks: Task[] = ambition.ambitionTrackingMethod === "task" ? fetchedTasks : [];
  const milestones: Milestone[] = ambition.ambitionTrackingMethod === "milestone" ? fetchedMilestones : [];
  const notes: Note[] = fetchedNotes;
  const trackedItems = ambition.ambitionTrackingMethod === "task" ? tasks : milestones;

  const completedItems = trackedItems.filter((item) => ("taskCompleted" in item ? item.taskCompleted : item.milestoneCompleted)).length;
  const activeDays = Math.max(1, getDaysBetween(ambition.ambitionStartDate, ambition.ambitionEndDate));
  const today = new Date();
  const daysRemaining = getDaysBetween(today, ambition.ambitionEndDate);
  const progress = Math.min(Math.max(ambition.ambitionPercentageCompleted ?? 0, 0), 100);

  return (
    <section className="w-full pb-8">
      <div className="mx-auto flex w-full max-w-350 flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full bg-background/80">
            <Link prefetch={true} href={searchParams.ref ? `/${searchParams.ref}` : "/ambitions"}>
              <ChevronLeftIcon className="size-4" />
              Back to ambitions
            </Link>
          </Button>

          <div className="ml-auto hidden sm:block">
            <AmbitionOptionsDropdown ambitionId={ambition.id} ambitionName={ambition.ambitionName} userId={userDetails.id} isFavourited={ambition.isFavourited ?? false} />
          </div>

          <div className="sm:hidden">
            <AmbitionOptionsDropdown ambitionId={ambition.id} ambitionName={ambition.ambitionName} userId={userDetails.id} isFavourited={ambition.isFavourited ?? false} />
          </div>
        </div>

        {/* AMBITION DETAILS */}
        <MotionWrapper initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
          <Card>
            <CardContent className="space-y-6 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <div className="space-y-2">
                    <h1 className="line-clamp-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
                      {ambition.isFavourited ? <HeartIcon className="mr-2 mb-2 inline-flex size-7 fill-pink-500 text-pink-500 align-text-bottom" aria-label="Favourited ambition" /> : null}
                      {ambition.ambitionName}
                    </h1>
                    <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">{ambition.ambitionDefinition || "A clear destination. Keep momentum, complete key work, and turn this ambition into a measurable outcome."}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <AmbitionPriorityBadge ambitionPriority={ambition.ambitionPriority!} />
                    <Badge variant="outline">
                      <CheckCircle2Icon className="size-3.5" />
                      {completedItems}/{trackedItems.length || 0} completed
                    </Badge>
                    <AmbitionStatusBadge ambitionStatus={ambition.ambitionStatus} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">Ambition progress</p>
                  <p className="text-sm font-semibold tabular-nums">{progress}%</p>
                </div>
                <Progress value={progress} className="h-1" />

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <QuickStatCard icon={<CalendarDaysIcon className="size-4" />} label="Start" value={formatDate(ambition.ambitionStartDate)} helper={`${activeDays} day window`} />
                  <QuickStatCard icon={<FlagIcon className="size-4" />} label="Target" value={formatDate(ambition.ambitionEndDate)} helper={daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`} />
                  <QuickStatCard
                    icon={<CalendarClockIcon className="size-4" />}
                    label="Completion"
                    value={ambition.ambitionCompletionDate ? formatDate(ambition.ambitionCompletionDate) : "In progress"}
                    helper={ambition.ambitionCompletionDate ? "Completed date" : "Not completed yet"}
                  />
                  <QuickStatCard icon={<CheckCircle2Icon className="size-4" />} label="Tracking" value={`${trackedItems.length}`} helper={ambition.ambitionTrackingMethod === "task" ? "tasks attached" : "milestones attached"} />
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
          <AmbitionDetailsSection user={userDetails} ambition={ambition} tasks={tasks} milestones={milestones} notes={notes} />
        </MotionWrapper>

        <AmbitionDialogs {...props} milestones={milestones} ambition={ambition} />
      </div>
    </section>
  );
}

function QuickStatCard(props: { icon: ReactNode; label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/75 p-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        {props.icon}
        <p className="text-xs font-medium uppercase tracking-wide">{props.label}</p>
      </div>
      <p className="line-clamp-1 text-base font-semibold sm:text-lg">{props.value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{props.helper}</p>
    </div>
  );
}

function formatDate(dateValue: Date | string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateValue));
}

function getDaysBetween(startDate: Date | string, endDate: Date | string) {
  const dayInMs = 1000 * 60 * 60 * 24;
  const from = new Date(startDate);
  const to = new Date(endDate);
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  return Math.ceil((to.getTime() - from.getTime()) / dayInMs);
}

async function AmbitionDialogs(props: AmbitionDetailsPageProps & { milestones: Milestone[]; ambition: Ambition }) {
  const { ambitionId } = await props.params;
  const { mark_milestone_as_completed } = await props.searchParams;

  // MARK MILESTONE AS COMPLETED DIALOG
  const concernedMilestone = props.milestones.find((milestone: Milestone) => milestone.id === mark_milestone_as_completed);
  if (!concernedMilestone) return null;

  const milestoneTargetDate = new Date(concernedMilestone.milestoneTargetDate);
  const today = new Date();
  milestoneTargetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (milestoneTargetDate >= today) return null;

  if (mark_milestone_as_completed && !concernedMilestone.milestoneCompleted) {
    return <MarkMilestoneAsCompletedDialog ambitionId={ambitionId} />;
  }
}
