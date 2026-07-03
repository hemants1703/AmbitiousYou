"use client";

import { MoveDetailProvider } from "@/components/(app)/ambitions/move-detail-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { DayGroup } from "@/lib/dashboard/tracked-items";
import { CalendarCheckIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { ActionQueueItem } from "./action-queue-item";

interface MovesDrawerProps {
  /**
   * Content of the trigger button (count, label, icon, badge). The button itself is created here,
   * inside the client boundary, so radix's `asChild` Slot can attach its ref/handlers — passing a
   * server-rendered element as the trigger instead would break hydration.
   */
  triggerChildren: ReactNode;
  /** Trigger button visual variant (default "outline"). */
  triggerVariant?: ComponentProps<typeof Button>["variant"];
  /** Extra trigger button classes (gaps, alignment). */
  triggerClassName?: string;
  /** Accessible name for the trigger when its visible content is only a count/icon. */
  triggerLabel?: string;
  /** Sheet heading — names the window (e.g. "This week", "Tomorrow"). */
  title: string;
  /** Optional sub-line under the title (the date, or a one-line summary). */
  description?: string;
  /** Days to list. The week drawer passes the full 7-day groups; a per-day drawer passes one. */
  groups: DayGroup[];
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" });

/**
 * Right-side drawer that reveals the full set of upcoming moves hiding behind the "Coming up"
 * card — either every move for one day or all of the next seven days, grouped by day. Rows reuse
 * {@link ActionQueueItem} (inside their own {@link MoveDetailProvider}), so moves stay tickable and
 * openable exactly like the Today panel; completing one refreshes aggregates in the background while the
 * uncontrolled sheet stays open. ~45% width on desktop, full width below `lg`.
 */
export function MovesDrawer(props: MovesDrawerProps) {
  // Per-day drawers get a single group — the SheetHeader already names the day, so skip the in-body
  // day labels and only show them when several days are stacked together (the week view).
  const showDayHeaders = props.groups.length > 1;
  const isEmpty = props.groups.every((group) => group.items.length === 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={props.triggerVariant ?? "outline"} size="sm" className={props.triggerClassName} aria-label={props.triggerLabel}>
          {props.triggerChildren}
        </Button>
      </SheetTrigger>
      {/* Force the width past the primitive's w-3/4 + sm:max-w-sm (24rem) cap, which out-specifies plain utilities. */}
      <SheetContent side="right" className="w-full! max-w-none! lg:w-[45vw]!">
        <SheetHeader className="border-b border-border/60">
          <SheetTitle>{props.title}</SheetTitle>
          {props.description ? <SheetDescription>{props.description}</SheetDescription> : <SheetDescription className="sr-only">{props.title}</SheetDescription>}
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-6 py-5">
          {isEmpty ? (
            <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-muted/20 p-6 text-center">
              <CalendarCheckIcon className="size-6 text-muted-foreground/60" />
              <p className="text-sm font-medium">Nothing here</p>
              <p className="text-xs text-muted-foreground">No open moves in this window.</p>
            </div>
          ) : (
            <MoveDetailProvider>
              {props.groups.map((group) => (
                <section key={group.dateKey} className="space-y-2.5">
                  {showDayHeaders ? (
                    <div className="sticky top-0 z-10 -mx-6 flex items-center justify-between gap-2 border-b border-border/40 bg-popover px-6 pb-2">
                      <p className="text-sm font-semibold">{group.label}</p>
                      <p className="text-xs tabular-nums text-muted-foreground">{DATE_FORMATTER.format(group.items[0].date)}</p>
                    </div>
                  ) : null}

                  <div className="space-y-2.5">
                    {group.items.map((item) => (
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
                      />
                    ))}
                  </div>
                </section>
              ))}
            </MoveDetailProvider>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
