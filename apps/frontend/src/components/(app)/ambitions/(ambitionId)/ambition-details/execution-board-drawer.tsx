"use client";

import { countOverdueMoves, paginateOpenMoveGroups } from "@/components/(app)/ambitions/move-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCloseOnActivityHide } from "@/lib/(app)/use-close-on-activity-hide";
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

interface WorkspaceBodyProps {
  board: UseTrackedItemsResult;
  dateDisabled: Matcher[];
  query: string;
  onQueryChange: (value: string) => void;
  filteredOpen: TrackedItem[];
  filteredCompleted: TrackedItem[];
  overdueCount: number;
  visibleOpen: number;
  visibleCompleted: number;
  onShowMoreOpen: () => void;
  onShowMoreCompleted: () => void;
  title: ReactNode;
  description: ReactNode;
  footer: ReactNode;
}

function WorkspaceBody(props: WorkspaceBodyProps) {
  const openGroups = paginateOpenMoveGroups(props.filteredOpen, props.visibleOpen);

  return (
    <div className="app-page flex min-h-0 flex-1 flex-col px-4 pb-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {props.title}
          {props.description}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium">
            <CircleDotIcon className="size-3.5 text-primary" aria-hidden="true" />
            <span className="tabular-nums">{props.filteredOpen.length}</span> open
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-200">
            <CheckCircle2Icon className="size-3.5" aria-hidden="true" />
            <span className="tabular-nums">{props.filteredCompleted.length}</span> done
          </span>
          {props.overdueCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/25 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
              <span className="tabular-nums">{props.overdueCount}</span> overdue
            </span>
          ) : null}
        </div>
      </div>

      {props.board.error ? (
        <div role="alert" aria-live="polite" className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {props.board.error}
        </div>
      ) : null}

      <div className="relative mt-4 mb-4">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          inputMode="search"
          aria-label="Search moves"
          placeholder="Search moves…"
          value={props.query}
          onChange={(event) => props.onQueryChange(event.target.value)}
          className="rounded-2xl pl-9"
        />
      </div>

      <div className="grid min-h-0 flex-1 gap-4 pb-2 lg:grid-cols-2 lg:gap-6">
        <MoveColumn title="In progress" icon={<CircleDotIcon className="size-4" />} count={props.filteredOpen.length} surfaceClassName="border-accent-brand/15 bg-accent-brand/5">
          {props.filteredOpen.length === 0 ? (
            <p className="rounded-2xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground">
              {props.query ? `No open moves match “${props.query}”.` : "Nothing open — add a move from the execution board to get started."}
            </p>
          ) : (
            openGroups.map((group) => (
              <div key={group.id} className="space-y-2">
                <p className={cn("text-xs font-medium uppercase tracking-[0.2em]", group.headerClass)}>{group.label}</p>
                <TrackedItemList
                  items={group.items}
                  isItemPending={props.board.isPending}
                  dateDisabled={props.dateDisabled}
                  onToggle={props.board.toggle}
                  onUpdate={props.board.update}
                  onDelete={props.board.remove}
                  emptyMessage=""
                />
              </div>
            ))
          )}
          {props.filteredOpen.length > props.visibleOpen ? (
            <Button type="button" variant="ghost" className="w-full rounded-2xl" onClick={props.onShowMoreOpen}>
              Show {Math.min(PAGE_SIZE, props.filteredOpen.length - props.visibleOpen)} more
            </Button>
          ) : null}
        </MoveColumn>

        <MoveColumn
          title="Wins"
          icon={<TrophyIcon className="size-4" />}
          count={props.filteredCompleted.length}
          headerClassName="text-emerald-700 dark:text-emerald-300"
          surfaceClassName="border-emerald-500/20 bg-emerald-500/5">
          <TrackedItemList
            items={props.filteredCompleted.slice(0, props.visibleCompleted)}
            isItemPending={props.board.isPending}
            dateDisabled={props.dateDisabled}
            onToggle={props.board.toggle}
            onUpdate={props.board.update}
            onDelete={props.board.remove}
            emptyMessage={props.query ? `No completed moves match “${props.query}”.` : "No wins logged yet — your first completion will show up here."}
          />
          {props.filteredCompleted.length > props.visibleCompleted ? (
            <Button type="button" variant="ghost" className="w-full rounded-2xl" onClick={props.onShowMoreCompleted}>
              Show {Math.min(PAGE_SIZE, props.filteredCompleted.length - props.visibleCompleted)} more
            </Button>
          ) : null}
        </MoveColumn>
      </div>

      {props.footer}
    </div>
  );
}

