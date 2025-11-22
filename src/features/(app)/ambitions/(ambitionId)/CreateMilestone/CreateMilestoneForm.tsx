"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createNewMilestone, CreateNewMilestoneActionState } from "./actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { IconCalendar, IconCirclePlus, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import * as Popover from "@/components/ui/popover";
import { format, isAfter, isBefore, startOfDay } from "date-fns";

interface CreateMilestoneFormProps {
  ambitionId: string;
  ambitionColor: string;
  ambitionStartDate: string;
  ambitionEndDate: string;
  onSuccess: () => void;
}

export default function CreateMilestoneForm(props: CreateMilestoneFormProps) {
  const [formState, setFormState] = useState<CreateNewMilestoneActionState>({
    errors: undefined,
    success: undefined,
    ambitionId: props.ambitionId as string,
    milestone: "",
    milestoneDescription: "",
    milestoneTargetDate: startOfDay(new Date(props.ambitionStartDate)),
  });

  useEffect(() => {
    setFormState({
      ...formState,
      milestoneTargetDate: startOfDay(new Date(props.ambitionStartDate)),
    });
  }, [props.ambitionStartDate, props.ambitionEndDate]);

  const [formErrors, formAction, isPending] = useActionState<
    CreateNewMilestoneActionState,
    FormData
  >(createNewMilestone, formState);

  useEffect(() => {
    if (formErrors?.errors) {
      toast.error("Error", {
        description: "Failed to create milestone",
        closeButton: true,
      });
    } else if (formErrors?.success) {
      toast.success("Success", {
        description: "Milestone created successfully",
        closeButton: true,
      });
      props.onSuccess();
    }
  }, [formErrors]);

  return (
    <form action={formAction} className="flex flex-col items-end gap-4">
      <input type="hidden" name="ambitionId" value={props.ambitionId} />

      <Input
        type="text"
        name="milestone"
        placeholder="Milestone name"
        value={formState.milestone}
        onChange={(e) => setFormState({ ...formState, milestone: e.target.value })}
      />
      <Textarea
        name="milestoneDescription"
        placeholder="Milestone description"
        value={formState.milestoneDescription ?? ""}
        className="max-h-36 overflow-y-auto"
        onChange={(e) => setFormState({ ...formState, milestoneDescription: e.target.value })}
      />

      <Popover.Popover>
        <Popover.PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <IconCalendar className="mr-2 h-4 w-4" />
            {formState.milestoneTargetDate ? (
              format(formState.milestoneTargetDate, "PPP")
            ) : (
              <span>Select a target date</span>
            )}
          </Button>
        </Popover.PopoverTrigger>
        <Popover.PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={formState.milestoneTargetDate || undefined}
            onSelect={(date) => date && setFormState({ ...formState, milestoneTargetDate: date })}
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
            initialFocus
            className="w-full"
          />
        </Popover.PopoverContent>
      </Popover.Popover>

      <Button
        type="submit"
        disabled={isPending}
        size="tiny"
        className="text-shadow-md dark:text-white hover:brightness-110"
        style={{ backgroundColor: props.ambitionColor }}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <IconLoader2 />
            Creating Milestone...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <IconCirclePlus />
            Create Milestone
          </span>
        )}
      </Button>
    </form>
  );
}
