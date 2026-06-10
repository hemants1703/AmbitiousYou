"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toDateInputValue, toSelectedDate, type DraftState, type MoveKind } from "@/lib/(app)/tracked-item";
import { format } from "date-fns";
import { CalendarIcon, CircleHelpIcon, FlagIcon, ListTodoIcon } from "lucide-react";
import type { Matcher } from "react-day-picker";

interface TrackedItemDraftEditorProps {
  label: string;
  draft: DraftState;
  /** Calendar matchers bounding the date to the ambition's window. */
  dateDisabled: Matcher[];
  isPending: boolean;
  /** When editing an existing move, the kind can't change (tasks and milestones are different tables). */
  lockKind?: boolean;
  onChange: (draft: DraftState) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function TrackedItemDraftEditor(props: TrackedItemDraftEditorProps) {
  const { draft, onChange } = props;
  const canSave = Boolean(draft.title.trim()) && Boolean(draft.date);
  const isTask = draft.kind === "task";

  return (
    <div className="space-y-3 rounded-2xl border border-primary/30 bg-background/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{props.label}</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="What is the difference between a task and a milestone?"
              className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <CircleHelpIcon className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <span className="font-medium text-foreground">Task</span> — a concrete to-do you can check and uncheck anytime. <span className="font-medium text-foreground">Milestone</span> — a one-time achievement; marking it reached is permanent.
          </TooltipContent>
        </Tooltip>
      </div>

      <ToggleGroup
        type="single"
        value={draft.kind}
        onValueChange={(value) => {
          if (value) onChange({ ...draft, kind: value as MoveKind });
        }}
        disabled={props.lockKind}
        className="grid w-full grid-cols-2 gap-2">
        <ToggleGroupItem value="task" variant="outline" aria-label="Task" className="gap-1.5 data-[state=on]:border-primary data-[state=on]:bg-primary/5">
          <ListTodoIcon className="size-4" />
          Task
        </ToggleGroupItem>
        <ToggleGroupItem value="milestone" variant="outline" aria-label="Milestone" className="gap-1.5 data-[state=on]:border-primary data-[state=on]:bg-primary/5">
          <FlagIcon className="size-4" />
          Milestone
        </ToggleGroupItem>
      </ToggleGroup>

      <Input
        autoFocus
        value={draft.title}
        onChange={(event) => onChange({ ...draft, title: event.target.value })}
        placeholder={isTask ? "Task title" : "Milestone title"}
        onKeyDown={(event) => {
          if (event.key === "Escape") props.onCancel();
        }}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" data-empty={!draft.date} className="w-full justify-start bg-background text-left font-normal data-[empty=true]:text-muted-foreground">
            <CalendarIcon className="size-4" />
            {draft.date ? format(toSelectedDate(draft.date) ?? new Date(draft.date), "PPP") : <span>{isTask ? "Pick a deadline" : "Pick a target date"}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={toSelectedDate(draft.date)} onSelect={(selected) => onChange({ ...draft, date: selected ? toDateInputValue(selected) : "" })} disabled={props.dateDisabled} />
        </PopoverContent>
      </Popover>

      <Textarea value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} placeholder="Optional description…" rows={3} />

      <div className="flex items-center gap-2">
        <Button type="button" size="sm" disabled={props.isPending || !canSave} onClick={props.onSubmit}>
          Save move
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={props.isPending} onClick={props.onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
