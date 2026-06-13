import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOVE_KIND_STYLE } from "@/lib/(app)/tracked-item";
import type { DayGroup, QueueItem } from "@/lib/dashboard/tracked-items";
import { cn } from "@/lib/utils";
import { CalendarCheckIcon, CalendarRangeIcon } from "lucide-react";

interface WeeklyPreviewProps {
  groups: DayGroup[];
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" });

/** The one move to worry about first that day: milestones take priority over tasks. */
function leadItem(items: QueueItem[]): QueueItem {
  return items.find((item) => item.kind === "milestone") ?? items[0];
}

/**
 * A tight two-day look-ahead beside Today: just Tomorrow and the Day after Tomorrow, each
 * with its real calendar date so the user always knows exactly which day is which. Surfaces
 * the single highest-priority move per day (milestone-first, then task) in its move-kind
 * colour, so "the first thing to worry about" reads at a glance.
 */
export function WeeklyPreview(props: WeeklyPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarRangeIcon className="size-4 text-foreground" />
          Coming up
        </CardTitle>
        <CardDescription>The next two days, so nothing sneaks up.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {props.groups.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-muted/20 p-6 text-center">
            <CalendarCheckIcon className="size-6 text-muted-foreground/60" />
            <p className="text-sm font-medium">Clear days ahead</p>
            <p className="text-xs text-muted-foreground">Nothing due tomorrow or the day after.</p>
          </div>
        ) : (
          props.groups.map((group) => {
            const lead = leadItem(group.items);
            const others = group.items.length - 1;

            return (
              <div key={group.dateKey} className="space-y-2 rounded-2xl border border-border/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{group.label}</p>
                    <p className="text-xs tabular-nums text-muted-foreground">{DATE_FORMATTER.format(group.items[0].date)}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 tabular-nums">
                    {group.items.length}
                  </Badge>
                </div>

                {/* The first thing to worry about that day, colour-coded by move kind. */}
                <div className={cn("flex items-start gap-2 rounded-xl border border-l-4 bg-background/60 p-2.5", MOVE_KIND_STYLE[lead.kind].stripe)}>
                  <MoveKindBadge kind={lead.kind} className="mt-0.5 shrink-0" />
                  <p className="min-w-0 line-clamp-2 text-sm wrap-anywhere">{lead.title}</p>
                </div>

                {others > 0 ? (
                  <p className="px-1 text-xs text-muted-foreground">
                    +{others} more {others === 1 ? "move" : "moves"} that day
                  </p>
                ) : null}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
