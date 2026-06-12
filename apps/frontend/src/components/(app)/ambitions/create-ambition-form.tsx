"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as Select from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MoveKindSelector } from "@/components/(app)/ambitions/move-kind-selector";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CalendarIcon, CalendarRangeIcon, CircleHelpIcon, FlameIcon, PlusIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { useActionState, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { DateRange, Matcher } from "react-day-picker";
import { format, parseISO } from "date-fns";
import { createAmbitionAction } from "@/lib/actions/(app)/ambitions/create-ambition";
import { createAmbitionInitialState } from "@/lib/actions/(app)/ambitions/create-ambition-state";
import { clearDraft, draftHasContent, loadDraft, saveDraft, type MoveDraft, type MoveKind } from "@/lib/(app)/create-ambition-draft";
import { MOVE_TITLE_MAX_LENGTH } from "@/lib/(app)/tracked-item";

const AMBITION_NAME_MAX_LENGTH = 80;

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

function createMoveDraft(kind: MoveKind = "task"): MoveDraft {
  return {
    id: crypto.randomUUID(),
    kind,
    title: "",
    description: "",
    date: "",
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
  const [ambitionMotivation, setAmbitionMotivation] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [moves, setMoves] = useState<MoveDraft[]>([createMoveDraft()]);
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
      setAmbitionMotivation(draft.ambitionMotivation);
      setPriority(draft.priority);
      setStartDate(draft.startDate);
      setEndDate(draft.endDate);

      const from = draft.startDate ? parseISO(draft.startDate) : undefined;
      const to = draft.endDate ? parseISO(draft.endDate) : undefined;
      setDateRange(from ? { from, to: to ?? from } : undefined);

      // Keep the seeded first row when the draft has no moves yet.
      if (draft.moves.length > 0) setMoves(draft.moves);

      if (draftHasContent(draft)) setRestored(true);
      /* eslint-enable react-hooks/set-state-in-effect */
    }

    hydratedRef.current = true; // release the save effect (even when there was no draft)
  }, []);

  // Persist on every change once hydration has completed. An empty form clears the key
  // instead of storing noise, so an untouched page (and "Start fresh") leaves nothing behind.
  useEffect(() => {
    if (!hydratedRef.current) return;
    const draft = { ambitionName, ambitionDefinition, ambitionMotivation, priority, startDate, endDate, moves };
    if (draftHasContent(draft)) {
      saveDraft(draft);
    } else {
      clearDraft();
    }
  }, [ambitionName, ambitionDefinition, ambitionMotivation, priority, startDate, endDate, moves]);

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
    setAmbitionMotivation("");
    setPriority("medium");
    setDateRange(undefined);
    setStartDate("");
    setEndDate("");
    setMoves([createMoveDraft()]);
    setRestored(false);
  };

  const updateMove = (id: string, field: "title" | "description" | "date", value: string) => {
    setMoves((current) => current.map((move) => (move.id === id ? { ...move, [field]: value } : move)));
  };

  const setMoveKind = (id: string, kind: MoveKind) => {
    setMoves((current) => current.map((move) => (move.id === id ? { ...move, kind } : move)));
  };

  const removeMove = (id: string) => {
    setMoves((current) => (current.length > 1 ? current.filter((move) => move.id !== id) : current));
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);

    if (!range?.from) {
      // Collapsing the window hides the moves section (it gates on these strings).
      setStartDate("");
      setEndDate("");
      return;
    }

    const nextStart = toDateInputValue(range.from);
    const nextEnd = toDateInputValue(range.to ?? range.from);
    setStartDate(nextStart);
    setEndDate(nextEnd);

    // Move dates must stay inside the ambition window. All values are "YYYY-MM-DD",
    // so lexicographic comparison is chronological — drop any that fall out.
    const inWindow = (date: string) => date !== "" && date >= nextStart && date <= nextEnd;
    setMoves((current) => current.map((move) => (inWindow(move.date) ? move : { ...move, date: "" })));
  };

  // Move entry unlocks only once the ambition window exists; each move's date is then
  // confined to that window so nothing can be scheduled outside the ambition.
  const hasDateRange = Boolean(startDate && endDate);
  const itemDateDisabled: Matcher[] = hasDateRange ? [{ before: parseISO(startDate) }, { after: parseISO(endDate) }] : [];
  const hasValidMove = moves.some((move) => move.title.trim() && move.date);

  // Map each move to its kind-specific form-field prefix with separate running indices,
  // so the server action's existing `tasks.${i}` / `milestones.${i}` parser is unchanged.
  let taskIndex = 0;
  let milestoneIndex = 0;
  const encodedMoves = moves.map((move) => {
    const isTask = move.kind === "task";
    const prefix = isTask ? `tasks.${taskIndex++}` : `milestones.${milestoneIndex++}`;
    return {
      move,
      isTask,
      titleName: isTask ? `${prefix}.task` : `${prefix}.milestone`,
      dateName: isTask ? `${prefix}.taskDeadline` : `${prefix}.milestoneTargetDate`,
      descriptionName: isTask ? `${prefix}.taskDescription` : `${prefix}.milestoneDescription`,
    };
  });

  return (
    <div className="mx-auto w-full">
      <form action={formAction} className="space-y-6">
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
              rows={3}
              spellCheck
            />
            <p className="text-xs text-muted-foreground">We&rsquo;ll remind you of this when things get tough.</p>
          </div>
        </section>

        {hasDateRange ? (
          <>
            <Separator />

            <section className="space-y-4">
              <SectionHeading
                title="Build your plan"
                tooltip="Add the moves for this ambition — a free mix of tasks and milestones. Toggle each row between Task and Milestone."
                action={
                  <Button type="button" variant="outline" size="sm" onClick={() => setMoves((current) => [...current, createMoveDraft("task")])}>
                    <PlusIcon className="size-4" />
                    Add move
                  </Button>
                }
              />

              <div className="space-y-3">
                {encodedMoves.map(({ move, isTask, titleName, dateName, descriptionName }, index) => (
                  <div key={move.id} className="rounded-2xl border border-border/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-muted-foreground">Move {index + 1}</p>

                      <Button type="button" variant="ghost" size="icon" onClick={() => removeMove(move.id)} aria-label={`Remove move ${index + 1}`} className="size-8 rounded-full" disabled={moves.length === 1}>
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      {/* Left: pick the kind, with inline explanations of task vs milestone. */}
                      <MoveKindSelector value={move.kind} onValueChange={(kind) => setMoveKind(move.id, kind)} className="grid grid-cols-1 gap-2" />

                      {/* Right: the move's details. */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <FieldLabel htmlFor={titleName} tooltip={isTask ? "Keep the title action-oriented and specific." : "Keep the title specific to the outcome you want to reach."}>
                              {isTask ? "Task title" : "Milestone title"}
                            </FieldLabel>
                            {move.title.length >= MOVE_TITLE_MAX_LENGTH - 20 ? (
                              <span className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
                                {move.title.length}/{MOVE_TITLE_MAX_LENGTH}
                              </span>
                            ) : null}
                          </div>
                          <Input id={titleName} name={titleName} value={move.title} onChange={(event) => updateMove(move.id, "title", event.target.value)} placeholder={isTask ? "Complete the first two weeks of the habit…" : "Land a 12 LPA job…"} maxLength={MOVE_TITLE_MAX_LENGTH} />
                        </div>

                        <div className="space-y-2">
                          <FieldLabel htmlFor={dateName} tooltip={`Pick the date this ${isTask ? "task should be done" : "milestone should be reached"} by — it must fall within the ambition's date range.`}>
                            {isTask ? "Task deadline" : "Target date"}
                          </FieldLabel>
                          <input name={dateName} type="hidden" value={move.date} />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button type="button" variant="outline" data-empty={!move.date} className="w-full justify-start bg-background text-left font-normal data-[empty=true]:text-muted-foreground">
                                <CalendarIcon />
                                {move.date ? format(toSelectedDate(move.date) ?? new Date(move.date), "PPP") : <span>{isTask ? "Pick a deadline" : "Pick a target date"}</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={toSelectedDate(move.date)} onSelect={(selectedDate) => updateMove(move.id, "date", selectedDate ? toDateInputValue(selectedDate) : "")} disabled={itemDateDisabled} />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <FieldLabel htmlFor={descriptionName} tooltip="Optional context, acceptance criteria, or extra notes for this move.">
                            {isTask ? "Task description" : "Milestone description"}
                          </FieldLabel>
                          <Textarea id={descriptionName} name={descriptionName} value={move.description} onChange={(event) => updateMove(move.id, "description", event.target.value)} placeholder="Optional context, acceptance criteria, or notes…" rows={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 px-6 py-10 text-center">
            <CalendarRangeIcon className="mx-auto mb-3 size-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium">Set your date range to start adding moves</p>
            <p className="mt-1 text-sm text-muted-foreground">Pick the ambition&rsquo;s window above — then every move you add stays inside it…</p>
          </div>
        )}

        {state.error ? (
          <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button type="submit" disabled={isPending || !hasDateRange || !hasValidMove} className="w-full sm:w-auto">
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
