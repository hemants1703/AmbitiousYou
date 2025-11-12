import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import { Ambition, Milestone } from "@/db/schema";
import AmbitionCard from "@/features/(app)/ambitions/components/AmbitionCard";
import AmbitionFilters, {
  AmbitionFiltersState,
} from "@/features/(app)/ambitions/components/AmbitionFilters";
import confirmSession from "@/lib/auth/confirmSession";
import { AmbitionsService } from "@/services/ambitionsService";
import { IconCirclePlus2, IconFilter } from "@tabler/icons-react";
import { User } from "better-auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "All Ambitions | AmbitiousYou",
};

interface AmbitionsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AmbitionsPage(props: AmbitionsPageProps) {
  const session = await confirmSession();

  if (!session) {
    redirect("/login", RedirectType.replace);
  }

  const userData = session.user as User;

  const searchParams = await props.searchParams;

  // Fetch active ambitions
  const activeAmbitions = await AmbitionsService.fetchAmbitionsByFilters(
    searchParams as AmbitionFiltersState,
    userData.id
  );
  if (activeAmbitions instanceof Error) throw activeAmbitions;

  // Fetch tasks for ambition
  const tasks = await AmbitionsService.fetchUserTasks(userData.id);
  if (tasks instanceof Error) throw tasks;

  // Fetch milestones for ambition
  const milestones = await AmbitionsService.fetchUserMilestones(userData.id);
  if (milestones instanceof Error) throw milestones;

  return (
    <div className="flex flex-col p-6 md:p-8 pt-6 gap-6 max-sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
      <MotionWrapper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex gap-2 justify-between items-center"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
          <p className="text-muted-foreground">View and manage all your ambitions in one place</p>
        </div>
        <Button asChild size="sm" variant="ay">
          <Link
            prefetch={true}
            href={`/ambitions/new`}
            className="md:ml-0 flex justify-center items-center gap-1"
          >
            <IconCirclePlus2 className="h-4 w-4" />
            Create New Ambition
          </Link>
        </Button>
      </MotionWrapper>

      <AmbitionFilters />

      {/* Ambitions List */}
      <MotionWrapper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {activeAmbitions.length > 0 ? (
          activeAmbitions.map((ambition: Ambition, index: number) => {
            let completedTasksOrMilestones = 0;
            let totalTasksOrMilestones = 0;

            if (ambition.ambitionTrackingMethod === "task") {
              const TasksList = tasks.filter((t) => t.ambitionId === ambition.id);
              completedTasksOrMilestones = TasksList.filter((t) => t.taskCompleted).length;
              totalTasksOrMilestones = TasksList.length;
            } else if (ambition.ambitionTrackingMethod === "milestone") {
              const MilestonesList = milestones.filter(
                (m: Milestone) => m.ambitionId === ambition.id
              );
              completedTasksOrMilestones = MilestonesList.filter(
                (m: Milestone) => m.milestoneCompleted
              ).length;
              totalTasksOrMilestones = MilestonesList.length;
            }

            return (
              <MotionWrapper key={ambition.id} transition={{ duration: 0.3, delay: 0.05 * index }}>
                <Link prefetch={true} href={`/ambitions/${ambition.id}`}>
                  <AmbitionCard
                    ambition={ambition}
                    index={index}
                    completedTasksOrMilestones={completedTasksOrMilestones}
                    totalTasksOrMilestones={totalTasksOrMilestones}
                  />
                </Link>
              </MotionWrapper>
            );
          })
        ) : (
          <MotionWrapper className="col-span-full text-center py-10 text-muted-foreground">
            <IconFilter className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No ambitions match your filters</p>
          </MotionWrapper>
        )}
      </MotionWrapper>
    </div>
  );
}
