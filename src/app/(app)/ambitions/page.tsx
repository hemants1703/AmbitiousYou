import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import * as Tabs from "@/components/ui/tabs";
import { Ambition, Milestone, Task } from "@/db/schema";
import { AmbitionColorBadge } from "@/features/ambitions/components/AmbitionColorBadge";
import { AmbitionPriorityBadge } from "@/features/ambitions/components/AmbitionPriorityBadge";
import { AmbitionStatusBadge } from "@/features/ambitions/components/AmbitionStatusBadge";
import NoAmbitionsFound from "@/features/ambitions/components/NoAmbitionsFound";
import confirmSession from "@/lib/auth/confirmSession";
import { AmbitionsService } from "@/services/ambitionsService";
import {
  IconCalendar,
  IconChevronRight,
  IconCircleCheck,
  IconCirclePlus2,
  IconFilter,
  IconFolder,
  IconTarget,
} from "@tabler/icons-react";
import { User } from "better-auth";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Ambitions | AmbitiousYou",
};

interface AmbitionsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AmbitionsPage(props: AmbitionsPageProps) {
  const session = await confirmSession();

  const userData = session.user as User;

  // Fetch active ambitions
  const activeAmbitions = await AmbitionsService.fetchUserAmbitions(userData.id);
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
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">Your Ambitions</h1>
        <p className="text-muted-foreground">View and manage all your ambitions in one place</p>
      </MotionWrapper>

      <MotionWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
      >
        <MotionWrapper
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex gap-2 w-full md:w-auto flex-wrap"
        >
          <Button asChild size="sm">
            <Link
              prefetch={true}
              href={`/ambitions/new`}
              className="md:ml-0 flex justify-center items-center gap-1"
            >
              <IconCirclePlus2 className="h-4 w-4" />
              New Ambition
            </Link>
          </Button>
        </MotionWrapper>
      </MotionWrapper>

