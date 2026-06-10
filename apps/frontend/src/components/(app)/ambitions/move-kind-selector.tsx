"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { MOVE_KIND_STYLE, type MoveKind } from "@/lib/(app)/tracked-item";
import { FlagIcon, ListTodoIcon, LockIcon, RotateCcwIcon, type LucideIcon } from "lucide-react";

interface MoveKindSelectorProps {
  value: MoveKind;
  onValueChange: (kind: MoveKind) => void;
  disabled?: boolean;
  /** Applied to the ToggleGroup so callers control grid vs stacked layout. */
  className?: string;
}

type NoteTone = "info" | "warning";

interface MoveKindOption {
  value: MoveKind;
  label: string;
  icon: LucideIcon;
  description: string;
  example: string;
  note: { text: string; tone: NoteTone; icon: LucideIcon };
}

// Each card has the SAME structure (label, description, example, footer note) so the two
// stay the same height and never look lopsided. Task's note reassures (reversible); the
// milestone's note warns (permanent).
const MOVE_KIND_OPTIONS: MoveKindOption[] = [
  {
    value: "task",
    label: "Task",
    icon: ListTodoIcon,
    description: "In your control — you can commit to finishing it within your time frame.",
    example: "e.g. Prepare your résumé (you decide when it's done).",
    note: { text: "Flexible — check or uncheck it anytime.", tone: "info", icon: RotateCcwIcon },
  },
  {
    value: "milestone",
    label: "Milestone",
    icon: FlagIcon,
    description: "Not fully in your control — but you set a target date to reach it by.",
    example: "e.g. Crack an interview at Meta (the timing isn't yours, but you set a tight deadline).",
    note: { text: "One-way: once you mark it reached, it's permanent — there's no undo.", tone: "warning", icon: LockIcon },
  },
];

const NOTE_TONE: Record<NoteTone, string> = {
  info: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

export function MoveKindSelector(props: MoveKindSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={props.value}
      onValueChange={(value) => {
        if (value) props.onValueChange(value as MoveKind);
      }}
      disabled={props.disabled}
      className={cn("grid w-full grid-cols-1 items-stretch gap-2 sm:grid-cols-2", props.className)}>
      {MOVE_KIND_OPTIONS.map((option) => {
        const NoteIcon = option.note.icon;
        return (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            variant="outline"
            aria-label={option.label}
            className={cn("h-full flex-col items-start gap-1 whitespace-normal rounded-xl p-3 text-left", MOVE_KIND_STYLE[option.value].selected)}>
            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <option.icon className={cn("size-4", MOVE_KIND_STYLE[option.value].text)} />
              {option.label}
            </span>
            <span className="text-xs leading-snug text-muted-foreground">{option.description}</span>
            <span className="text-xs leading-snug text-muted-foreground/80">{option.example}</span>
            <span className={cn("mt-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-snug", NOTE_TONE[option.note.tone])}>
              <NoteIcon className="size-3 shrink-0" />
              {option.note.text}
            </span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
