"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { emptyDraft, sortByPriority, type DraftState, type TrackedItem, type TrackingMethod } from "@/lib/(app)/tracked-item";
import { useTrackedItems } from "@/lib/(app)/use-tracked-items";
import type { Milestone, Task } from "@ambitiousyou/shared/types";
import { CheckCircle2Icon, FlagIcon, ListTodoIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { ExecutionBoardDrawer } from "./execution-board-drawer";
import { TrackedItemDraftEditor } from "./tracked-item-draft-editor";
import { TrackedItemList } from "./tracked-item-list";

const PREVIEW_LIMIT = 5;

interface ExecutionBoardProps {
  ambitionId: string;
  ambitionName: string;
  trackingMethod: TrackingMethod;
  tasks: Task[];
  milestones: Milestone[];
}

export default function ExecutionBoard(props: ExecutionBoardProps) {
  const sourceItems: TrackedItem[] = props.trackingMethod === "task" ? props.tasks : props.milestones;
  const board = useTrackedItems({ ambitionId: props.ambitionId, trackingMethod: props.trackingMethod, sourceItems });

  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<DraftState>(emptyDraft);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const previewOpen = [...board.openItems].sort(sortByPriority).slice(0, PREVIEW_LIMIT);
  const Icon = board.isTask ? ListTodoIcon : FlagIcon;

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
              <Icon className="size-4 text-foreground" />
              Execution Board
            </CardTitle>
            <CardDescription>{board.isTask ? "Tasks are concrete steps you can check and uncheck as you go." : "Milestones are meaningful, one-time achievements — reaching one is permanent."}</CardDescription>
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
      </CardHeader>

      <CardContent className="space-y-5">
        {board.error ? (
          <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {board.error}
          </div>
        ) : null}

        {adding ? (
          <TrackedItemDraftEditor
            label={`New ${board.noun}`}
            draft={newDraft}
            noun={board.noun}
            disabledBefore={today}
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
            <p className="text-sm font-medium">{board.isTask ? "Up next" : "In progress"}</p>
            <Badge variant="outline" className="tabular-nums">
              {board.openItems.length} open
            </Badge>
          </div>

          <TrackedItemList
            items={previewOpen}
            noun={board.noun}
            isPending={board.isPending}
            disabledBefore={today}
            onToggle={board.toggle}
            onUpdate={board.update}
            onDelete={board.remove}
            emptyMessage={board.isTask ? "No open tasks right now. Add one to get moving." : "No open milestones right now. Add one to aim for."}
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
          {board.isTask ? "completed" : "reached"}
        </div>

        <ExecutionBoardDrawer board={board} ambitionName={props.ambitionName} disabledBefore={today} />
      </CardContent>
    </Card>
  );
}
