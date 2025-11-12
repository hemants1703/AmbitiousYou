import * as Card from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Ambition, Milestone, Task } from "@/db/schema";
import { IconCalendar, IconCheck, IconFlag } from "@tabler/icons-react";
import { format } from "date-fns";
import AmbitionTasksContainer from "./AmbitionTasksContainer";
import AmbitionMilestonesContainer from "./AmbitionMilestonesContainer";
import { User } from "better-auth";

interface AmbitionDetailsSectionProps {
  user: User;
  ambition: Ambition;
  tasks: Task[];
  milestones: Milestone[];
}

export default function AmbitionDetailsSection(props: AmbitionDetailsSectionProps) {
  let ambitionTrackingMethod = props.ambition.ambitionTrackingMethod;
  let completedTasks = 0;
  let completedMilestones = 0;

  if (ambitionTrackingMethod === "task") {
    completedTasks = props.tasks.filter(t => t.taskCompleted).length;
  } else if (ambitionTrackingMethod === "milestone") {
    completedMilestones = props.milestones.filter(m => m.milestoneCompleted).length;
  }

  const progressPercentage = (completedTasks + completedMilestones) / (props.tasks.length + props.milestones.length) * 100

  return (
    <>
      {/* Ambition Overview Card - Static content */}
      <div className="w-full flex flex-col md:flex-row gap-5">
        <div className="flex-1">
          <Card.Card>
            <Card.CardHeader>
              <Card.CardTitle>Ambition Overview</Card.CardTitle>
              <Card.CardDescription>{props.ambition.ambitionDefinition}</Card.CardDescription>
            </Card.CardHeader>
            <Card.CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">
                    {progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center shrink-0">
                    <IconCalendar className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {format(new Date(props.ambition.ambitionStartDate), "MMM d, yyyy")}
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
                      {format(new Date(props.ambition.ambitionEndDate), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md bg-green-500/20 flex items-center justify-center shrink-0">
                    <IconCheck className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {props.ambition.ambitionTrackingMethod === "task" ? "Task" : "Milestone"}{" "}
                      Completion
                    </p>
                    <p className="font-medium">
                      {props.ambition.ambitionTrackingMethod === "task" ? (
                        <>
                          {completedTasks}/{props.tasks.length} tasks completed
                        </>
                      ) : (
                        <>
                          {completedMilestones}/{props.milestones.length} milestones completed
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
                        className={`h-2 w-2 rounded-md ${props.ambition.ambitionStatus === "active" ? "bg-green-500 animate-pulse" : "bg-amber-500"}`}
                      ></span>
                      {props.ambition.ambitionStatus}
                    </p>
                  </div>
                </div>
              </div>
            </Card.CardContent>
          </Card.Card>
        </div>
      </div>

      {/* Tasks or Milestones - Static content with interactive elements */}
      {props.ambition.ambitionTrackingMethod === "task" ? (
        <AmbitionTasksContainer ambition={props.ambition} tasks={props.tasks} />
      ) : (
        <AmbitionMilestonesContainer ambition={props.ambition} milestones={props.milestones} />
      )}
    </>
  );
}
