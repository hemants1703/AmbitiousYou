"use client";

import { Button } from "@/components/ui/button";
import { Task } from "@/db/schema";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";
import { toggleTask } from "../actions";
import { useState } from "react";

interface TaskTogglerProps {
  task: Task;
  ambitionId: string;
}

export default function TaskToggler(props: TaskTogglerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleTask = async () => {
    setIsLoading(true);
    toast.promise(toggleTask(props.task.id), {
      loading: "Toggling task...",
      success: (data) => {
        return `Task "${props.task.task.length > 10 ? props.task.task.substring(0, 10) + "..." : props.task.task}" toggled successfully`;
      },
      error: (error) => error,
    });
    setIsLoading(false);
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
      disabled={isLoading}
    >
      {props.task.taskCompleted && (
        <IconCheck
          className={cn(
            "h-3 w-3 text-primary-foreground",
            props.task.taskCompleted ? "text-green-500" : "text-gray-200"
          )}
          strokeWidth={4}
        />
      )}
    </Button>
  );
}
