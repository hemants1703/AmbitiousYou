import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDaysUntil } from "@/lib/dashboard/tracked-items";
import type { Ambition } from "@ambitiousyou/shared/types";
import { ChevronRightIcon, RotateCcwIcon } from "lucide-react";
import Link from "next/link";

interface ReviveMissedProps {
  ambitions: Ambition[];
}

const MAX_VISIBLE = 4;

/**
 * Ambitions whose deadline passed while still incomplete are flipped to `missed` by the
 * backend and drop out of every "active" surface — so without this they'd silently vanish.
 * This band keeps them visible with a gentle, non-punishing nudge to reschedule or finish
 * what's left, instead of letting a goal quietly die. Renders nothing when there are none.
 */
export function ReviveMissed(props: ReviveMissedProps) {
  if (props.ambitions.length === 0) return null;

  const visible = props.ambitions.slice(0, MAX_VISIBLE);
  const remaining = props.ambitions.length - visible.length;

  return (
    <Card className="border-amber-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcwIcon className="size-4 text-amber-600 dark:text-amber-400" />
          Don&apos;t let these slip away
        </CardTitle>
        <CardDescription>These ambitions passed their deadline. Reschedule them or finish what&apos;s left — they&apos;re not lost.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-2.5 sm:grid-cols-2">
        {visible.map((ambition) => {
          const daysOver = Math.abs(getDaysUntil(ambition.ambitionEndDate));
          const progress = ambition.ambitionPercentageCompleted ?? 0;

          return (
            <Link
              key={ambition.id}
              href={`/ambitions/${ambition.id}?ref=dashboard`}
              prefetch
              className="flex items-center gap-3 rounded-2xl border border-amber-500/20 p-3 transition-colors hover:bg-amber-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium" translate="no">
                  {ambition.ambitionName}
                </p>
                <p className="truncate text-sm text-muted-foreground tabular-nums">
                  Deadline passed {daysOver}{daysOver === 1 ? " day" : " days"} ago · {progress}% done
                </p>
              </div>
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Link>
          );
        })}

        {remaining > 0 ? <p className="px-1 text-xs text-muted-foreground sm:col-span-2">+{remaining} more past their deadline</p> : null}
      </CardContent>
    </Card>
  );
}
