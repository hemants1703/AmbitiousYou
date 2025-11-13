import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Ambition, Task } from "@/db/schema";
import { IconCalendar, IconCheck, IconEdit, IconPlus } from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";
import TaskToggler from "./TaskToggler";

interface AmbitionTasksContainerProps {
  ambition: Ambition;
  tasks: Task[];
}

export default async function AmbitionTasksContainer(props: AmbitionTasksContainerProps) {
  return (
    <Card.Card>
      <Card.CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Card.CardTitle>All Tasks</Card.CardTitle>
            <Card.CardDescription>Manage tasks for this ambition</Card.CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="tiny"
              className="text-shadow-md dark:text-white"
              style={{
                backgroundColor: props.ambition.ambitionColor,
              }}
            >
              <IconPlus /> Add Task
            </Button>
          </div>
        </div>
      </Card.CardHeader>
      <Card.CardContent>
        <div className="space-y-3">
          {props.tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <TaskToggler task={task} ambitionId={props.ambition.id} />
                <div className="flex flex-col">
                  <span className={task.taskCompleted ? "line-through text-muted-foreground" : ""}>
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
                {!task.taskCompleted && (
                  <Button variant="outline" size="icon" className="rounded-full size-8 p-0">
                    <Link
                      href={`/ambitions/${props.ambition.id}?edit_task=${task.id}`}
                      prefetch={true}
                    >
                      <IconEdit />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card.CardContent>
    </Card.Card>
  );
}
