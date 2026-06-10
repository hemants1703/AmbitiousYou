"use client";

import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDate, getDaysUntil, getDescription, getKind, getTitle, MOVE_KIND_STYLE, toMoveDetail, type TrackedItem } from "@/lib/(app)/tracked-item";
import { cn } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import { useMoveDetail } from "@/components/(app)/ambitions/move-detail-context";

interface FocusNextCardProps {
  items: TrackedItem[];
}

/**
 * The prioritized "focus next" moves. Client-side so each card's title/description
 * opens the read-only detail dialog (a server component can't carry the click).
 * Cards keep their two-line clamp; the dialog is where the full text is read.
 */
export function FocusNextCard(props: FocusNextCardProps) {
  const moveDetail = useMoveDetail();

  if (props.items.length === 0) {
    return <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-300">You have no pending items. This ambition is in a strong position.</div>;
  }

  return (
    <>
      {props.items.map((item, index) => {
        const kind = getKind(item);
        const daysUntil = getDaysUntil(getDate(item));

        return (
          <div key={item.id} className={cn("rounded-3xl border border-border/60 border-l-4 bg-background/70 p-4", MOVE_KIND_STYLE[kind].stripe)}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <MoveKindBadge kind={kind} />
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Priority {index + 1}</p>
                </div>
                <button
                  type="button"
                  onClick={() => moveDetail.open(toMoveDetail(item))}
                  aria-label={`View details of ${kind}: ${getTitle(item)}`}
                  className="block w-full cursor-pointer space-y-1 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <p className="line-clamp-2 font-medium wrap-break-word">{getTitle(item)}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground wrap-break-word">{getDescription(item) || "No description provided."}</p>
                </button>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Badge variant="outline" className={cn("tabular-nums", daysUntil < 0 && "border-destructive/30 bg-destructive/10 text-destructive")}>
                  {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d left`}
                </Badge>
                <Button type="button" variant="ghost" size="icon" className="size-7 rounded-lg text-muted-foreground hover:text-foreground" aria-label={`View details of ${kind}`} onClick={() => moveDetail.open(toMoveDetail(item))}>
                  <EyeIcon className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
