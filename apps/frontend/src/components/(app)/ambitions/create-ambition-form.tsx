"use client";

import { createAmbitionAction } from "@/actions/(app)/ambitions/create-ambition";
import { createAmbitionInitialState } from "@/actions/(app)/ambitions/create-ambition-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CirclePlusIcon, FlameIcon, MilestoneIcon, PlusIcon, SparklesIcon, TargetIcon, Trash2Icon } from "lucide-react";
import { useActionState, useMemo, useState } from "react";

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

type NoteDraft = {
  id: string;
  note: string;
};

const colorPresets = ["#0ea5e9", "#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#64748b"];

function createTaskDraft(): TaskDraft {
  return {
    id: crypto.randomUUID(),
    task: "",
    taskDescription: "",
    taskDeadline: toDateInputValue(addDays(new Date(), 7)),
  };
}

function createMilestoneDraft(): MilestoneDraft {
  return {
    id: crypto.randomUUID(),
    milestone: "",
    milestoneDescription: "",
    milestoneTargetDate: toDateInputValue(addDays(new Date(), 14)),
  };
}

function createNoteDraft(): NoteDraft {
  return {
    id: crypto.randomUUID(),
    note: "",
  };
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function toDateInputValue(date: Date): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function formatSummaryDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function CreateAmbitionForm() {
  const [state, formAction, isPending] = useActionState(createAmbitionAction, createAmbitionInitialState);
  const [ambitionName, setAmbitionName] = useState("");
  const [ambitionDefinition, setAmbitionDefinition] = useState("");
  const [trackingMethod, setTrackingMethod] = useState<TrackingMethod>("task");
  const [priority, setPriority] = useState<Priority>("medium");
  const [startDate, setStartDate] = useState(toDateInputValue(new Date()));
  const [endDate, setEndDate] = useState(toDateInputValue(addDays(new Date(), 30)));
  const [isFavourited, setIsFavourited] = useState(false);
  const [tasks, setTasks] = useState<TaskDraft[]>([createTaskDraft()]);
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([createMilestoneDraft()]);
  const [notes, setNotes] = useState<NoteDraft[]>([]);

  const currentItemCount = useMemo(() => {
    return trackingMethod === "task" ? tasks.length : milestones.length;
  }, [milestones.length, tasks.length, trackingMethod]);

  const summaryLabel = trackingMethod === "task" ? "tasks" : "milestones";

  const updateTask = (id: string, field: keyof Omit<TaskDraft, "id">, value: string) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, [field]: value } : task)));
  };

  const updateMilestone = (id: string, field: keyof Omit<MilestoneDraft, "id">, value: string) => {
    setMilestones((current) => current.map((milestone) => (milestone.id === id ? { ...milestone, [field]: value } : milestone)));
  };

  const updateNote = (id: string, value: string) => {
    setNotes((current) => current.map((note) => (note.id === id ? { ...note, note: value } : note)));
  };

  const removeTask = (id: string) => {
    setTasks((current) => (current.length > 1 ? current.filter((task) => task.id !== id) : current));
  };

  const removeMilestone = (id: string) => {
    setMilestones((current) => (current.length > 1 ? current.filter((milestone) => milestone.id !== id) : current));
  };

  const removeNote = (id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
      <Card className="overflow-hidden border-border/70 bg-background/80 shadow-md ring-1 ring-foreground/5 backdrop-blur-xl">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-muted/20 via-transparent to-transparent">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SparklesIcon className="size-4" />
            <span>Create details</span>
          </div>
          <CardTitle className="text-2xl">Shape the ambition</CardTitle>
          <CardDescription>Keep the form focused on the information the backend needs, with a layout that still feels roomy and easy to scan.</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form action={formAction} className="flex flex-col gap-6">
            <input name="ambitionTrackingMethod" type="hidden" value={trackingMethod} />
            <input name="ambitionPriority" type="hidden" value={priority} />
            <input name="ambitionStartDate" type="hidden" value={startDate} />
            <input name="ambitionEndDate" type="hidden" value={endDate} />

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ambitionName">Ambition name</Label>
                <Input
                  id="ambitionName"
                  name="ambitionName"
                  value={ambitionName}
                  onChange={(event) => setAmbitionName(event.target.value)}
                  placeholder="Launch a focused morning routine…"
                  autoComplete="off"
                  spellCheck={false}
                  required
                  className="border-border bg-background"
                />
                <FieldDescription>Write the outcome in plain language. Keep it short enough to fit in a card title.</FieldDescription>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ambitionPriority">Priority</Label>
                <Select.Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                  <Select.SelectTrigger id="ambitionPriority" aria-label="Priority">
                    <Select.SelectValue placeholder="Priority" />
                  </Select.SelectTrigger>
                  <Select.SelectContent>
                    <Select.SelectItem value="low">Low</Select.SelectItem>
                    <Select.SelectItem value="medium">Medium</Select.SelectItem>
                    <Select.SelectItem value="high">High</Select.SelectItem>
                  </Select.SelectContent>
                </Select.Select>
                <FieldDescription>Use this to rank the ambition against your other goals.</FieldDescription>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ambitionDefinition">Definition</Label>
              <Textarea
                id="ambitionDefinition"
                name="ambitionDefinition"
                value={ambitionDefinition}
                onChange={(event) => setAmbitionDefinition(event.target.value)}
                placeholder="What does success look like?"
                className="border-border bg-background"
                rows={4}
                spellCheck
              />
              <FieldDescription>Add a short paragraph to capture the why behind the goal. This is optional but helps with clarity later.</FieldDescription>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ambitionTrackingMethod">Tracking method</Label>
                <Select.Select value={trackingMethod} onValueChange={(value) => setTrackingMethod(value as TrackingMethod)}>
                  <Select.SelectTrigger id="ambitionTrackingMethod" aria-label="Tracking method">
                    <Select.SelectValue placeholder="Tracking method" />
                  </Select.SelectTrigger>
                  <Select.SelectContent>
                    <Select.SelectItem value="task">Task based</Select.SelectItem>
                    <Select.SelectItem value="milestone">Milestone based</Select.SelectItem>
                  </Select.SelectContent>
                </Select.Select>
                <FieldDescription>{trackingMethod === "task" ? "Use tasks for goals that progress through concrete actions." : "Use milestones for goals that move in clear phases."}</FieldDescription>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ambitionStartDate">Start date</Label>
                <Input id="ambitionStartDate" name="ambitionStartDate" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="border-border bg-background" required />
                <FieldDescription>The ambition becomes active from this date.</FieldDescription>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ambitionEndDate">End date</Label>
                <Input id="ambitionEndDate" name="ambitionEndDate" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="border-border bg-background" required />
                <FieldDescription>This should be the date you want to finish by.</FieldDescription>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-border/70 bg-muted/20 px-4 py-3">
              <Checkbox id="isFavourited" name="isFavourited" value="true" checked={isFavourited} onCheckedChange={(checked) => setIsFavourited(checked === true)} />
              <div className="space-y-1">
                <Label htmlFor="isFavourited" className="cursor-pointer text-sm font-medium">
                  Mark as favourite
                </Label>
                <FieldDescription>Favourite ambitions can be surfaced more easily in future views.</FieldDescription>
              </div>
            </div>

            <Separator />

            <section className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">{trackingMethod === "task" ? "Tasks" : "Milestones"}</h2>
                  <p className="text-sm text-muted-foreground">Add the concrete entries that will be stored with the ambition.</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CirclePlusIcon className="size-4" />
                  <span>
                    {currentItemCount} item{currentItemCount === 1 ? "" : "s"} ready
                  </span>
                </div>
              </div>

              {trackingMethod === "task" ? (
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <div key={task.id} className="rounded-3xl border border-border/70 bg-background/60 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Task {index + 1}</p>
                          <h3 className="text-base font-semibold">What needs to happen?</h3>
                        </div>

                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(task.id)} aria-label={`Remove task ${index + 1}`} className="size-8 rounded-full">
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>

                      <div className="mt-4 grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`tasks.${index}.task`}>Task title</Label>
                          <Input
                            id={`tasks.${index}.task`}
                            name={`tasks.${index}.task`}
                            value={task.task}
                            onChange={(event) => updateTask(task.id, "task", event.target.value)}
                            placeholder="Complete the first two weeks of the habit…"
                            className="border-border bg-background"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`tasks.${index}.taskDescription`}>Task description</Label>
                          <Textarea
                            id={`tasks.${index}.taskDescription`}
                            name={`tasks.${index}.taskDescription`}
                            value={task.taskDescription}
                            onChange={(event) => updateTask(task.id, "taskDescription", event.target.value)}
                            placeholder="Optional context, acceptance criteria, or notes…"
                            className="border-border bg-background"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`tasks.${index}.taskDeadline`}>Task deadline</Label>
                          <Input
                            id={`tasks.${index}.taskDeadline`}
                            name={`tasks.${index}.taskDeadline`}
                            type="date"
                            value={task.taskDeadline}
                            onChange={(event) => updateTask(task.id, "taskDeadline", event.target.value)}
                            className="border-border bg-background"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" className="w-full rounded-3xl" onClick={() => setTasks((current) => [...current, createTaskDraft()])}>
                    <PlusIcon className="size-4" />
                    Add another task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="rounded-3xl border border-border/70 bg-background/60 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Milestone {index + 1}</p>
                          <h3 className="text-base font-semibold">What should be achieved?</h3>
                        </div>

                        <Button type="button" variant="ghost" size="icon" onClick={() => removeMilestone(milestone.id)} aria-label={`Remove milestone ${index + 1}`} className="size-8 rounded-full">
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>

                      <div className="mt-4 grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`milestones.${index}.milestone`}>Milestone title</Label>
                          <Input
                            id={`milestones.${index}.milestone`}
                            name={`milestones.${index}.milestone`}
                            value={milestone.milestone}
                            onChange={(event) => updateMilestone(milestone.id, "milestone", event.target.value)}
                            placeholder="Reach the first 1,000 minutes of practice…"
                            className="border-border bg-background"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`milestones.${index}.milestoneDescription`}>Milestone description</Label>
                          <Textarea
                            id={`milestones.${index}.milestoneDescription`}
                            name={`milestones.${index}.milestoneDescription`}
                            value={milestone.milestoneDescription}
                            onChange={(event) => updateMilestone(milestone.id, "milestoneDescription", event.target.value)}
                            placeholder="Optional notes about the milestone definition…"
                            className="border-border bg-background"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`milestones.${index}.milestoneTargetDate`}>Target date</Label>
                          <Input
                            id={`milestones.${index}.milestoneTargetDate`}
                            name={`milestones.${index}.milestoneTargetDate`}
                            type="date"
                            value={milestone.milestoneTargetDate}
                            onChange={(event) => updateMilestone(milestone.id, "milestoneTargetDate", event.target.value)}
                            className="border-border bg-background"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" className="w-full rounded-3xl" onClick={() => setMilestones((current) => [...current, createMilestoneDraft()])}>
                    <PlusIcon className="size-4" />
                    Add another milestone
                  </Button>
                </div>
              )}
            </section>

            <Separator />

            <section className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">Notes</h2>
                  <p className="text-sm text-muted-foreground">Optional context for the ambition. Blank rows are ignored on submit.</p>
                </div>

                <Button type="button" variant="outline" size="sm" onClick={() => setNotes((current) => [...current, createNoteDraft()])} className="rounded-3xl">
                  <PlusIcon className="size-4" />
                  Add note
                </Button>
              </div>

              <div className="space-y-4">
                {notes.length > 0 ? (
                  notes.map((note, index) => (
                    <div key={note.id} className="rounded-3xl border border-border/70 bg-background/60 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Note {index + 1}</p>
                          <h3 className="text-base font-semibold">Keep a thought, constraint, or reminder.</h3>
                        </div>

                        <Button type="button" variant="ghost" size="icon" onClick={() => removeNote(note.id)} aria-label={`Remove note ${index + 1}`} className="size-8 rounded-full">
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>

                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`notes.${index}.note`}>Note text</Label>
                        <Textarea
                          id={`notes.${index}.note`}
                          name={`notes.${index}.note`}
                          value={note.note}
                          onChange={(event) => updateNote(note.id, event.target.value)}
                          placeholder="What should future-you remember about this ambition?"
                          className="border-border bg-background"
                          rows={3}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">Add a note only if there is extra context worth saving with the ambition.</div>
                )}
              </div>
            </section>

            {state.error ? (
              <div role="alert" aria-live="polite" className="rounded-3xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {state.error}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">You can edit anything later. This first pass just needs enough detail to get moving.</p>
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
        </CardContent>
      </Card>

      <div className="grid gap-6 content-start">
        <Card className="overflow-hidden border-border/70 bg-background/80 shadow-md ring-1 ring-foreground/5 backdrop-blur-xl">
          <CardHeader className="border-b border-border/50 bg-linear-to-br from-muted/20 via-transparent to-transparent">
            <CardTitle className="text-2xl">Live preview</CardTitle>
            <CardDescription>See the ambition the way it will feel in the rest of the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="rounded-3xl border border-border/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Draft ambition</p>
                  <h3 className="line-clamp-2 text-xl font-semibold tracking-tight">{ambitionName || "Your ambition title will appear here"}</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{ambitionDefinition || "Add a short definition to clarify the goal before you commit to it."}</p>
                </div>
                <div className="size-11 shrink-0 rounded-full border border-border/70" aria-hidden="true" />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-muted/20 p-3">
                  <p className="text-muted-foreground">Tracking</p>
                  <p className="mt-1 font-medium capitalize">{trackingMethod}-based</p>
                </div>
                <div className="rounded-2xl bg-muted/20 p-3">
                  <p className="text-muted-foreground">Priority</p>
                  <p className="mt-1 font-medium capitalize">{priority}</p>
                </div>
                <div className="rounded-2xl bg-muted/20 p-3">
                  <p className="text-muted-foreground">Start</p>
                  <p className="mt-1 font-medium">{formatSummaryDate(startDate)}</p>
                </div>
                <div className="rounded-2xl bg-muted/20 p-3">
                  <p className="text-muted-foreground">End</p>
                  <p className="mt-1 font-medium">{formatSummaryDate(endDate)}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  {trackingMethod === "task" ? <TargetIcon className="size-4 text-muted-foreground" /> : <MilestoneIcon className="size-4 text-muted-foreground" />}
                  <span className="capitalize">{trackingMethod}</span>
                </div>
                <span className="tabular-nums text-muted-foreground">
                  {currentItemCount} {summaryLabel}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-muted/15 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FlameIcon className="size-4 text-muted-foreground" />
                <span>Submit checklist</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Ambition name, color, priority, and dates are required.</li>
                <li>{trackingMethod === "task" ? "At least one task must have a title and date." : "At least one milestone must have a title and date."}</li>
                <li>Notes are optional and blank rows are ignored.</li>
                <li>The form redirects to your ambitions list after success.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/70 bg-background/80 shadow-md ring-1 ring-foreground/5 backdrop-blur-xl">
          <CardHeader className="border-b border-border/50 bg-linear-to-br from-muted/20 via-transparent to-transparent">
            <CardTitle>What happens next</CardTitle>
            <CardDescription>The backend stores the ambition, then saves the related tasks or milestones inside the same transaction.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm text-muted-foreground">
            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="mt-0.5 rounded-full bg-muted/50 p-2 text-foreground">
                <CirclePlusIcon className="size-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">Main ambition row</p>
                <p>Stores the name, color, dates, priority, status, and favorite flag.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="mt-0.5 rounded-full bg-muted/50 p-2 text-foreground">
                <ArrowRightIcon className="size-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">Related items</p>
                <p>Tasks or milestones are attached to the ambition and stamped with your current user id.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
