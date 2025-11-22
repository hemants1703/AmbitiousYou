"use client";

import { useActionState, useEffect, useState } from "react";
import { CreateNewTaskFormActionState } from "./actions";
import { createNewTask } from "./actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { startOfDay, isBefore, isAfter, format } from "date-fns";
import { IconCalendar, IconLoader2, IconCirclePlus } from "@tabler/icons-react";
import * as Popover from "@/components/ui/popover";

interface CreateNewTaskFormProps {
  ambitionId: string;
  ambitionStartDate: string;
  ambitionEndDate: string;
  ambitionColor: string;
  onSuccess: () => void;
}

export default function CreateNewTaskForm(props: CreateNewTaskFormProps) {
  const [formState, setFormState] = useState<CreateNewTaskFormActionState>({
    ambitionId: props.ambitionId as string,
    task: "",
    taskDescription: "",
    taskDeadline: new Date(),
  });
  const [formErrors, formAction, isPending] = useActionState<
    CreateNewTaskFormActionState,
    FormData
  >(createNewTask, formState);

  useEffect(() => {
    if (formErrors?.errors) {
      toast.error("Error", {
        description: formErrors.errors.general.join(", "),
        closeButton: true,
      });
    } else if (formErrors?.success) {
      toast.success("Success", {
        description: "Task created successfully",
        closeButton: true,
      });
      props.onSuccess();
    }
  }, [formErrors]);
  return (
    <form action={formAction} className="flex flex-col items-end gap-4">
      <input type="hidden" name="ambitionId" value={props.ambitionId} />

      <Input
        name="task"
        placeholder="Enter your task here..."
        value={formState.task}
        onChange={(e) => setFormState({ ...formState, task: e.target.value })}
      />

      <Textarea
        name="taskDescription"
        placeholder="Enter your task description here..."
        value={formState.taskDescription ?? ""}
        className="max-h-36"
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
            selected={formState.taskDeadline || undefined}
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

      <Button
        type="submit"
        disabled={isPending}
        style={{
          backgroundColor: props.ambitionColor,
        }}
        size="tiny"
        className="text-shadow-md dark:text-white hover:brightness-110"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <IconLoader2 />
            Creating task...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <IconCirclePlus />
            Create task
          </span>
        )}
      </Button>
    </form>
  );
}
