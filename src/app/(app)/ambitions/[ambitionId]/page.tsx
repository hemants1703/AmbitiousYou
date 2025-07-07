import { notFound } from "next/navigation";
import { IndividualAmbitionClient } from "./IndividualAmbitionClient";
import type { AmbitionTask, AmbitionMilestone } from "@/src/types";
import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Progress } from "@/src/components/ui/progress";
import { ArrowLeft, Calendar, CheckIcon, Flag, ListTodo, Plus, Edit } from "lucide-react";
import Link from "next/link";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { AmbitionColorBadge, AmbitionPriorityBadge } from "../AmbitionsClient";

interface PageProps {
  params: Promise<{
    ambitionId: string;
  }>;
}

export default async function IndividualAmbitionPage({ params }: PageProps) {
  const { ambitionId } = await params;
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/login");
  }

  // Try to fetch from Supabase first
  const { data: ambition } = await supabase
    .from("ambitions")
    .select("*")
    .eq("id", ambitionId)
    .single();

  if (!ambition) {
    notFound();
  }

  // Fetch related data from Supabase
  let tasks: AmbitionTask[] = [];
  let milestones: AmbitionMilestone[] = [];

  try {
    // Fetch tasks
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("ambitionId", ambitionId)
      .order("createdAt", { ascending: true });

    if (tasksData) {
      tasks = tasksData as AmbitionTask[];
    }

    // Fetch milestones
    const { data: milestonesData } = await supabase
      .from("milestones")
      .select("*")
      .eq("ambitionId", ambitionId)
      .order("createdAt", { ascending: true });

    if (milestonesData) {
      milestones = milestonesData as AmbitionMilestone[];
    }
  } catch (error) {
    // If fetching related data fails, use the data from test ambition
    console.error("Error fetching related data:", error);
  }

  const completedTasks = tasks.filter((t) => t.taskCompleted).length;
  const completedMilestones = milestones.filter((m) => m.milestoneCompleted).length;

  return (
    <section className="p-6 md:p-8 pt-6">
      <div className="space-y-6">
        {/* HEADER - Static content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link prefetch={true} href="/ambitions">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <AmbitionColorBadge ambitionColor={ambition.ambitionColor} index={1} width={200} />
                <AmbitionPriorityBadge ambitionPriority={ambition.ambitionPriority} />
              </div>
              <h1 className="text-3xl font-bold mt-1 flex items-center gap-1">
                {ambition.ambitionName}{" "}
                {ambition.isFavourited && <StarFilledIcon className="size-6 text-yellow-500" />}
              </h1>
            </div>
          </div>

          {/* Interactive actions - Client component */}
          <IndividualAmbitionClient
            ambitionId={ambition.id}
            userId={ambition.userId}
            isFavourited={ambition.isFavourited}
            ambitionTrackingMethod={ambition.ambitionTrackingMethod}
          />
        </div>

        {/* Ambition Overview Card - Static content */}
        <div className="w-full flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>Ambition Overview</CardTitle>
                <CardDescription>{ambition.ambitionDefinition}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">
                        {format(new Date(ambition.ambitionStartDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-medium">
                        {format(new Date(ambition.ambitionEndDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="h-4 w-4 text-green-500" />
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
                    <div className="h-8 w-8 rounded-md bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Flag className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize flex items-center gap-1">
                        <span
                          className={`h-2 w-2 rounded-md ${ambition.ambitionStatus === "active" ? "bg-green-500 animate-pulse" : "bg-amber-500"}`}
                        ></span>
                        {ambition.ambitionStatus.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tasks or Milestones - Static content with interactive elements */}
        {ambition.ambitionTrackingMethod === "task" ? (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>Manage tasks for this ambition</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ListTodo className="h-4 w-4 mr-2" /> Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" /> New Task
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                          <CheckIcon className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span
                        className={task.taskCompleted ? "line-through text-muted-foreground" : ""}
                      >
                        {task.task}
                      </span>
                      <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                        {task.taskDescription}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 inline mr-1" />
                        <span>Due {format(new Date(task.taskDeadline), "MMM d")}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Milestones Journey</CardTitle>
                  <CardDescription>Progress through key checkpoints</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Milestone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
                          <CheckIcon className="h-3 w-3 text-primary-foreground" />
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
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
