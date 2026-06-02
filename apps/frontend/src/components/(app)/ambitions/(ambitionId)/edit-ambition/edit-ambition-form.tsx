"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { updateAmbitionAction } from "@/lib/actions/(app)/ambitions/update-ambition";
import { updateAmbitionInitialState } from "@/lib/actions/(app)/ambitions/update-ambition-state";
import { cn } from "@/lib/utils";
import { CircleHelpIcon, Loader2Icon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState, type ComponentProps, type MouseEvent } from "react";

const AMBITION_NAME_MAX_LENGTH = 80;

type Priority = "low" | "medium" | "high";

interface EditAmbitionFormProps {
  ambitionId: string;
  ambitionName: string;
  ambitionDefinition: string;
  ambitionPriority: Priority;
  isFavourited: boolean;
  ambitionTrackingMethod: "task" | "milestone";
  ambitionStartDate: string;
  ambitionEndDate: string;
}

type FieldLabelProps = Omit<ComponentProps<typeof Label>, "children"> & {
  children: string;
  tooltip: string;
};

function FieldLabel({ children, tooltip, className, ...props }: FieldLabelProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Label className={cn("text-sm font-medium", className)} {...props}>
        {children}
      </Label>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`${children} help`}
            className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <CircleHelpIcon className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export default function EditAmbitionForm(props: EditAmbitionFormProps) {
  const [state, formAction, isPending] = useActionState(updateAmbitionAction, updateAmbitionInitialState);

  const [ambitionName, setAmbitionName] = useState(props.ambitionName);
  const [ambitionDefinition, setAmbitionDefinition] = useState(props.ambitionDefinition);
  const [priority, setPriority] = useState<Priority>(props.ambitionPriority);

  const isDirty = ambitionName.trim() !== props.ambitionName.trim() || ambitionDefinition.trim() !== props.ambitionDefinition.trim() || priority !== props.ambitionPriority;

  // Warn before a hard navigation (refresh, tab close) while there are unsaved edits.
  useEffect(() => {
    if (!isDirty || isPending) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isPending]);

  // Guard in-app navigation (the Cancel link) while keeping modifier-clicks working.
  const handleCancel = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isDirty || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    if (!window.confirm("Discard your unsaved changes?")) {
      event.preventDefault();
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      <input name="ambitionId" type="hidden" value={props.ambitionId} />
      <input name="ambitionPriority" type="hidden" value={priority} />
      <input name="isFavourited" type="hidden" value={props.isFavourited ? "true" : "false"} />
      <input name="ambitionTrackingMethod" type="hidden" value={props.ambitionTrackingMethod} />
      <input name="ambitionStartDate" type="hidden" value={props.ambitionStartDate} />
      <input name="ambitionEndDate" type="hidden" value={props.ambitionEndDate} />

      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor="ambitionName" tooltip="Use a short, outcome-focused title. This is what appears in your lists and cards.">
                Ambition name
              </FieldLabel>
              {ambitionName.length >= AMBITION_NAME_MAX_LENGTH - 20 ? (
                <span className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
                  {ambitionName.length}/{AMBITION_NAME_MAX_LENGTH}
                </span>
              ) : null}
            </div>
            <Input
              id="ambitionName"
              name="ambitionName"
              value={ambitionName}
              onChange={(event) => setAmbitionName(event.target.value)}
              placeholder="Launch a focused morning routine…"
              autoComplete="off"
              spellCheck={false}
              maxLength={AMBITION_NAME_MAX_LENGTH}
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="ambitionPriority" tooltip="Set how this ambition should be prioritized relative to your other goals.">
              Priority
            </FieldLabel>
            <Select.Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
              <Select.SelectTrigger id="ambitionPriority" aria-label="Priority" className="w-full">
                <Select.SelectValue placeholder="Priority" />
              </Select.SelectTrigger>
              <Select.SelectContent>
                <Select.SelectGroup>
                  <Select.SelectItem value="low">Low</Select.SelectItem>
                  <Select.SelectItem value="medium">Medium</Select.SelectItem>
                  <Select.SelectItem value="high">High</Select.SelectItem>
                </Select.SelectGroup>
              </Select.SelectContent>
            </Select.Select>
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="ambitionDefinition" tooltip="Optional context that explains the why behind the goal.">
            Definition
          </FieldLabel>
          <Textarea id="ambitionDefinition" name="ambitionDefinition" value={ambitionDefinition} onChange={(event) => setAmbitionDefinition(event.target.value)} placeholder="What does success look like? (Optional field)" rows={5} spellCheck />
        </div>
      </section>

      {state.error ? (
        <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button asChild variant="ghost" className="w-full sm:w-auto">
          <Link href={`/ambitions/${props.ambitionId}`} onClick={handleCancel}>
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Saving changes…
            </>
          ) : (
            <>
              <SaveIcon className="size-4" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
