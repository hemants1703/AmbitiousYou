"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as Select from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CalendarIcon, CalendarRangeIcon, CircleHelpIcon, FlagIcon, FlameIcon, ListTodoIcon, PlusIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { useActionState, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { DateRange, Matcher } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { createAmbitionAction } from "@/lib/actions/(app)/ambitions/create-ambition";
import { createAmbitionInitialState } from "@/lib/actions/(app)/ambitions/create-ambition-state";
import { clearDraft, draftHasContent, loadDraft, saveDraft, type MilestoneDraft, type TaskDraft } from "@/lib/(app)/create-ambition-draft";

const AMBITION_NAME_MAX_LENGTH = 80;

type TrackingMethod = "task" | "milestone";
type Priority = "low" | "medium" | "high";

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
  const router = useRouter();
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
  const [restored, setRestored] = useState(false);

  // Gates the save effect so the pre-hydration render can't clobber a stored draft.
  const hydratedRef = useRef(false);

  // Hydrate from localStorage once, after mount. Seeding editable form state from an
  // external store has to happen post-mount: reading storage during render would diverge
  // from the server HTML and break hydration. React 19 batches these into a single
  // re-render, so there's no cascade — the lint rule just can't model this case.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      /* eslint-disable react-hooks/set-state-in-effect -- one-time external-store hydration (see comment above) */
      setAmbitionName(draft.ambitionName);
      setAmbitionDefinition(draft.ambitionDefinition);
      setTrackingMethod(draft.trackingMethod);
      setPriority(draft.priority);
      setStartDate(draft.startDate);
      setEndDate(draft.endDate);

      const from = draft.startDate ? parseISO(draft.startDate) : undefined;
      const to = draft.endDate ? parseISO(draft.endDate) : undefined;
      setDateRange(from ? { from, to: to ?? from } : undefined);

      // Keep the seeded first row when the draft has no items of that kind.
      if (draft.tasks.length > 0) setTasks(draft.tasks);
      if (draft.milestones.length > 0) setMilestones(draft.milestones);

      if (draftHasContent(draft)) setRestored(true);
      /* eslint-enable react-hooks/set-state-in-effect */
    }

    hydratedRef.current = true; // release the save effect (even when there was no draft)
  }, []);

  // Persist on every change once hydration has completed. An empty form clears the key
  // instead of storing noise, so an untouched page (and "Start fresh") leaves nothing behind.
  useEffect(() => {
    if (!hydratedRef.current) return;
    const draft = { ambitionName, ambitionDefinition, trackingMethod, priority, startDate, endDate, tasks, milestones };
    if (draftHasContent(draft)) {
      saveDraft(draft);
    } else {
      clearDraft();
    }
  }, [ambitionName, ambitionDefinition, trackingMethod, priority, startDate, endDate, tasks, milestones]);

  // The action returns success instead of redirecting, so we clear the draft and
  // navigate here — keeping draft removal tied to a real creation, not plain navigation.
  useEffect(() => {
    if (state.success) {
      clearDraft();
      router.push("/ambitions");
    }
  }, [state.success, router]);

  const resetForm = () => {
    clearDraft();
    setAmbitionName("");
    setAmbitionDefinition("");
    setTrackingMethod("task");
    setPriority("medium");
    setDateRange(undefined);
    setStartDate("");
    setEndDate("");
    setTasks([createTaskDraft()]);
    setMilestones([createMilestoneDraft()]);
    setRestored(false);
  };

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
      // Collapsing the window hides the item section (it gates on these strings).
      setStartDate("");
      setEndDate("");
      return;
    }

    const nextStart = toDateInputValue(range.from);
    const nextEnd = toDateInputValue(range.to ?? range.from);
    setStartDate(nextStart);
    setEndDate(nextEnd);

    // Item target dates must stay inside the ambition window. All values are
    // "YYYY-MM-DD", so lexicographic comparison is chronological — drop any that fall out.
    const inWindow = (date: string) => date !== "" && date >= nextStart && date <= nextEnd;
    setTasks((current) => current.map((task) => (inWindow(task.taskDeadline) ? task : { ...task, taskDeadline: "" })));
    setMilestones((current) => current.map((milestone) => (inWindow(milestone.milestoneTargetDate) ? milestone : { ...milestone, milestoneTargetDate: "" })));
  };

  // Item entry unlocks only once the ambition window exists; each item's date is then
  // confined to that window so nothing can be scheduled outside the ambition.
  const hasDateRange = Boolean(startDate && endDate);
  const itemDateDisabled: Matcher[] = hasDateRange ? [{ before: parseISO(startDate) }, { after: parseISO(endDate) }] : [];

  return (
    <div className="mx-auto w-full">
      <form action={formAction} className="space-y-6">
        <input name="ambitionTrackingMethod" type="hidden" value={trackingMethod} />
        <input name="ambitionPriority" type="hidden" value={priority} />
        <input name="ambitionStartDate" type="hidden" value={startDate} />
        <input name="ambitionEndDate" type="hidden" value={endDate} />

        {restored ? (
          <div role="status" aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm">
            <p className="text-muted-foreground">We restored your unsaved draft so you can pick up where you left off.</p>
            <Button type="button" variant="outline" size="sm" onClick={resetForm}>
              <RotateCcwIcon className="size-3.5" />
              Start fresh
            </Button>
          </div>
        ) : null}

        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <FieldLabel htmlFor="ambitionName" tooltip="Use a short outcome-focused title. This is what appears in lists and cards.">
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
                required
              />
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

          <div className="space-y-2">
            <FieldLabel htmlFor="ambitionTrackingMethod" tooltip="Tasks are concrete, repeatable to-dos. Milestones are one-time, target-dated achievements. Pick whichever matches how you'll measure progress.">
              How will you track progress?
            </FieldLabel>
            <ToggleGroup
              type="single"
              value={trackingMethod}
              onValueChange={(value) => {
                if (value) setTrackingMethod(value as TrackingMethod);
              }}
              className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <ToggleGroupItem
                value="task"
                variant="outline"
                aria-label="Track with tasks"
                className="h-auto w-full flex-col items-start justify-start gap-1.5 whitespace-normal rounded-2xl border p-4 text-left data-[state=on]:border-primary data-[state=on]:bg-primary/5">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <ListTodoIcon className="size-4" />
                  Tasks
                </span>
                <span className="text-sm text-muted-foreground">Concrete steps you can check and uncheck anytime.</span>
                <span className="text-xs text-muted-foreground">e.g. &ldquo;Run 3&times; this week&rdquo;</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="milestone"
                variant="outline"
                aria-label="Track with milestones"
                className="h-auto w-full flex-col items-start justify-start gap-1.5 whitespace-normal rounded-2xl border p-4 text-left data-[state=on]:border-primary data-[state=on]:bg-primary/5">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <FlagIcon className="size-4" />
                  Milestones
                </span>
                <span className="text-sm text-muted-foreground">Bigger, fuzzier outcomes with a target date. Reaching one is permanent.</span>
                <span className="text-xs text-muted-foreground">e.g. &ldquo;Land a 12&nbsp;LPA job&rdquo;</span>
              </ToggleGroupItem>
            </ToggleGroup>
            {trackingMethod === "milestone" ? <p className="text-xs text-muted-foreground">Milestones are marked complete once and can&rsquo;t be reopened&mdash;great for goals you can&rsquo;t fully script yet.</p> : null}
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

        {hasDateRange ? (
          <>
            <Separator />

            <section className="space-y-4">
              <SectionHeading
                title={trackingMethod === "task" ? "Tasks" : "Milestones"}
                tooltip={trackingMethod === "task" ? "Add one or more concrete, repeatable actions. You can check and uncheck these anytime." : "Add one or more milestones — bigger, target-dated achievements. Each is marked reached once and can't be reopened."}
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
                          <FieldLabel htmlFor={`tasks.${index}.taskDeadline`} tooltip="Pick the date this task should be done by — it must fall within the ambition's date range.">
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
                              <Calendar mode="single" selected={toSelectedDate(task.taskDeadline)} onSelect={(selectedDate) => updateTask(task.id, "taskDeadline", selectedDate ? toDateInputValue(selectedDate) : "")} disabled={itemDateDisabled} />
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
                            placeholder="Land a 12 LPA job…"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <FieldLabel htmlFor={`milestones.${index}.milestoneTargetDate`} tooltip="Pick the date this milestone should be reached by — it must fall within the ambition's date range.">
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
                                disabled={itemDateDisabled}
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
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 px-6 py-10 text-center">
            <CalendarRangeIcon className="mx-auto mb-3 size-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium">Set your date range to start adding {trackingMethod === "task" ? "tasks" : "milestones"}</p>
            <p className="mt-1 text-sm text-muted-foreground">Pick the ambition&rsquo;s window above — then every {trackingMethod === "task" ? "task" : "milestone"} you add stays inside it…</p>
          </div>
        )}

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
