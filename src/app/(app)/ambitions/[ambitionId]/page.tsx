import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Ambition, Milestone, Task } from "@/db/schema";
import { AmbitionPriorityBadge } from "@/features/(app)/ambitions/components/AmbitionPriorityBadge";
import { AmbitionOptionsDropdown } from "@/features/(app)/ambitions/view/AmbitionOptionsDropdown";
import confirmSession from "@/lib/auth/confirmSession";
import { AmbitionsService } from "@/services/ambitionsService";
import { StarFilledIcon } from "@radix-ui/react-icons";
import {
  IconCalendar,
  IconCheck,
  IconChevronLeft,
  IconEdit,
  IconFlag,
  IconList,
  IconPlus,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

interface AmbitionDetailsPageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}

const getAmbitionData = cache(async (ambitionId: string): Promise<Ambition | Error> => {
  const session = await confirmSession(); // check for session if not found, redirect to login
  return await AmbitionsService.fetchAmbitionById(ambitionId, session.user.id);
});

export async function generateMetadata(props: AmbitionDetailsPageProps): Promise<Metadata> {
  const { ambitionId } = await props.params;
  const ambition: Ambition | Error = await getAmbitionData(ambitionId as string);
  if (ambition instanceof Error) throw ambition;

  return {
    title: ambition.ambitionName,
  };
}

export default async function IndividualAmbitionPage(props: AmbitionDetailsPageProps) {
  const session = await confirmSession();

  const { ambitionId } = await props.params;
  const ambition: Ambition | Error = await getAmbitionData(ambitionId as string);
  if (ambition instanceof Error) throw ambition;

  let tasks: Task[] | Error = [];
  let completedTasks: number = 0;

  let milestones: Milestone[] | Error = [];
  let completedMilestones: number = 0;

  if (ambition.ambitionTrackingMethod === "task") {
    tasks = await AmbitionsService.fetchAmbitionTasks(ambition.id, session.user.id);
    if (tasks instanceof Error) throw tasks;

    completedTasks = tasks.filter((t) => t.taskCompleted).length;
  } else if (ambition.ambitionTrackingMethod === "milestone") {
    milestones = await AmbitionsService.fetchAmbitionMilestones(ambition.id, session.user.id);
    if (milestones instanceof Error) throw milestones;

    completedMilestones = milestones.filter((m) => m.milestoneCompleted).length;
  }

  return (
    <section className={`p-6 md:p-8 pt-6 min-h-screen`}>
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        {/* HEADER - Static content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            {/* <Button variant="outline" size="icon" asChild className="bg-transparent rounded-full"> */}
            <Link prefetch={true} href="/ambitions">
              <IconChevronLeft className="size-8 bg-foreground/10 rounded-full p-2" />
            </Link>
            {/* </Button> */}
            <div>
              <h1 className="text-3xl font-bold mt-1 flex items-center gap-1">
                {ambition.ambitionName}{" "}
                {ambition.isFavourited && <StarFilledIcon className="size-6 text-yellow-500" />}
              </h1>
              <div className="flex items-center gap-2">
                <AmbitionPriorityBadge ambitionPriority={ambition.ambitionPriority!} />
              </div>
            </div>
          </div>

          {/* Interactive actions - Client component */}
          <AmbitionOptionsDropdown
            ambitionId={ambition.id}
            userId={ambition.userId}
            isFavourited={ambition.isFavourited ?? false}
          />
        </div>

        {/* Ambition Overview Card - Static content */}
        <div className="w-full flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <Card.Card>
              <Card.CardHeader>
                <Card.CardTitle>Ambition Overview</Card.CardTitle>
                <Card.CardDescription>{ambition.ambitionDefinition}</Card.CardDescription>
              </Card.CardHeader>
              <Card.CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-medium">
                      {ambition.ambitionPercentageCompleted}%
                    </span>
                  </div>
                  <Progress value={ambition.ambitionPercentageCompleted} className="h-2" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center shrink-0">
                      <IconCalendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">
                        {format(new Date(ambition.ambitionStartDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center shrink-0">
                      <IconCalendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-medium">
                        {format(new Date(ambition.ambitionEndDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-green-500/20 flex items-center justify-center shrink-0">
                      <IconCheck className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {ambition.ambitionTrackingMethod === "task" ? "Task" : "Milestone"}{" "}
                        Completion
                      </p>
                      <p className="font-medium">
                        {ambition.ambitionTrackingMethod === "task" ? (
                          <>
                            {completedTasks}/{tasks.length} tasks completed
                          </>
                        ) : (
                          <>
                            {completedMilestones}/{milestones.length} milestones completed
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-purple-500/20 flex items-center justify-center shrink-0">
                      <IconFlag className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize flex items-center gap-1">
                        <span
                          className={`h-2 w-2 rounded-md ${ambition.ambitionStatus === "active" ? "bg-green-500 animate-pulse" : "bg-amber-500"}`}
                        ></span>
                        {ambition.ambitionStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </Card.CardContent>
            </Card.Card>
          </div>
        </div>

        {/* Tasks or Milestones - Static content with interactive elements */}
        {ambition.ambitionTrackingMethod === "task" ? (
          <Card.Card>
            <Card.CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Card.CardTitle>All Tasks</Card.CardTitle>
                  <Card.CardDescription>Manage tasks for this ambition</Card.CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <IconList className="h-4 w-4 mr-2" /> Filter
                  </Button>
                  <Button size="sm">
                    <IconPlus className="h-4 w-4 mr-2" /> New Task
                  </Button>
                </div>
              </div>
            </Card.CardHeader>
            <Card.CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${task.taskCompleted ? "bg-primary border-primary" : "border-input"}`}
                      >
                        {task.taskCompleted && (
                          <IconCheck className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={task.taskCompleted ? "line-through text-muted-foreground" : ""}
                        >
                          {task.task}
                        </span>
                        <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                          {task.taskDescription}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        <IconCalendar className="h-3.5 w-3.5 inline mr-1" />
                        <span>Due {format(new Date(task.taskDeadline), "MMM d")}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <IconEdit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card.CardContent>
          </Card.Card>
        ) : (
          <Card.Card>
            <Card.CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Card.CardTitle>Milestones Journey</Card.CardTitle>
                  <Card.CardDescription>Progress through key checkpoints</Card.CardDescription>
                </div>
                <Button size="sm">
                  <IconPlus className="h-4 w-4 mr-2" /> Add Milestone
                </Button>
              </div>
            </Card.CardHeader>
            <Card.CardContent>
              <div className="relative mt-6">
                {/* Timeline line */}
                <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>

                {/* Milestones */}
                <div className="space-y-10">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="relative pl-10">
                      <div
                        className={`absolute left-0 h-5 w-5 rounded-full ${milestone.milestoneCompleted ? "bg-primary" : "bg-muted-foreground/25"} flex items-center justify-center`}
                      >
                        {milestone.milestoneCompleted && (
                          <IconCheck className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h4
                          className={`text-base font-medium ${milestone.milestoneCompleted ? "text-primary" : ""}`}
                        >
                          {milestone.milestone}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Target date:{" "}
                          {format(new Date(milestone.milestoneTargetDate), "MMMM d, yyyy")}
                        </p>
                        {milestone.milestoneCompleted ? (
                          <Badge className="w-fit mt-2 bg-green-500/10 text-green-600 border-green-500/20">
                            Completed
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm" className="w-fit mt-2">
                            Mark as Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card.CardContent>
          </Card.Card>
        )}
      </div>
    </section>
  );
}
