import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOVE_KIND_STYLE, type MoveKind } from "@/lib/(app)/tracked-item";
import { FlagIcon, ListTodoIcon } from "lucide-react";

interface MoveKindBadgeProps {
  kind: MoveKind;
  className?: string;
}

/**
 * The shared, color-coded "Task" / "Milestone" badge. One source of truth for the
 * kind label, icon, and color tint (teal task / fuchsia milestone) so every surface
 * — execution board, dashboard, completed drawer, landing demo — reads identically.
 * Presentational only (no hooks), so it works in server components too.
 */
export function MoveKindBadge(props: MoveKindBadgeProps) {
  const style = MOVE_KIND_STYLE[props.kind];
  const Icon = props.kind === "task" ? ListTodoIcon : FlagIcon;

  return (
    <Badge variant="outline" className={cn("gap-1 px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide", style.badge, props.className)}>
      <Icon className="size-2.5" />
      {style.label}
    </Badge>
  );
}
