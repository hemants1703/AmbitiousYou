"use client";

import { createAmbitionAction } from "@/actions/(app)/ambitions/create-ambition";
import { createAmbitionInitialState } from "@/actions/(app)/ambitions/create-ambition-state";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as Select from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CalendarIcon, CircleHelpIcon, FlameIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useActionState, useState, type ComponentProps, type ReactNode } from "react";
import type { DateRange } from "react-day-picker";
import { format, parseISO } from "date-fns";

type TrackingMethod = "task" | "milestone";
type Priority = "low" | "medium" | "high";

type TaskDraft = {
  id: string;
  task: string;
  taskDescription: string;
  taskDeadline: string;
};

type MilestoneDraft = {
  id: string;
  milestone: string;
  milestoneDescription: string;
  milestoneTargetDate: string;
};

type FieldLabelProps = Omit<ComponentProps<typeof Label>, "children"> & {
  children: string;
  tooltip: string;
};

type SectionHeadingProps = {
  title: string;
  tooltip: string;
  action?: ReactNode;
};

function createTaskDraft(): TaskDraft {
  return {
    id: crypto.randomUUID(),
    task: "",
    taskDescription: "",
    taskDeadline: "",
  };
}

function createMilestoneDraft(): MilestoneDraft {
  return {
    id: crypto.randomUUID(),
    milestone: "",
    milestoneDescription: "",
    milestoneTargetDate: "",
  };
}

function toDateInputValue(date: Date): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function toSelectedDate(dateValue: string): Date | undefined {
  return dateValue ? parseISO(dateValue) : undefined;
}

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

