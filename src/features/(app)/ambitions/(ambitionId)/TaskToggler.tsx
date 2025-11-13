"use client";

import { Button } from "@/components/ui/button";
import { Task } from "@/db/schema";
import { IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";
import { toggleTask } from "../actions";

interface TaskTogglerProps {
  task: Task;
  ambitionId: string;
}

export default function TaskToggler(props: TaskTogglerProps) {
  const handleToggleTask = async () => {
    toast.promise(toggleTask(props.task.id), {
      loading: "Toggling task...",
      success: (data) => {
        return `Task "${props.task.task.length > 10 ? props.task.task.substring(0, 10) + "..." : props.task.task}" toggled successfully`;
      },
      error: (error) => error,
    });
  };

  return (
    <Button
      size="icon"
      variant="outline"
      className={`h-5 w-5 cursor-pointer rounded-full border flex items-center justify-center ${props.task.taskCompleted ? "bg-primary border-primary" : "border-input"}`}
      style={{
        backgroundColor: props.task.taskCompleted ? "var(--color-primary)" : "var(--color-input)",
        borderColor: props.task.taskCompleted ? "var(--color-primary)" : "var(--color-input)",
      }}
      onClick={handleToggleTask}
    >
      {props.task.taskCompleted && <IconCheck className="h-3 w-3 text-primary-foreground" />}
    </Button>
  );
}
