import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DayGroup } from "@/lib/dashboard/tracked-items";
import { CalendarCheckIcon, CalendarRangeIcon, QuoteIcon } from "lucide-react";

interface WeeklyPreviewProps {
  groups: DayGroup[];
}

export function WeeklyPreview(props: WeeklyPreviewProps) {
  // Anchor the week to the "why" behind the single most pressing ambition (items
  // arrive urgency-sorted), skipping any without a motivation. Renders nothing when
  // there's no upcoming work or none of it carries a motivation.
  const leadMotivation = props.groups.flatMap((group) => group.items).find((item) => item.ambitionMotivation?.trim())?.ambitionMotivation;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarRangeIcon className="size-4 text-foreground" />
          Coming up this week
        </CardTitle>
        <CardDescription>What&apos;s due over the next 7 days.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {props.groups.length > 0 && leadMotivation ? (
          <div className="flex items-start gap-2 rounded-2xl border-l-2 border-primary/40 bg-primary/5 px-3 py-2.5">
            <QuoteIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Why this matters this week:</span> {leadMotivation}
            </p>
          </div>
        ) : null}

        {props.groups.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-muted/20 p-6 text-center">
            <CalendarCheckIcon className="size-6 text-muted-foreground/60" />
            <p className="text-sm font-medium">Clear week ahead</p>
            <p className="text-xs text-muted-foreground">Nothing due in the next 7 days.</p>
          </div>
        ) : (
          props.groups.map((group) => {
            const extra = group.items.length - 1;
            return (
              <div key={group.dateKey} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{group.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {group.items[0].title}
                    {extra > 0 ? ` +${extra} more` : ""}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 tabular-nums">
                  {group.items.length}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