function SectionHeading({ title, tooltip, action }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`${title} help`}
              className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <CircleHelpIcon className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export default function CreateAmbitionForm() {
  const [state, formAction, isPending] = useActionState(createAmbitionAction, createAmbitionInitialState);
  const [ambitionName, setAmbitionName] = useState("");
  const [ambitionDefinition, setAmbitionDefinition] = useState("");
  const [trackingMethod, setTrackingMethod] = useState<TrackingMethod>("task");
  const [priority, setPriority] = useState<Priority>("medium");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tasks, setTasks] = useState<TaskDraft[]>([createTaskDraft()]);
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([createMilestoneDraft()]);

  const updateTask = (id: string, field: keyof Omit<TaskDraft, "id">, value: string) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, [field]: value } : task)));
  };

  const updateMilestone = (id: string, field: keyof Omit<MilestoneDraft, "id">, value: string) => {
    setMilestones((current) => current.map((milestone) => (milestone.id === id ? { ...milestone, [field]: value } : milestone)));
  };

  const removeTask = (id: string) => {
    setTasks((current) => (current.length > 1 ? current.filter((task) => task.id !== id) : current));
  };

  const removeMilestone = (id: string) => {
    setMilestones((current) => (current.length > 1 ? current.filter((milestone) => milestone.id !== id) : current));
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);

    if (!range?.from) {
      return;
    }

    setStartDate(toDateInputValue(range.from));
    setEndDate(toDateInputValue(range.to ?? range.from));
  };

  return (
    <div className="mx-auto w-full">
      <form action={formAction} className="space-y-6">
        <input name="ambitionTrackingMethod" type="hidden" value={trackingMethod} />
        <input name="ambitionPriority" type="hidden" value={priority} />
        <input name="ambitionStartDate" type="hidden" value={startDate} />
        <input name="ambitionEndDate" type="hidden" value={endDate} />

        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel htmlFor="ambitionName" tooltip="Use a short outcome-focused title. This is what appears in lists and cards.">
                Ambition name
              </FieldLabel>
              <Input id="ambitionName" name="ambitionName" value={ambitionName} onChange={(event) => setAmbitionName(event.target.value)} placeholder="Launch a focused morning routine…" autoComplete="off" spellCheck={false} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 w-full">
                <FieldLabel htmlFor="ambitionTrackingMethod" tooltip="Choose whether this ambition progresses through tasks or through milestones.">
                  Tracking method
                </FieldLabel>
                <Select.Select value={trackingMethod} onValueChange={(value) => setTrackingMethod(value as TrackingMethod)}>
                  <Select.SelectTrigger id="ambitionTrackingMethod" aria-label="Tracking method" className="w-full">
                    <Select.SelectValue placeholder="Tracking method" />
                  </Select.SelectTrigger>
                  <Select.SelectContent>
                    <Select.SelectGroup>
                      <Select.SelectItem value="task">Task based</Select.SelectItem>
                      <Select.SelectItem value="milestone">Milestone based</Select.SelectItem>
                    </Select.SelectGroup>
                  </Select.SelectContent>
                </Select.Select>
              </div>

              <div className="space-y-2 w-full">
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel htmlFor="ambitionDefinition" tooltip="Optional context that explains the why behind the goal.">
                Definition
              </FieldLabel>
              <Textarea id="ambitionDefinition" name="ambitionDefinition" value={ambitionDefinition} onChange={(event) => setAmbitionDefinition(event.target.value)} placeholder="What does success look like? (Optional field)" rows={4} spellCheck />
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="ambitionDateRange" tooltip="Choose the active window for this ambition. The selected range is saved to the hidden start and end date fields.">
                Date range
              </FieldLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <Button id="ambitionDateRange" type="button" variant="outline" className="w-full justify-start px-3 font-normal">
                    <CalendarIcon className="size-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={handleDateRangeSelect} disabled={{ before: today }} numberOfMonths={2} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <SectionHeading
            title={trackingMethod === "task" ? "Tasks" : "Milestones"}
            tooltip={trackingMethod === "task" ? "Add one or more concrete actions that will be saved with the ambition." : "Add one or more milestones that mark progress toward the ambition."}
            action={
              <Button type="button" variant="outline" size="sm" onClick={() => (trackingMethod === "task" ? setTasks((current) => [...current, createTaskDraft()]) : setMilestones((current) => [...current, createMilestoneDraft()]))}>
                <PlusIcon className="size-4" />
                Add another
              </Button>
            }
          />

          {trackingMethod === "task" ? (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={task.id} className="rounded-2xl border border-border/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Task {index + 1}</p>
                    </div>

                    <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(task.id)} aria-label={`Remove task ${index + 1}`} className="size-8 rounded-full">
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <FieldLabel htmlFor={`tasks.${index}.task`} tooltip="Keep the title action-oriented and specific.">
                        Task title
                      </FieldLabel>
                      <Input id={`tasks.${index}.task`} name={`tasks.${index}.task`} value={task.task} onChange={(event) => updateTask(task.id, "task", event.target.value)} placeholder="Complete the first two weeks of the habit…" required />
                    </div>

                    <div className="space-y-2">
                      <FieldLabel htmlFor={`tasks.${index}.taskDeadline`} tooltip="Pick the date this task should be done by.">
                        Task deadline
                      </FieldLabel>
                      <input name={`tasks.${index}.taskDeadline`} type="hidden" value={task.taskDeadline} />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="outline" data-empty={!task.taskDeadline} className="w-full justify-start bg-background text-left font-normal data-[empty=true]:text-muted-foreground">
                            <CalendarIcon />
                            {task.taskDeadline ? format(toSelectedDate(task.taskDeadline) ?? new Date(task.taskDeadline), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={toSelectedDate(task.taskDeadline)} onSelect={(selectedDate) => updateTask(task.id, "taskDeadline", selectedDate ? toDateInputValue(selectedDate) : "")} disabled={{ before: today }} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <FieldLabel htmlFor={`tasks.${index}.taskDescription`} tooltip="Optional context, acceptance criteria, or extra notes for this task.">
                        Task description
                      </FieldLabel>
                      <Textarea
                        id={`tasks.${index}.taskDescription`}
                        name={`tasks.${index}.taskDescription`}
                        value={task.taskDescription}
                        onChange={(event) => updateTask(task.id, "taskDescription", event.target.value)}
                        placeholder="Optional context, acceptance criteria, or notes…"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="rounded-2xl border border-border/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Milestone {index + 1}</p>
                    </div>

                    <Button type="button" variant="ghost" size="icon" onClick={() => removeMilestone(milestone.id)} aria-label={`Remove milestone ${index + 1}`} className="size-8 rounded-full">
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <FieldLabel htmlFor={`milestones.${index}.milestone`} tooltip="Keep the title specific to the outcome you want to reach.">
                        Milestone title
                      </FieldLabel>
                      <Input
                        id={`milestones.${index}.milestone`}
                        name={`milestones.${index}.milestone`}
                        value={milestone.milestone}
                        onChange={(event) => updateMilestone(milestone.id, "milestone", event.target.value)}
                        placeholder="Reach the first 1,000 minutes of practice…"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <FieldLabel htmlFor={`milestones.${index}.milestoneTargetDate`} tooltip="Pick the date this milestone should be reached by.">
                        Target date
                      </FieldLabel>
                      <input name={`milestones.${index}.milestoneTargetDate`} type="hidden" value={milestone.milestoneTargetDate} />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="outline" data-empty={!milestone.milestoneTargetDate} className="w-full justify-start bg-background text-left font-normal data-[empty=true]:text-muted-foreground">
                            <CalendarIcon />
                            {milestone.milestoneTargetDate ? format(toSelectedDate(milestone.milestoneTargetDate) ?? new Date(milestone.milestoneTargetDate), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={toSelectedDate(milestone.milestoneTargetDate)}
                            onSelect={(selectedDate) => updateMilestone(milestone.id, "milestoneTargetDate", selectedDate ? toDateInputValue(selectedDate) : "")}
                            disabled={{ before: today }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <FieldLabel htmlFor={`milestones.${index}.milestoneDescription`} tooltip="Optional context or notes that define the milestone more clearly.">
                        Milestone description
                      </FieldLabel>
                      <Textarea
                        id={`milestones.${index}.milestoneDescription`}
                        name={`milestones.${index}.milestoneDescription`}
                        value={milestone.milestoneDescription}
                        onChange={(event) => updateMilestone(milestone.id, "milestoneDescription", event.target.value)}
                        placeholder="Optional notes about the milestone definition…"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {state.error ? (
          <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? (
              <>
                <ArrowRightIcon className="size-4 animate-pulse" />
                Creating ambition…
              </>
            ) : (
              <>
                <FlameIcon className="size-4" />
                Create ambition
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
