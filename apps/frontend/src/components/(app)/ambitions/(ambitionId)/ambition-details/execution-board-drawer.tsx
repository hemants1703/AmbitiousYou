"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDescription, getTitle, type TrackedItem } from "@/lib/(app)/tracked-item";
import type { UseTrackedItemsResult } from "@/lib/(app)/use-tracked-items";
import { ListChecksIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
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

export function ExecutionBoardDrawer(props: ExecutionBoardDrawerProps) {
  const { board } = props;
  const [query, setQuery] = useState("");
  const [visibleOpen, setVisibleOpen] = useState(PAGE_SIZE);
  const [visibleCompleted, setVisibleCompleted] = useState(PAGE_SIZE);

  const filteredOpen = filterItems(board.openItems, query);
  const filteredCompleted = filterItems(board.completedItems, query);
  const total = board.items.length;
  const triggerLabel = total > 0 ? `View all ${total} moves` : "Manage moves";

  function resetWindows(nextQuery: string) {
    setQuery(nextQuery);
    setVisibleOpen(PAGE_SIZE);
    setVisibleCompleted(PAGE_SIZE);
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          <ListChecksIcon className="size-4" />
          {triggerLabel}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh] w-[80vw]!">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <ListChecksIcon className="size-4" />
            Moves
          </DrawerTitle>
          <DrawerDescription>
            Manage every move for{" "}
            <span className="font-medium text-foreground" translate="no">
              {props.ambitionName}
            </span>
            . Tasks can be checked and unchecked; milestones are marked reached once and can&rsquo;t be reopened.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-2">
          {board.error ? (
            <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {board.error}
            </div>
          ) : null}

          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" inputMode="search" aria-label="Search moves" placeholder="Search moves…" value={query} onChange={(event) => resetWindows(event.target.value)} className="pl-9" />
          </div>

          <Tabs defaultValue="open" className="flex min-h-0 flex-1 flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="open">
                Open
                <Badge variant="outline" className="tabular-nums">
                  {board.openItems.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
                <Badge variant="outline" className="tabular-nums">
                  {board.completedItems.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="open" className="mt-3 min-h-0 space-y-3 overflow-y-auto overscroll-contain pr-1">
              <TrackedItemList
                items={filteredOpen.slice(0, visibleOpen)}
                isPending={board.isPending}
                dateDisabled={props.dateDisabled}
                onToggle={board.toggle}
                onUpdate={board.update}
                onDelete={board.remove}
                emptyMessage={query ? `No open moves match “${query}”.` : "No open moves."}
              />
              {filteredOpen.length > visibleOpen ? (
                <Button type="button" variant="ghost" className="w-full" onClick={() => setVisibleOpen((count) => count + PAGE_SIZE)}>
                  Show {Math.min(PAGE_SIZE, filteredOpen.length - visibleOpen)} more
                </Button>
              ) : null}
            </TabsContent>

            <TabsContent value="completed" className="mt-3 min-h-0 space-y-3 overflow-y-auto overscroll-contain pr-1">
              <TrackedItemList
                items={filteredCompleted.slice(0, visibleCompleted)}
                isPending={board.isPending}
                dateDisabled={props.dateDisabled}
                onToggle={board.toggle}
                onUpdate={board.update}
                onDelete={board.remove}
                emptyMessage={query ? `No completed moves match “${query}”.` : "No completed moves yet."}
              />
              {filteredCompleted.length > visibleCompleted ? (
                <Button type="button" variant="ghost" className="w-full" onClick={() => setVisibleCompleted((count) => count + PAGE_SIZE)}>
                  Show {Math.min(PAGE_SIZE, filteredCompleted.length - visibleCompleted)} more
                </Button>
              ) : null}
            </TabsContent>
          </Tabs>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
