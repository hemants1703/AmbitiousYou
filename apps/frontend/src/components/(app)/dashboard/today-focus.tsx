import { MoveDetailProvider } from "@/components/(app)/ambitions/move-detail-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { QueueItem } from "@/lib/dashboard/tracked-items";
import { CheckCircle2Icon, RefreshCwIcon, SunriseIcon } from "lucide-react";
import { ActionQueueItem } from "./action-queue-item";

interface TodayFocusProps {
  /** Every open move across active ambitions, already urgency-sorted (most overdue first). */
  openItems: QueueItem[];
  /** True when every ambition's details failed to load (vs genuinely empty). */
  loadFailed: boolean;
}

function nextUpLabel(daysUntil: number): string {
  if (daysUntil === 1) return "due tomorrow";
  return `due in ${daysUntil} days`;
}

/**
 * The interactive heart of the dashboard: a tickable checklist of exactly the moves due
 * today or already overdue — the work to actually do *now*, not an arbitrary top-N. Rows
 * reuse {@link ActionQueueItem} verbatim (optimistic complete → toast → router.refresh),
 * so as the user ticks items off the panel updates and, once the last one clears, flips to
 * the "Cleared for today" state on its own. Honest momentum, no fabricated streak.
 */
export function TodayFocus(props: TodayFocusProps) {
  const dueNow = props.openItems.filter((item) => item.daysUntil <= 0);
  const nextUp = props.openItems.find((item) => item.daysUntil > 0);
  const upcomingCount = props.openItems.filter((item) => item.daysUntil > 0).length;

  // Server-rendered so the date is consistent and never hydration-mismatches.
  const todayLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SunriseIcon className="size-4 text-foreground" />
          Today
        </CardTitle>
        <CardDescription>
          <span className="font-semibold text-foreground">{todayLabel}</span> · everything due today or overdue.
        </CardDescription>
        {dueNow.length > 0 ? (
          <CardAction>
            <Badge variant="secondary" className="tabular-nums">
              {dueNow.length} to do
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-2.5">
        {props.loadFailed ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-muted/20 p-6 text-center">
            <RefreshCwIcon className="size-6 text-muted-foreground/60" />
            <p className="font-medium">We couldn&apos;t load today&apos;s moves</p>
            <p className="text-sm text-muted-foreground">Please refresh the page in a moment.</p>
          </div>
        ) : dueNow.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2Icon className="size-8 text-emerald-600 dark:text-emerald-400" />
            <p className="font-medium text-foreground">Cleared for today</p>
            <p className="text-sm text-muted-foreground">
              {nextUp ? (
                <>
                  Next up: <span className="font-medium text-foreground">{nextUp.title}</span> — {nextUpLabel(nextUp.daysUntil)}.
                </>
              ) : (
                "Nothing open across your active ambitions. Enjoy the momentum — or line up your next move."
              )}
            </p>
          </div>
        ) : (
          <MoveDetailProvider>
            {dueNow.map((item, index) => (
              <ActionQueueItem
                key={`${item.kind}-${item.id}`}
                id={item.id}
                kind={item.kind}
                title={item.title}
                description={item.description}
                date={item.date}
                ambitionId={item.ambitionId}
                ambitionName={item.ambitionName}
                daysUntil={item.daysUntil}
                isNextMove={index === 0}
              />
            ))}
            {upcomingCount > 0 ? (
              <p className="px-1 pt-1 text-xs text-muted-foreground">
                +{upcomingCount} more coming up — see &ldquo;Coming up&rdquo;.
              </p>
            ) : null}
          </MoveDetailProvider>
        )}
      </CardContent>
    </Card>
  );
}
