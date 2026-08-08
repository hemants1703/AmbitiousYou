"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as Select from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate, toDateInputValue, toSelectedDate } from "@/lib/(app)/tracked-item";
import { useCloseOnActivityHide } from "@/lib/(app)/use-close-on-activity-hide";
import { updateAmbitionAction } from "@/lib/actions/(app)/ambitions/update-ambition";
import { updateAmbitionInitialState } from "@/lib/actions/(app)/ambitions/update-ambition-state";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CircleHelpIcon, Loader2Icon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type ComponentProps, type FormEvent, type MouseEvent } from "react";

const AMBITION_NAME_MAX_LENGTH = 80;

type Priority = "low" | "medium" | "high";

interface EditAmbitionFormProps {
  ambitionId: string;
  ambitionName: string;
  ambitionDefinition: string;
  ambitionMotivation: string;
  ambitionPriority: Priority;
  isFavourited: boolean;
  ambitionStartDate: string;
  ambitionEndDate: string;
  endDateExtensionCount: number;
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
  const formRef = useRef<HTMLFormElement>(null);
  const skipExtendConfirmRef = useRef(false);
  const [state, formAction, isPending] = useActionState(updateAmbitionAction, updateAmbitionInitialState);

  const originalEndDate = toDateInputValue(new Date(props.ambitionEndDate));
  const minEndDate = toSelectedDate(originalEndDate);

  const [ambitionName, setAmbitionName] = useState(props.ambitionName);
  const [ambitionDefinition, setAmbitionDefinition] = useState(props.ambitionDefinition);
  const [ambitionMotivation, setAmbitionMotivation] = useState(props.ambitionMotivation);
  const [priority, setPriority] = useState<Priority>(props.ambitionPriority);
  const [endDate, setEndDate] = useState(originalEndDate);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [confirmExtendOpen, setConfirmExtendOpen] = useState(false);

  const isEndDateExtended = endDate > originalEndDate;
  const isDirty =
    ambitionName.trim() !== props.ambitionName.trim() ||
    ambitionDefinition.trim() !== props.ambitionDefinition.trim() ||
    ambitionMotivation.trim() !== props.ambitionMotivation.trim() ||
    priority !== props.ambitionPriority ||
    endDate !== originalEndDate;

  useCloseOnActivityHide(() => {
    setEndDateOpen(false);
    setConfirmExtendOpen(false);
  });

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (isEndDateExtended && !skipExtendConfirmRef.current) {
      event.preventDefault();
      setConfirmExtendOpen(true);
      return;
    }

    skipExtendConfirmRef.current = false;
  };

  const handleConfirmExtend = () => {
    skipExtendConfirmRef.current = true;
    setConfirmExtendOpen(false);
    // Defer so the dialog can close before the form posts.
    queueMicrotask(() => {
      formRef.current?.requestSubmit();
    });
  };

  const selectedEndDate = toSelectedDate(endDate);
  const endDateIso = selectedEndDate?.toISOString() ?? props.ambitionEndDate;

  return (
    <>
      <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-6">
        <input name="ambitionId" type="hidden" value={props.ambitionId} />
        <input name="ambitionPriority" type="hidden" value={priority} />
        <input name="isFavourited" type="hidden" value={props.isFavourited ? "true" : "false"} />
        <input name="ambitionStartDate" type="hidden" value={props.ambitionStartDate} />
        <input name="ambitionEndDate" type="hidden" value={endDateIso} />
        <input name="originalAmbitionEndDate" type="hidden" value={props.ambitionEndDate} />

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
            <FieldLabel htmlFor="ambitionEndDatePicker" tooltip="You can push the end date later, but never earlier. Once saved, the previous end date is locked.">
              End date
            </FieldLabel>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <Button id="ambitionEndDatePicker" type="button" variant="outline" className="w-full justify-start px-3 font-normal">
                  <CalendarIcon className="size-4" />
                  {selectedEndDate ? format(selectedEndDate, "LLL dd, y") : <span>Pick an end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  defaultMonth={selectedEndDate ?? minEndDate}
                  selected={selectedEndDate}
                  onSelect={(selected) => {
                    if (!selected) {
                      return;
                    }
                    setEndDate(toDateInputValue(selected));
                    setEndDateOpen(false);
                  }}
                  disabled={minEndDate ? { before: minEndDate } : undefined}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Currently ends {formatDate(props.ambitionEndDate)}. You can only move this later — after you save a later date, you won&rsquo;t be able to go back.
              {props.endDateExtensionCount > 0 ? (
                <>
                  {" "}
                  Extended {props.endDateExtensionCount} {props.endDateExtensionCount === 1 ? "time" : "times"} so far — see the log beside this form.
                </>
              ) : null}
            </p>
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="ambitionDefinition" tooltip="Optional context that explains the why behind the goal.">
              Definition
            </FieldLabel>
            <Textarea id="ambitionDefinition" name="ambitionDefinition" value={ambitionDefinition} onChange={(event) => setAmbitionDefinition(event.target.value)} placeholder="What does success look like? (Optional field)" rows={5} spellCheck />
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="ambitionMotivation" tooltip="Captured while your motivation is highest — we resurface it when you start slipping.">
              My Motivation
            </FieldLabel>
            <Textarea
              id="ambitionMotivation"
              name="ambitionMotivation"
              value={ambitionMotivation}
              onChange={(event) => setAmbitionMotivation(event.target.value)}
              placeholder="e.g., I want to finally transition into a tech career and increase my income…"
              rows={4}
              spellCheck
            />
            <p className="text-xs text-muted-foreground">We&rsquo;ll remind you of this when things get tough.</p>
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

      <AlertDialog open={confirmExtendOpen} onOpenChange={setConfirmExtendOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-accent-brand/10 text-accent-brand">
              <CalendarIcon aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>Extend the end date?</AlertDialogTitle>
            <AlertDialogDescription>
              After you save, the end date moves to <span className="font-medium text-foreground">{selectedEndDate ? format(selectedEndDate, "LLL dd, y") : "the new date"}</span> and can
              only move further ahead — you won&rsquo;t be able to return to {formatDate(props.ambitionEndDate)}. This will be logged as extension #
              {props.endDateExtensionCount + 1}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExtend}>Yes, extend end date</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
