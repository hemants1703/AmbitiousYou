"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { emptyDraft, getDescription, getTitle, type DraftState, type TrackedItem } from "@/lib/(app)/tracked-item";
import type { UseTrackedItemsResult } from "@/lib/(app)/use-tracked-items";
import { FlagIcon, ListTodoIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { TrackedItemDraftEditor } from "./tracked-item-draft-editor";
import { TrackedItemList } from "./tracked-item-list";

const PAGE_SIZE = 50;

interface ExecutionBoardDrawerProps {
  board: UseTrackedItemsResult;
  ambitionName: string;
  disabledBefore: Date;
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
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<DraftState>(emptyDraft);

  const Icon = board.isTask ? ListTodoIcon : FlagIcon;
  const filteredOpen = filterItems(board.openItems, query);
  const filteredCompleted = filterItems(board.completedItems, query);
  const total = board.items.length;
  const triggerLabel = total > 0 ? `View all ${total} ${board.noun}s` : `Manage ${board.noun}s`;

  function resetWindows(nextQuery: string) {
    setQuery(nextQuery);
    setVisibleOpen(PAGE_SIZE);
    setVisibleCompleted(PAGE_SIZE);
  }

  function handleCreate() {
    board.create(newDraft);
    setNewDraft(emptyDraft);
    setAdding(false);
  }

  return (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full rounded-2xl">
          <Icon className="size-4" />
          {triggerLabel}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <Icon className="size-4" />
            {board.isTask ? "Tasks" : "Milestones"}
          </DrawerTitle>
          <DrawerDescription>
            Manage every {board.noun} for{" "}
            <span className="font-medium text-foreground" translate="no">
              {props.ambitionName}
            </span>
            .{board.isTask ? "" : " Milestones are marked reached once and can't be reopened."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-2">
          {board.error ? (
            <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {board.error}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" inputMode="search" aria-label={`Search ${board.noun}s`} placeholder={`Search ${board.noun}s…`} value={query} onChange={(event) => resetWindows(event.target.value)} className="pl-9" />
            </div>
            {!adding ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={board.isPending}
                onClick={() => {
                  board.clearError();
                  setAdding(true);
                }}>
                <PlusIcon className="size-4" />
                Add {board.noun}
              </Button>
            ) : null}
          </div>

          {adding ? (
            <TrackedItemDraftEditor
              label={`New ${board.noun}`}
              draft={newDraft}
              noun={board.noun}
              disabledBefore={props.disabledBefore}
              isPending={board.isPending}
              onChange={setNewDraft}
              onSubmit={handleCreate}
              onCancel={() => {
                setAdding(false);
                setNewDraft(emptyDraft);
              }}
            />
          ) : null}

          <Tabs defaultValue="open" className="flex min-h-0 flex-1 flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="open">
                Open
                <Badge variant="outline" className="tabular-nums">
                  {board.openItems.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                {board.isTask ? "Completed" : "Reached"}
                <Badge variant="outline" className="tabular-nums">
                  {board.completedItems.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="open" className="mt-3 min-h-0 space-y-3 overflow-y-auto overscroll-contain pr-1">
              <TrackedItemList
                items={filteredOpen.slice(0, visibleOpen)}
                noun={board.noun}
                isPending={board.isPending}
                disabledBefore={props.disabledBefore}
                onToggle={board.toggle}
                onUpdate={board.update}
                onDelete={board.remove}
                emptyMessage={query ? `No open ${board.noun}s match “${query}”.` : `No open ${board.noun}s.`}
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
                noun={board.noun}
                isPending={board.isPending}
                disabledBefore={props.disabledBefore}
                onToggle={board.toggle}
                onUpdate={board.update}
                onDelete={board.remove}
                emptyMessage={query ? `No ${board.isTask ? "completed" : "reached"} ${board.noun}s match “${query}”.` : `No ${board.isTask ? "completed" : "reached"} ${board.noun}s yet.`}
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
