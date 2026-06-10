"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { emptyDraft, sortByPriority, type DraftState, type TrackedItem } from "@/lib/(app)/tracked-item";
import { useTrackedItems } from "@/lib/(app)/use-tracked-items";
import type { Milestone, Task } from "@ambitiousyou/shared/types";
import { CheckCircle2Icon, ListChecksIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import type { Matcher } from "react-day-picker";
import { ExecutionBoardDrawer } from "./execution-board-drawer";
import { TrackedItemDraftEditor } from "./tracked-item-draft-editor";
import { TrackedItemList } from "./tracked-item-list";

const PREVIEW_LIMIT = 3;

interface ExecutionBoardProps {
  ambitionId: string;
  ambitionName: string;
  ambitionStartDate: Date | string;
  ambitionEndDate: Date | string;
  tasks: Task[];
  milestones: Milestone[];
}

export default function ExecutionBoard(props: ExecutionBoardProps) {
  const sourceItems: TrackedItem[] = [...props.tasks, ...props.milestones];
  const board = useTrackedItems({ ambitionId: props.ambitionId, sourceItems });

  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<DraftState>(emptyDraft);

  // Every move's date must stay inside the ambition's window — both when adding and editing.
  const dateDisabled: Matcher[] = [{ before: new Date(props.ambitionStartDate) }, { after: new Date(props.ambitionEndDate) }];

  const previewOpen = [...board.openItems].sort(sortByPriority).slice(0, PREVIEW_LIMIT);

  function handleCreate() {
    board.create(newDraft);
    setNewDraft(emptyDraft);
    setAdding(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ListChecksIcon className="size-4 text-foreground" />
              Execution Board
            </CardTitle>
            <CardDescription>Your moves toward this ambition — check off tasks and reach milestones as you go.</CardDescription>
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
              Add move
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {board.error ? (
          <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {board.error}
          </div>
        ) : null}

        {adding ? (
          <TrackedItemDraftEditor
            label="New move"
            draft={newDraft}
            dateDisabled={dateDisabled}
            isPending={board.isPending}
            onChange={setNewDraft}
            onSubmit={handleCreate}
            onCancel={() => {
              setAdding(false);
              setNewDraft(emptyDraft);
            }}
          />
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Up next</p>
            <Badge variant="outline" className="tabular-nums">
              {board.openItems.length} open
            </Badge>
          </div>

          <TrackedItemList
            items={previewOpen}
            isPending={board.isPending}
            dateDisabled={dateDisabled}
            onToggle={board.toggle}
            onUpdate={board.update}
            onDelete={board.remove}
            emptyMessage="No open moves right now. Add one to get moving."
          />

          {board.openItems.length > PREVIEW_LIMIT ? (
            <p className="text-xs text-muted-foreground">
              Showing the {PREVIEW_LIMIT} most urgent · {board.openItems.length - PREVIEW_LIMIT} more in &ldquo;View all&rdquo;.
            </p>
          ) : null}
        </div>

        <Separator />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2Icon className="size-4" />
          <span className="font-medium tabular-nums text-foreground">{board.completedItems.length}</span>
          completed
        </div>

        <ExecutionBoardDrawer board={board} ambitionName={props.ambitionName} dateDisabled={dateDisabled} />
      </CardContent>
    </Card>
  );
}
