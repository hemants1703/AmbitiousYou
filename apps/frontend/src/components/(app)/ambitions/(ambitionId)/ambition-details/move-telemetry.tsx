import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, CheckCircle2Icon, CircleDotIcon } from "lucide-react";

interface MoveTelemetryProps {
  open: number;
  completed: number;
  overdue: number;
  className?: string;
}

/**
 * Lightweight move pulse — lives on the execution board where work happens.
 * Overdue only surfaces when actionable; no separate "health" card needed.
 */
export function MoveTelemetry(props: MoveTelemetryProps) {
  if (props.open === 0 && props.completed === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", props.className)} role="status" aria-label="Move status">
      {props.open > 0 ? (
        <Badge variant="outline" className="gap-1 tabular-nums">
          <CircleDotIcon className="size-3" aria-hidden="true" />
          {props.open} in flight
        </Badge>
      ) : null}
      {props.completed > 0 ? (
        <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 tabular-nums text-emerald-800 dark:text-emerald-300">
          <CheckCircle2Icon className="size-3" aria-hidden="true" />
          {props.completed} won
        </Badge>
      ) : null}
      {props.overdue > 0 ? (
        <Badge variant="outline" className="gap-1 border-destructive/40 bg-destructive/10 tabular-nums text-destructive">
          <AlertCircleIcon className="size-3" aria-hidden="true" />
          {props.overdue} overdue
        </Badge>
      ) : null}
    </div>
  );
}
