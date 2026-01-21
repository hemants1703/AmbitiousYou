import * as Card from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Ambition, Milestone, Note, Task } from "@/db/schema";
import { IconCalendar, IconCheck, IconFlag, IconInfoCircle } from "@tabler/icons-react";
import { User } from "better-auth";
import { format } from "date-fns";
import AmbitionMilestonesContainer from "../Milestones/AmbitionMilestonesContainer";
import AmbitionNotesContainer from "../Notes/AmbitionNotesContainer";
import AmbitionTasksContainer from "../Tasks/AmbitionTasksContainer";

interface AmbitionDetailsSectionProps {
  user: User;
  ambition: Ambition;
  tasks: Task[];
  milestones: Milestone[];
  notes: Note[];
}

export default function AmbitionDetailsSection(props: AmbitionDetailsSectionProps) {
  let ambitionTrackingMethod = props.ambition.ambitionTrackingMethod;
  let completedTasks = 0;
  let completedMilestones = 0;

  if (ambitionTrackingMethod === "task") {
    completedTasks = props.tasks.filter((t) => t.taskCompleted).length;
  } else if (ambitionTrackingMethod === "milestone") {
    completedMilestones = props.milestones.filter((m) => m.milestoneCompleted).length;
  }

  return (
    <>
      <div className="w-full flex flex-col md:flex-row gap-5">
        <div className="flex flex-col lg:flex-row *:flex-1 *:h-full *:w-full gap-5 w-full justify-between items-center">
          {/* Ambition Details Section Content */}
          <AmbitionDetailsSectionContent {...props} />
          <AmbitionNotesContainer notes={props.notes} ambitionId={props.ambition.id} />
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

function AmbitionDetailsSectionContent(props: AmbitionDetailsSectionProps) {
  const completedTasks = props.tasks.filter((t) => t.taskCompleted).length;
  const completedMilestones = props.milestones.filter((m) => m.milestoneCompleted).length;
  const progressPercentage =
    ((completedTasks + completedMilestones) / (props.tasks.length + props.milestones.length)) * 100;

  return (
    <Card.Card className="bg-linear-to-tl from-(--ambition-color)/10 to-transparent" style={
      { "--ambition-color": props.ambition.ambitionColor } as React.CSSProperties
    }>
      <Card.CardHeader>
        <Card.CardTitle className="flex gap-1 justify-start items-center">
          <IconInfoCircle className="text-(--ambition-color)" size="18" />
          <span className="font-black tracking-wider text-sm text-primary/85">AMBITION OVERVIEW</span>
        </Card.CardTitle>
        <Card.CardDescription>{props.ambition.ambitionDefinition}</Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1 *:bg-(--ambition-color)" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-sm bg-blue-500/20 flex items-center justify-center shrink-0">
                <IconCalendar className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {format(new Date(props.ambition.ambitionStartDate).toLocaleDateString(), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-sm bg-blue-500/20 flex items-center justify-center shrink-0">
                <IconCalendar className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-medium">
                  {format(new Date(props.ambition.ambitionEndDate).toLocaleDateString(), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-sm bg-green-500/20 flex items-center justify-center shrink-0">
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

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-sm bg-purple-500/20 flex items-center justify-center shrink-0">
                <IconFlag className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize flex items-center gap-1">
                  <span
                    className={`h-2 w-2 rounded-md ${props.ambition.ambitionStatus === "active" ? "bg-green-400 animate-pulse" : props.ambition.ambitionStatus === "completed" ? "bg-blue-500" : props.ambition.ambitionStatus === "missed" ? "bg-amber-500" : "bg-gray-200"}`}
                  ></span>
                  {props.ambition.ambitionStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card.CardContent>
    </Card.Card>
  );
}
