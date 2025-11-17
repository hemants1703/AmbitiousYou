"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import * as Popover from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/db/schema";
import { IconCalendar, IconFilePencilFilled, IconLoader2 } from "@tabler/icons-react";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { editTask, EditTaskFormActionState } from "./actions";

interface EditTaskFormProps {
  task: Task;
  ambitionStartDate: string;
  ambitionEndDate: string;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EditTaskForm(props: EditTaskFormProps) {
  const [formState, setFormState] = useState<EditTaskFormActionState>({
    id: props.task.id,
    ambitionId: props.task.ambitionId,
    task: props.task.task ?? "",
    taskDescription: props.task.taskDescription ?? null,
    taskDeadline: props.task.taskDeadline ? new Date(props.task.taskDeadline) : undefined,
  });
  const [formErrors, formAction, isPending] = useActionState<EditTaskFormActionState, FormData>(
    editTask,
    formState
  );

  useEffect(() => {
    if (formErrors?.errors) {
      toast.error("Error", {
        description: Object.values(formErrors.errors).flat().join(", "),
        closeButton: true,
      });
    } else if (formErrors?.success) {
      toast.success("Success", {
        description: "Task updated successfully",
        closeButton: true,
      });
      props.setIsOpen(false);
    }
  }, [formErrors]);

  return (
    <form action={formAction} className="flex flex-col items-end gap-4">
      <input type="hidden" name="id" value={formState.id} />
      <input type="hidden" name="ambitionId" value={formState.ambitionId} />
      <input
        type="hidden"
        name="taskDeadline"
        value={formState.taskDeadline ? formState.taskDeadline.toISOString() : ""}
      />

      <Input
        type="text"
        name="task"
        placeholder="Enter your task here..."
        value={formState.task}
        onChange={(e) => setFormState({ ...formState, task: e.target.value })}
      />
      <Textarea
        name="taskDescription"
        placeholder="Enter your task description here..."
        value={formState.taskDescription ?? ""}
        onChange={(e) => setFormState({ ...formState, taskDescription: e.target.value })}
      />
      <Popover.Popover>
        <Popover.PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <IconCalendar className="mr-2 h-4 w-4" />
            {formState.taskDeadline ? (
              format(formState.taskDeadline, "PPP")
            ) : (
              <span>Select a deadline</span>
            )}
          </Button>
        </Popover.PopoverTrigger>
        <Popover.PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={formState.taskDeadline}
            onSelect={(date) => date && setFormState({ ...formState, taskDeadline: date })}
            disabled={(calendarDate) => {
              const today = startOfDay(new Date(props.ambitionStartDate));
              const startDate = startOfDay(new Date(props.ambitionStartDate));
              const endDate = startOfDay(new Date(props.ambitionEndDate));
              const checkDate = startOfDay(calendarDate);

              // Disable dates before today
              if (isBefore(checkDate, today)) {
                return true;
              }

              // Disable dates before ambition start date
              if (isBefore(checkDate, startDate)) {
                return true;
              }

              // Disable dates after ambition end date
              if (isAfter(checkDate, endDate)) {
                return true;
              }

              return false;
            }}
            className="w-full"
          />
        </Popover.PopoverContent>
      </Popover.Popover>

      <Button type="submit" size="tiny" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center gap-2">
            <IconLoader2 className="animate-spin" />
            Updating Task...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <IconFilePencilFilled className="size-4" />
            Update Task
          </span>
        )}
      </Button>
    </form>
  );
}
