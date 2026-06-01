import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AttentionFlag, AttentionSeverity } from "@/lib/dashboard/tracked-items";
import { CalendarClockIcon, CheckCircle2Icon, ChevronRightIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

interface AttentionListProps {
  flags: AttentionFlag[];
}

const MAX_VISIBLE = 5;

const severityStyles: Record<AttentionSeverity, { row: string; chip: string; icon: ComponentType<{ className?: string }> }> = {
  overdue: {
    row: "border-destructive/20 hover:bg-destructive/5",
    chip: "bg-destructive/10 text-destructive",
    icon: CalendarClockIcon,
  },
  stalled: {
    row: "border-amber-500/20 hover:bg-amber-500/5",
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: TriangleAlertIcon,
  },
  ready: {
    row: "border-emerald-500/20 hover:bg-emerald-500/5",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle2Icon,
  },
};

export function AttentionList(props: AttentionListProps) {
  if (props.flags.length === 0) return null;

  const visible = props.flags.slice(0, MAX_VISIBLE);
  const remaining = props.flags.length - visible.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TriangleAlertIcon className="size-4 text-amber-600 dark:text-amber-400" />
          Needs your attention
        </CardTitle>
        <CardDescription>A gentle nudge on ambitions that could slip — or are ready for a win.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {visible.map((flag) => {
          const style = severityStyles[flag.severity];
          const Icon = style.icon;

          return (
            <Link
              key={flag.ambitionId}
              href={`/ambitions/${flag.ambitionId}`}
              prefetch
              className={cn("flex items-center gap-3 rounded-2xl border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", style.row)}>
              <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-xl", style.chip)} aria-hidden="true">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium" translate="no">
                  {flag.ambitionName}
                </p>
                <p className="truncate text-sm text-muted-foreground">{flag.reason}</p>
              </div>
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}

        {remaining > 0 ? <p className="px-1 text-xs text-muted-foreground">+{remaining} more {remaining === 1 ? "ambition" : "ambitions"} to review</p> : null}
      </CardContent>
    </Card>
  );
}
