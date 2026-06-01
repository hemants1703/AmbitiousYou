import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { QueueItem } from "@/lib/dashboard/tracked-items";
import { ArrowRightIcon, CheckCircle2Icon, ListChecksIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { ActionQueueItem } from "./action-queue-item";

interface ActionQueueProps {
  /** Already urgency-sorted and sliced to the display limit. */
  items: QueueItem[];
  totalOpen: number;
  /** True when every ambition's details failed to load (vs genuinely empty). */
  loadFailed: boolean;
}

export function ActionQueue(props: ActionQueueProps) {
  const remaining = props.totalOpen - props.items.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecksIcon className="size-4 text-primary" />
          Your next moves
        </CardTitle>
        <CardDescription>The most urgent open work across every ambition — soonest deadlines first.</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/ambitions" prefetch>
              All ambitions
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {props.loadFailed ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-muted/20 p-6 text-center">
            <RefreshCwIcon className="size-6 text-muted-foreground/60" />
            <p className="font-medium">We couldn&apos;t load your action items</p>
            <p className="text-sm text-muted-foreground">Please refresh the page in a moment.</p>
          </div>
        ) : props.items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2Icon className="size-8 text-emerald-600 dark:text-emerald-400" />
            <p className="font-medium text-foreground">You&apos;re all caught up</p>
            <p className="text-sm text-muted-foreground">No open work due across your active ambitions. Enjoy the momentum — or line up something new.</p>
          </div>
        ) : (
          <>
            {props.items.map((item, index) => (
              <ActionQueueItem
                key={`${item.kind}-${item.id}`}
                id={item.id}
                kind={item.kind}
                title={item.title}
                description={item.description}
                ambitionId={item.ambitionId}
                ambitionName={item.ambitionName}
                daysUntil={item.daysUntil}
                isNextMove={index === 0}
              />
            ))}
            {remaining > 0 ? (
              <p className="px-1 pt-1 text-xs text-muted-foreground">
                +{remaining} more open {remaining === 1 ? "item" : "items"} across your ambitions
              </p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