export function ExecutionBoardDrawer(props: ExecutionBoardDrawerProps) {
  const { board } = props;
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [visibleOpen, setVisibleOpen] = useState(PAGE_SIZE);
  const [visibleCompleted, setVisibleCompleted] = useState(PAGE_SIZE);

  useCloseOnActivityHide(() => setOpen(false));

  const filteredOpen = filterItems(board.openItems, query);
  const filteredCompleted = filterItems(board.completedItems, query);
  const overdueCount = countOverdueMoves(filteredOpen);
  const total = board.items.length;
  const triggerLabel = total > 0 ? `Open move workspace · ${total}` : "Open move workspace";

  function resetSearch(nextQuery: string) {
    setQuery(nextQuery);
    setVisibleOpen(PAGE_SIZE);
    setVisibleCompleted(PAGE_SIZE);
  }

  const bodyProps: Omit<WorkspaceBodyProps, "title" | "description" | "footer"> = {
    board,
    dateDisabled: props.dateDisabled,
    query,
    onQueryChange: resetSearch,
    filteredOpen,
    filteredCompleted,
    overdueCount,
    visibleOpen,
    visibleCompleted,
    onShowMoreOpen: () => setVisibleOpen((count) => count + PAGE_SIZE),
    onShowMoreCompleted: () => setVisibleCompleted((count) => count + PAGE_SIZE),
  };

  const trigger = (
    <Button type="button" variant="outline" className="w-full rounded-2xl" onClick={() => setOpen(true)}>
      <ListChecksIcon className="size-4" />
      {triggerLabel}
    </Button>
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" showCloseButton={false} className="max-h-[92vh] gap-0 overflow-hidden rounded-t-4xl p-0">
            <WorkspaceBody
              {...bodyProps}
              title={
                <SheetHeader className="gap-1 p-0 text-left">
                  <SheetTitle className="flex items-center gap-2 text-lg">
                    <ListChecksIcon className="size-5" />
                    Move workspace
                  </SheetTitle>
                </SheetHeader>
              }
              description={
                <SheetDescription className="mt-1 text-left">
                  Every task and milestone for{" "}
                  <span className="font-medium text-foreground" translate="no">
                    {props.ambitionName}
                  </span>
                  . Work through what&apos;s open, celebrate what&apos;s done.
                </SheetDescription>
              }
              footer={
                <SheetFooter className="mt-4 flex-row items-center gap-2 px-0 pb-2">
                  <p className="mr-auto hidden text-xs text-muted-foreground sm:block">Tasks can be unchecked; milestones stay reached once marked.</p>
                  <SheetClose asChild>
                    <Button variant="outline" className="rounded-2xl">
                      Close workspace
                    </Button>
                  </SheetClose>
                </SheetFooter>
              }
            />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <>
      {trigger}
      <Drawer direction="top" open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[92vh]">
          <WorkspaceBody
            {...bodyProps}
            title={
              <DrawerHeader className="gap-0 p-0 text-left">
                <DrawerTitle className="flex items-center gap-2 text-lg">
                  <ListChecksIcon className="size-5" />
                  Move workspace
                </DrawerTitle>
              </DrawerHeader>
            }
            description={
              <DrawerDescription className="mt-1 text-left">
                Every task and milestone for{" "}
                <span className="font-medium text-foreground" translate="no">
                  {props.ambitionName}
                </span>
                . Work through what&apos;s open, celebrate what&apos;s done.
              </DrawerDescription>
            }
            footer={
              <DrawerFooter className="mt-4 flex-row items-center gap-2 px-0">
                <p className="mr-auto hidden text-xs text-muted-foreground lg:block">Tasks can be unchecked; milestones stay reached once marked.</p>
                <DrawerClose asChild>
                  <Button variant="outline" className="rounded-2xl">
                    Close workspace
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            }
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}
