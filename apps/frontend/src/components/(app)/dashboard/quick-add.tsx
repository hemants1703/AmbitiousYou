"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createMilestoneAction } from "@/lib/actions/(app)/milestones/create-milestone";
import { createNoteAction } from "@/lib/actions/(app)/notes/create-note";
import { createTaskAction } from "@/lib/actions/(app)/tasks/create-task";
import { MOVE_TITLE_MAX_LENGTH, toDateInputValue, toSelectedDate } from "@/lib/(app)/tracked-item";
import { format } from "date-fns";
import { CalendarIcon, FlagIcon, ListTodoIcon, Loader2Icon, StickyNoteIcon, ZapIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Matcher } from "react-day-picker";
import { toast } from "sonner";

/** Minimal active-ambition shape needed to add a move/note and bound its date to the window. */
export interface QuickAddAmbition {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface QuickAddProps {
  ambitions: QuickAddAmbition[];
}

type Mode = "task" | "milestone" | "note";

const MODES: { value: Mode; label: string; icon: typeof ListTodoIcon }[] = [
  { value: "task", label: "Task", icon: ListTodoIcon },
  { value: "milestone", label: "Milestone", icon: FlagIcon },
  { value: "note", label: "Note", icon: StickyNoteIcon },
];

function atMidnight(value: Date | string): Date {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * One-stop capture from the dashboard: drop a task, milestone, or note onto any active
 * ambition without navigating away. Reuses the existing create server actions verbatim and,
 * like every other dashboard mutation, refreshes the route on success so Today / health /
 * the status line immediately reflect the new work.
 */
export function QuickAdd(props: QuickAddProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [ambitionId, setAmbitionId] = useState(props.ambitions[0]?.id ?? "");
  const [mode, setMode] = useState<Mode>("task");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  if (props.ambitions.length === 0) return null;

  const selected = props.ambitions.find((ambition) => ambition.id === ambitionId) ?? props.ambitions[0];
  const isNote = mode === "note";
  const needsDate = !isNote;

  // Bound the date to the ambition's window, and never let it land in the past.
  const today = atMidnight(new Date());
  const windowStart = atMidnight(selected.startDate);
  const startBound = windowStart > today ? windowStart : today;
  const dateDisabled: Matcher[] = [{ before: startBound }, { after: atMidnight(selected.endDate) }];

  const canSubmit = Boolean(text.trim()) && (!needsDate || Boolean(date));

  function resetAndClose() {
    setText("");
    setDate("");
    setShowCalendar(false);
    setOpen(false);
  }

  function handleAmbitionChange(nextId: string) {
    setAmbitionId(nextId);
    // The new ambition has a different window, so any picked date may no longer be valid.
    setDate("");
    setShowCalendar(false);
  }

  function handleSubmit() {
    if (!canSubmit || isPending) return;

    startTransition(async () => {
      const value = text.trim();
      let error: string | null = null;

      if (mode === "task") {
        error = (await createTaskAction({ ambitionId, task: value, taskDeadline: date })).error;
      } else if (mode === "milestone") {
        error = (await createMilestoneAction({ ambitionId, milestone: value, milestoneTargetDate: date })).error;
      } else {
        error = (await createNoteAction(ambitionId, value)).error;
      }

      if (error) {
        toast.error(error);
        return;
      }

      toast.success(mode === "note" ? "Note added" : `Added “${value}”`);
      resetAndClose();
      router.refresh();
    });
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setShowCalendar(false);
      }}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full shrink-0 sm:w-auto">
          <ZapIcon className="size-4" />
          Quick add
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 max-w-[92vw] space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quick add to</p>
          <Select value={ambitionId} onValueChange={handleAmbitionChange}>
            <SelectTrigger className="w-full" aria-label="Choose an ambition">
              <SelectValue placeholder="Choose an ambition" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
              {props.ambitions.map((ambition) => (
                <SelectItem key={ambition.id} value={ambition.id}>
                  <span className="truncate" translate="no">
                    {ambition.name}
                  </span>
                </SelectItem>
              ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => {
            if (value) setMode(value as Mode);
          }}
          className="grid grid-cols-3 gap-1.5">
          {MODES.map((option) => {
            const Icon = option.icon;
            return (
              <ToggleGroupItem key={option.value} value={option.value} variant="outline" aria-label={option.label} className="gap-1.5 data-[state=on]:border-primary dark:data-[state=on]:border-chart-1 data-[state=on]:bg-primary/5 dark:data-[state=on]:bg-chart-1/5">
                <Icon className="size-3.5" />
                <span className="text-xs">{option.label}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        {isNote ? (
          <Textarea
            autoFocus
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Jot a quick note…"
            rows={3}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") handleSubmit();
            }}
          />
        ) : (
          <>
            <Input
              autoFocus
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={mode === "task" ? "What needs doing?" : "What will you reach?"}
              maxLength={MOVE_TITLE_MAX_LENGTH}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canSubmit) handleSubmit();
              }}
            />

            <Button type="button" variant="outline" data-empty={!date} className="w-full justify-start font-normal data-[empty=true]:text-muted-foreground" onClick={() => setShowCalendar((value) => !value)}>
              <CalendarIcon className="size-4" />
              {date ? format(toSelectedDate(date) ?? new Date(date), "PPP") : <span>{mode === "task" ? "Pick a deadline" : "Pick a target date"}</span>}
            </Button>

            {showCalendar ? (
              <div className="rounded-2xl border">
                <Calendar
                  mode="single"
                  selected={toSelectedDate(date)}
                  onSelect={(value) => {
                    setDate(value ? toDateInputValue(value) : "");
                    setShowCalendar(false);
                  }}
                  disabled={dateDisabled}
                  className="mx-auto"
                />
              </div>
            ) : null}
          </>
        )}

        <Button type="button" className="w-full" disabled={!canSubmit || isPending} onClick={handleSubmit}>
          {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
          {mode === "note" ? "Save note" : mode === "task" ? "Add task" : "Add milestone"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
