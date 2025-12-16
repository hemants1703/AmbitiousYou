import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Ambition, Task } from "@/db/schema";
import { cn } from "@/lib/utils";
import { IconAlertCircle, IconCalendar, IconFilePencilFilled } from "@tabler/icons-react";
import { format, isAfter } from "date-fns";
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
            <TaskItem key={task.id} ambition={props.ambition} task={task} />
          ))}
        </div>
      </Card.CardContent>
    </Card.Card>
  );
}

function TaskItem(props: { ambition: Ambition; task: Task }) {
  const deadlinePassed =
    isAfter(new Date(), new Date(props.task.taskDeadline)) && !props.task.taskCompleted;

  return (
    <div
      style={
        {
          "--ambition-color": props.ambition.ambitionColor,
        } as React.CSSProperties
      }
      className={cn(
        `flex flex-col items-start  p-2 border rounded-md border-(--ambition-color) bg-(--ambition-color)/10 hover:bg-(--ambition-color)/20  transition-colors duration-75 ease-in-out`,

        // Background color based on task completion status
        props.task.taskCompleted
          ? "bg-green-500/10"
          : props.ambition.ambitionStatus === "missed"
            ? "bg-amber-500/10"
            : "",

        // Border color based on task completion status
        props.task.taskCompleted
          ? "border-green-500"
          : props.ambition.ambitionStatus === "missed"
            ? "border-amber-500"
            : "",

        deadlinePassed ? "bg-destructive/10 border-destructive/20 hover:bg-destructive/20" : ""
      )}
    >
      <div className="flex items-start gap-3 flex-1">
        {props.ambition.ambitionStatus !== "missed" && !deadlinePassed && (
          <TaskToggler task={props.task} ambitionId={props.ambition.id} />
        )}
        <div className="flex flex-col w-full">
          <span className={props.task.taskCompleted ? "line-through text-muted-foreground" : ""}>
            {props.task.task}
          </span>
          {props.task.taskDescription && (
            <span
              className={cn(
                "text-sm text-muted-foreground whitespace-pre-wrap",
                props.task.taskCompleted ? "line-through" : ""
              )}
            >
              <span
                className={cn(
                  "text-sm text-muted-foreground whitespace-pre-wrap",
                  props.task.taskCompleted ? "line-through" : ""
                )}
              >
                {props.task.taskDescription}
              </span>
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center self-end gap-4">
        {deadlinePassed ? (
          <div className="text-sm text-destructive">
            <IconAlertCircle className="size-4 inline mr-1" />
            <span>Deadline passed</span>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <IconCalendar className="size-4 inline mr-1" />
            <span>Due {format(new Date(props.task.taskDeadline), "MMM d")}</span>
          </div>
        )}
        {!props.task.taskCompleted && !deadlinePassed && (
          <EditTaskCard
            task={props.task}
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
  );
}
