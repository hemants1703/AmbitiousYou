import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Ambition, Task } from "@/db/schema";
import { cn } from "@/lib/utils";
import { IconCalendar, IconFilePencilFilled } from "@tabler/icons-react";
import { format } from "date-fns";
import React from "react";
import CreateNewTaskDialog from "./CreateNewTask/CreateNewTaskDialog";
import EditTaskCard from "./MutateTask/EditTaskCard";
import TaskToggler from "./TaskToggler";

interface AmbitionTasksContainerProps {
  ambition: Ambition;
  tasks: Task[];
}

export default async function AmbitionTasksContainer(props: AmbitionTasksContainerProps) {
  const tasksSortedByDeadline = props.tasks.sort(
    (a, b) => (a.taskDeadline?.getTime() ?? 0) - (b.taskDeadline?.getTime() ?? 0)
  );

  return (
    <Card.Card>
      <Card.CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Card.CardTitle>All Tasks</Card.CardTitle>
            <Card.CardDescription>Manage tasks for this ambition</Card.CardDescription>
          </div>
          <div className="flex gap-2">
            <CreateNewTaskDialog
              ambitionId={props.ambition.id}
              ambitionStartDate={props.ambition.ambitionStartDate.toISOString()}
              ambitionEndDate={props.ambition.ambitionEndDate.toISOString()}
              ambitionColor={props.ambition.ambitionColor}
            />
          </div>
        </div>
      </Card.CardHeader>
      <Card.CardContent>
        <div className="space-y-2">
          {tasksSortedByDeadline.map((task) => (
            <div
              key={task.id}
              style={
                {
                  "--ambition-color": props.ambition.ambitionColor,
                } as React.CSSProperties
              }
              className={cn(
                `flex flex-col items-start  p-2 border rounded-md border-(--ambition-color) bg-(--ambition-color)/10 hover:bg-(--ambition-color)/20  transition-colors duration-75 ease-in-out`,

                // Background color based on task completion status
                task.taskCompleted
                  ? "bg-green-500/10"
                  : props.ambition.ambitionStatus === "missed"
                    ? "bg-amber-500/10"
                    : "",

                // Border color based on task completion status
                task.taskCompleted
                  ? "border-green-500"
                  : props.ambition.ambitionStatus === "missed"
                    ? "border-amber-500"
                    : ""
              )}
            >
              <div className="flex items-start gap-3 flex-1">
                {props.ambition.ambitionStatus !== "missed" && (
                  <TaskToggler task={task} ambitionId={props.ambition.id} />
                )}
                <div className="flex flex-col w-full">
                  <span className={task.taskCompleted ? "line-through text-muted-foreground" : ""}>
                    {task.task}
                  </span>
                  {task.taskDescription && (
                    <span
                      className={cn(
                        "text-sm text-muted-foreground whitespace-pre-wrap",
                        task.taskCompleted ? "line-through" : ""
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm text-muted-foreground whitespace-pre-wrap",
                          task.taskCompleted ? "line-through" : ""
                        )}
                      >
                        {task.taskDescription}
                      </span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center self-end gap-4">
                <div className="text-sm text-muted-foreground">
                  <IconCalendar className="size-4 inline mr-1" />
                  <span>Due {format(new Date(task.taskDeadline), "MMM d")}</span>
                </div>
                {!task.taskCompleted && (
                  <EditTaskCard
                    task={task}
                    ambitionStartDate={props.ambition.ambitionStartDate.toISOString()}
                    ambitionEndDate={props.ambition.ambitionEndDate.toISOString()}
                  >
                    <Button variant="outline" size="icon" className=" size-7 p-0">
                      <IconFilePencilFilled />
                    </Button>
                  </EditTaskCard>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card.CardContent>
    </Card.Card>
  );
}
