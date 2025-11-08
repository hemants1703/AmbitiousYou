import * as Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCalendar, IconCheck, IconEdit, IconList, IconPlus } from "@tabler/icons-react";
import { format } from "date-fns";
import { Task } from "@/db/schema";

interface AmbitionTasksContainerProps {
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
            <Button variant="outline" size="tiny">
              <IconList className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button size="tiny">
              <IconPlus className="h-4 w-4 mr-2" /> New Task
            </Button>
          </div>
        </div>
      </Card.CardHeader>
      <Card.CardContent>
        <div className="space-y-3">
          {props.tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${task.taskCompleted ? "bg-primary border-primary" : "border-input"}`}
                >
                  {task.taskCompleted && <IconCheck className="h-3 w-3 text-primary-foreground" />}
                </div>
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
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <IconEdit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card.CardContent>
    </Card.Card>
  );
}