      <MotionWrapper
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {activeAmbitions.length > 0 ? (
          <Tabs.Tabs defaultValue="all" className="w-full">
            <Tabs.TabsList className="max-md:self-center">
              <Tabs.TabsTrigger value="all">All Ambitions</Tabs.TabsTrigger>
              <Tabs.TabsTrigger value="active">Active</Tabs.TabsTrigger>
              <Tabs.TabsTrigger value="completed">Completed</Tabs.TabsTrigger>
              <Tabs.TabsTrigger value="archive">Archive</Tabs.TabsTrigger>
            </Tabs.TabsList>

            {/* ALL AMBITIONS TAB */}
            <Tabs.TabsContent value="all">
              <MotionWrapper
                initial="hidden"
                animate="show"
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
                      <MotionWrapper
                        key={ambition.id}
                        transition={{ duration: 0.3, delay: 0.05 * index }}
                      >
                        <Link prefetch={true} href={`/ambitions/${ambition.id}`}>
                          <Card.Card
                            className={`bg-linear-to-b dark:from-slate-950 from-slate-200 to-[${ambition.ambitionColor}] cursor-pointer hover:shadow-md transition-all hover:translate-y-[-2px] duration-300`}
                          >
                            <Card.CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <AmbitionColorBadge
                                  ambitionColor={ambition.ambitionColor!}
                                  index={index}
                                  width={100}
                                />
                                <AmbitionPriorityBadge
                                  ambitionPriority={ambition.ambitionPriority!}
                                />
                              </div>
                              <Card.CardTitle className="mt-2">
                                {ambition.ambitionName}
                              </Card.CardTitle>
                              <Card.CardDescription className="line-clamp-2">
                                {ambition.ambitionDefinition || "\u00A0"}
                              </Card.CardDescription>
                            </Card.CardHeader>
                            <Card.CardContent className="pb-2">
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>Progress</span>
                                    <span>{ambition.ambitionPercentageCompleted}%</span>
                                  </div>
                                  <MotionWrapper
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                      duration: 0.5,
                                      delay: 0.3 + 0.1 * index,
                                    }}
                                  >
                                    <Progress
                                      value={ambition.ambitionPercentageCompleted}
                                      className={`h-2 [&>[data-slot=progress-indicator]]:bg-[(${ambition.ambitionColor})]`}
                                    />
                                  </MotionWrapper>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <IconCircleCheck className="h-3.5 w-3.5" />
                                    <span>
                                      {completedTasksOrMilestones}/{totalTasksOrMilestones}{" "}
                                      {ambition.ambitionTrackingMethod}s
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <IconCalendar className="h-3.5 w-3.5" />
                                    <span>
                                      Due{" "}
                                      {new Date(ambition.ambitionEndDate).toLocaleDateString(
                                        "en-US",
                                        { month: "short", day: "numeric", year: "numeric" }
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Card.CardContent>
                            <Card.CardFooter className="pt-0">
                              <div className="flex justify-between items-center w-full">
                                <AmbitionStatusBadge ambitionStatus={ambition.ambitionStatus!} />
                                <MotionWrapper whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                                  <IconChevronRight className="h-4 w-4" />
                                </MotionWrapper>
                              </div>
                            </Card.CardFooter>
                          </Card.Card>
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
            </Tabs.TabsContent>

            {/* ACTIVE AMBITIONS TAB */}
            <Tabs.TabsContent value="active">
              <MotionWrapper
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <MotionWrapper
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {activeAmbitions.length > 0 ? (
                    activeAmbitions.map((ambition: Ambition, index: number) => {
                      let completedTasksOrMilestones = 0;
                      let totalTasksOrMilestones = 0;

                      if (ambition.ambitionTrackingMethod === "task") {
                        const TasksList = tasks.filter((t: Task) => t.ambitionId === ambition.id);
                        completedTasksOrMilestones = TasksList.filter(
                          (t: Task) => t.taskCompleted
                        ).length;
                        totalTasksOrMilestones = TasksList.length;
                      } else if (ambition.ambitionTrackingMethod === "milestone") {
                        const MilestonesList = milestones.filter(
                          (m) => m.ambitionId === ambition.id
                        );
                        completedTasksOrMilestones = MilestonesList.filter(
                          (m) => m.milestoneCompleted
                        ).length;
                        totalTasksOrMilestones = MilestonesList.length;
                      }

                      return (
                        <MotionWrapper
                          key={ambition.id}
                          transition={{ duration: 0.3, delay: 0.05 * index }}
                        >
                          <Link prefetch={true} href={`/ambitions/${ambition.id}`}>
                            <Card.Card
                              className={`cursor-pointer hover:shadow-md transition-all hover:translate-y-[-2px] duration-300`}
                            >
                              <Card.CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <AmbitionColorBadge
                                    ambitionColor={ambition.ambitionColor!}
                                    index={index}
                                    width={100}
                                  />
                                  <AmbitionPriorityBadge
                                    ambitionPriority={ambition.ambitionPriority!}
                                  />
                                </div>
                                <Card.CardTitle className="mt-2">
                                  {ambition.ambitionName}
                                </Card.CardTitle>
                                <Card.CardDescription className="line-clamp-2">
                                  {ambition.ambitionDefinition || "\u00A0"}
                                </Card.CardDescription>
                              </Card.CardHeader>
                              <Card.CardContent className="pb-2">
                                <div className="space-y-4">
                                  <div>
                                    <div className="flex justify-between mb-1 text-sm">
                                      <span>Progress</span>
                                      <span>{ambition.ambitionPercentageCompleted}%</span>
                                    </div>
                                    <MotionWrapper
                                      initial={{ width: 0 }}
                                      animate={{ width: "100%" }}
                                      transition={{
                                        duration: 0.5,
                                        delay: 0.3 + 0.1 * index,
                                      }}
                                    >
                                      <Progress
                                        value={ambition.ambitionPercentageCompleted}
                                        className="h-2"
                                      />
                                    </MotionWrapper>
                                  </div>
                                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <IconCircleCheck className="h-3.5 w-3.5" />
                                      <span>
                                        {completedTasksOrMilestones}/{totalTasksOrMilestones}{" "}
                                        {ambition.ambitionTrackingMethod}s
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <IconCalendar className="h-3.5 w-3.5" />
                                      <span>
                                        Due{" "}
                                        {new Date(ambition.ambitionEndDate).toLocaleDateString(
                                          "en-US",
                                          { month: "short", day: "numeric", year: "numeric" }
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Card.CardContent>
                              <Card.CardFooter className="pt-0">
                                <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                                  <AmbitionStatusBadge ambitionStatus={ambition.ambitionStatus!} />
                                  <MotionWrapper
                                    whileHover={{ x: 3 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <IconChevronRight className="h-4 w-4" />
                                  </MotionWrapper>
                                </div>
                              </Card.CardFooter>
                            </Card.Card>
                          </Link>
                        </MotionWrapper>
                      );
                    })
                  ) : (
                    <>
                      <IconTarget className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Active ambitions will appear here</p>
                    </>
                  )}
                </MotionWrapper>
              </MotionWrapper>
            </Tabs.TabsContent>

            {/* COMPLETED AMBITIONS TAB */}
            <Tabs.TabsContent value="completed">
              <MotionWrapper
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-10 text-muted-foreground"
              >
                <MotionWrapper
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <IconCircleCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Completed ambitions will appear here</p>
                </MotionWrapper>
              </MotionWrapper>
            </Tabs.TabsContent>

            {/* ARCHIVED AMBITIONS TAB */}
            <Tabs.TabsContent value="archive">
              <MotionWrapper
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-10 text-muted-foreground"
              >
                <MotionWrapper
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <IconFolder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Archived ambitions will appear here</p>
                </MotionWrapper>
              </MotionWrapper>
            </Tabs.TabsContent>
          </Tabs.Tabs>
        ) : (
          <NoAmbitionsFound />
        )}
      </MotionWrapper>
    </div>
  );
}
