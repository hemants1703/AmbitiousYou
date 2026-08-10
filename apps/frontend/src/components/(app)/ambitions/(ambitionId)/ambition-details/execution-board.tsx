"use client";

import { countOverdueMoves } from "@/components/(app)/ambitions/move-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfDay } from "@/lib/(app)/ambition-window";
import { emptyDraft, sortByPriority, type DraftState, type TrackedItem } from "@/lib/(app)/tracked-item";
import { useTrackedItems } from "@/lib/(app)/use-tracked-items";
import type { Milestone, Task } from "@ambitiousyou/shared/types";
import { CalendarClockIcon, ListChecksIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Matcher } from "react-day-picker";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { HoverExpandButton } from "./hover-expand-button";
import { MoveTelemetry } from "./move-telemetry";
import { TrackedItemDraftEditor } from "./tracked-item-draft-editor";
import { TrackedItemList } from "./tracked-item-list";

const PREVIEW_LIMIT = 3;

const ExecutionBoardDrawer = dynamic(() => import("./execution-board-drawer").then((mod) => mod.ExecutionBoardDrawer), {
  loading: () => <Skeleton className="h-10 w-full rounded-2xl" />,
});

interface ExecutionBoardProps {
  ambitionId: string;
  ambitionName: string;
  ambitionStatus: "active" | "completed" | "missed";
  ambitionStartDate: Date | string;
  ambitionEndDate: Date | string;
  tasks: Task[];
  milestones: Milestone[];
}

function isAddMoveBlocked(status: ExecutionBoardProps["ambitionStatus"], endDate: Date | string) {
  if (status === "completed") return false;
  if (status === "missed") return true;
  return startOfDay(endDate).getTime() < startOfDay(new Date()).getTime();
}

export default function ExecutionBoard(props: ExecutionBoardProps) {
  const sourceItems = useMemo(() => [...props.tasks, ...props.milestones] as TrackedItem[], [props.tasks, props.milestones]);
  const board = useTrackedItems({ ambitionId: props.ambitionId, sourceItems });

  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<DraftState>(emptyDraft);

  const addBlocked = isAddMoveBlocked(props.ambitionStatus, props.ambitionEndDate);
  const editHref = `/ambitions/${props.ambitionId}/edit`;

  // Every move's date must stay inside the ambition's window — both when adding and editing.
  const dateDisabled: Matcher[] = [{ before: new Date(props.ambitionStartDate) }, { after: new Date(props.ambitionEndDate) }];

  const previewOpen = [...board.openItems].sort(sortByPriority).slice(0, PREVIEW_LIMIT);
  const overdueCount = countOverdueMoves(board.openItems);
  const emptyOpenMessage =
    board.completedItems.length > 0
      ? "No open moves right now — this ambition is in a strong position."
      : "No open moves yet. Add one to get moving.";

  function handleCreate() {
    board.create(newDraft);
    setNewDraft(emptyDraft);
    setAdding(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <ListChecksIcon className="size-4 text-foreground" />
            Execution Board
          </CardTitle>
          {!adding && !addBlocked ? (
            <HoverExpandButton
              label="Add move"
              disabled={board.isAnyPending}
              onClick={() => {
                board.clearError();
                setAdding(true);
              }}
            />
          ) : null}
        </div>
        <CardDescription>Work through what matters first — tick moves off and open the workspace for everything else.</CardDescription>
        <MoveTelemetry open={board.openItems.length} completed={board.completedItems.length} overdue={overdueCount} className="pt-1" />
      </CardHeader>

      <CardContent className="space-y-5">
        {addBlocked ? (
          <div
            role="status"
            className="flex flex-col gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-2.5">
              <CalendarClockIcon className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium text-amber-950 dark:text-amber-100">Window closed — new moves are paused</p>
                <p className="text-sm text-amber-900/80 dark:text-amber-100/80">
                  Extend the end date to reopen this ambition. Each extension is logged on the edit page so you stay accountable.
                </p>
              </div>
            </div>
            <Link
              prefetch={true}
              href={editHref}
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-amber-600/30 bg-background/80 px-3.5 py-1.5 text-sm font-medium text-foreground transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              Extend end date
            </Link>
          </div>
        ) : null}

        {board.error ? (
          <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {board.error}
          </div>
        ) : null}

        {adding && !addBlocked ? (
          <TrackedItemDraftEditor
            label="New move"
            draft={newDraft}
            dateDisabled={dateDisabled}
            isPending={board.isAnyPending}
            onChange={setNewDraft}
            onSubmit={handleCreate}
            onCancel={() => {
              setAdding(false);
              setNewDraft(emptyDraft);
            }}
          />
        ) : null}

        <div className="space-y-3">
          {board.openItems.length > 0 ? <p className="text-sm font-medium">Up next</p> : null}

          <TrackedItemList
            items={previewOpen}
            isItemPending={board.isPending}
            dateDisabled={dateDisabled}
            onToggle={board.toggle}
            onUpdate={board.update}
            onDelete={board.remove}
            emptyMessage={emptyOpenMessage}
            emptyClassName={board.completedItems.length > 0 ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300" : undefined}
          />

          {board.openItems.length > PREVIEW_LIMIT ? (
            <p className="text-xs text-muted-foreground">
              {`Showing the ${PREVIEW_LIMIT} most urgent · ${board.openItems.length - PREVIEW_LIMIT} more in the workspace.`}
            </p>
          ) : null}
        </div>

        <ExecutionBoardDrawer board={board} ambitionName={props.ambitionName} dateDisabled={dateDisabled} />
      </CardContent>
    </Card>
  );
}
