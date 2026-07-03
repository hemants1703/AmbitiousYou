"use client";

import { countOverdueMoves, paginateOpenMoveGroups } from "@/components/(app)/ambitions/move-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { getDescription, getTitle, type TrackedItem } from "@/lib/(app)/tracked-item";
import type { UseTrackedItemsResult } from "@/lib/(app)/use-tracked-items";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon, CircleDotIcon, ListChecksIcon, SearchIcon, TrophyIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Matcher } from "react-day-picker";
import { TrackedItemList } from "./tracked-item-list";

const PAGE_SIZE = 50;

interface ExecutionBoardDrawerProps {
  board: UseTrackedItemsResult;
  ambitionName: string;
  dateDisabled: Matcher[];
}

function filterItems(items: TrackedItem[], query: string): TrackedItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) => getTitle(item).toLowerCase().includes(normalized) || getDescription(item).toLowerCase().includes(normalized));
}

interface MoveColumnProps {
  title: string;
  icon: ReactNode;
  count: number;
  headerClassName?: string;
  surfaceClassName?: string;
  children: ReactNode;
}

function MoveColumn(props: MoveColumnProps) {
  return (
    <section className={cn("flex min-h-0 flex-col rounded-3xl border p-4", props.surfaceClassName ?? "border-border/60 bg-muted/10")}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className={cn("flex items-center gap-2 text-sm font-semibold", props.headerClassName)}>
          {props.icon}
          {props.title}
        </div>
        <Badge variant="outline" className="tabular-nums">
          {props.count}
        </Badge>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-1">{props.children}</div>
    </section>
  );
}

export function ExecutionBoardDrawer(props: ExecutionBoardDrawerProps) {
  const { board } = props;
  const [query, setQuery] = useState("");
  const [visibleOpen, setVisibleOpen] = useState(PAGE_SIZE);
  const [visibleCompleted, setVisibleCompleted] = useState(PAGE_SIZE);

  const filteredOpen = filterItems(board.openItems, query);
  const filteredCompleted = filterItems(board.completedItems, query);
  const openGroups = paginateOpenMoveGroups(filteredOpen, visibleOpen);
  const overdueCount = countOverdueMoves(filteredOpen);
  const total = board.items.length;
  const triggerLabel = total > 0 ? `Open move workspace · ${total}` : "Open move workspace";

  function resetSearch(nextQuery: string) {
    setQuery(nextQuery);
    setVisibleOpen(PAGE_SIZE);
    setVisibleCompleted(PAGE_SIZE);
  }

  return (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full rounded-2xl">
          <ListChecksIcon className="size-4" />
          {triggerLabel}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[92vh]">
        <div className="mx-auto flex w-full max-w-350 min-h-0 flex-1 flex-col px-4 pb-2">
          <DrawerHeader className="gap-4 px-0 pt-2 text-left">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <DrawerTitle className="flex items-center gap-2 text-lg">
                  <ListChecksIcon className="size-5" />
                  Move workspace
                </DrawerTitle>
                <DrawerDescription className="mt-1">
                  Every task and milestone for{" "}
                  <span className="font-medium text-foreground" translate="no">
                    {props.ambitionName}
                  </span>
                  . Work through what&apos;s open, celebrate what&apos;s done.
                </DrawerDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium">
                  <CircleDotIcon className="size-3.5 text-primary" aria-hidden="true" />
                  <span className="tabular-nums">{filteredOpen.length}</span> open
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2Icon className="size-3.5" aria-hidden="true" />
                  <span className="tabular-nums">{filteredCompleted.length}</span> done
                </span>
                {overdueCount > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/25 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                    <span className="tabular-nums">{overdueCount}</span> overdue
                  </span>
                ) : null}
              </div>
            </div>
          </DrawerHeader>

          {board.error ? (
            <div role="alert" aria-live="polite" className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {board.error}
            </div>
          ) : null}

          <div className="relative mb-4">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" inputMode="search" aria-label="Search moves" placeholder="Search moves…" value={query} onChange={(event) => resetSearch(event.target.value)} className="rounded-2xl pl-9" />
          </div>

          <div className="grid min-h-0 flex-1 gap-4 pb-2 lg:grid-cols-2 lg:gap-6">
            <MoveColumn title="In progress" icon={<CircleDotIcon className="size-4" />} count={filteredOpen.length} surfaceClassName="border-primary/15 bg-primary/5 dark:border-chart-1/15 dark:bg-chart-1/5">
              {filteredOpen.length === 0 ? (
                <p className="rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
                  {query ? `No open moves match “${query}”.` : "Nothing open — add a move from the execution board to get started."}
                </p>
              ) : (
                openGroups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <p className={cn("text-xs font-medium uppercase tracking-[0.2em]", group.headerClass)}>{group.label}</p>
                    <TrackedItemList
                      items={group.items}
                      isItemPending={board.isPending}
                      dateDisabled={props.dateDisabled}
                      onToggle={board.toggle}
                      onUpdate={board.update}
                      onDelete={board.remove}
                      emptyMessage=""
                    />
                  </div>
                ))
              )}
              {filteredOpen.length > visibleOpen ? (
                <Button type="button" variant="ghost" className="w-full rounded-2xl" onClick={() => setVisibleOpen((count) => count + PAGE_SIZE)}>
                  Show {Math.min(PAGE_SIZE, filteredOpen.length - visibleOpen)} more
                </Button>
              ) : null}
            </MoveColumn>

            <MoveColumn
              title="Wins"
              icon={<TrophyIcon className="size-4" />}
              count={filteredCompleted.length}
              headerClassName="text-emerald-700 dark:text-emerald-300"
              surfaceClassName="border-emerald-500/20 bg-emerald-500/5">
              <TrackedItemList
                items={filteredCompleted.slice(0, visibleCompleted)}
                isItemPending={board.isPending}
                dateDisabled={props.dateDisabled}
                onToggle={board.toggle}
                onUpdate={board.update}
                onDelete={board.remove}
                emptyMessage={query ? `No completed moves match “${query}”.` : "No wins logged yet — your first completion will show up here."}
              />
              {filteredCompleted.length > visibleCompleted ? (
                <Button type="button" variant="ghost" className="w-full rounded-2xl" onClick={() => setVisibleCompleted((count) => count + PAGE_SIZE)}>
                  Show {Math.min(PAGE_SIZE, filteredCompleted.length - visibleCompleted)} more
                </Button>
              ) : null}
            </MoveColumn>
          </div>

          <DrawerFooter className="px-0">
            <p className="mr-auto hidden text-xs text-muted-foreground lg:block">Tasks can be unchecked; milestones stay reached once marked.</p>
            <DrawerClose asChild>
              <Button variant="outline" className="rounded-2xl">
                Close workspace
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
