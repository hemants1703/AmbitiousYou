"use client";

import { emptyDraft, getDate, getDescription, getTitle, toDateInputValue, type DraftState, type TrackedItem } from "@/lib/(app)/tracked-item";
import { useState } from "react";
import { TrackedItemRow } from "./tracked-item-row";

interface TrackedItemListProps {
  items: TrackedItem[];
  noun: "task" | "milestone";
  isPending: boolean;
  disabledBefore: Date;
  onToggle: (item: TrackedItem) => void;
  onUpdate: (item: TrackedItem, draft: DraftState) => void;
  onDelete: (itemId: string) => void;
  emptyMessage: string;
}

/**
 * Renders a list of tracked-item rows and owns the per-row edit/delete UI state.
 * CRUD itself lives in the shared `useTrackedItems` hook (passed in as handlers),
 * so the inline preview and the management drawer stay in sync.
 */
export function TrackedItemList(props: TrackedItemListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftState>(emptyDraft);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function startEdit(item: TrackedItem) {
    setConfirmDeleteId(null);
    setEditingId(item.id);
    setEditDraft({ title: getTitle(item), description: getDescription(item), date: toDateInputValue(new Date(getDate(item))) });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(emptyDraft);
  }

  function saveEdit(item: TrackedItem) {
    props.onUpdate(item, editDraft);
    setEditingId(null);
    setEditDraft(emptyDraft);
  }

  if (props.items.length === 0) {
    return <p className="rounded-2xl border border-border/60 p-3 text-sm text-muted-foreground">{props.emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {props.items.map((item) => (
        <TrackedItemRow
          key={item.id}
          item={item}
          noun={props.noun}
          isEditing={editingId === item.id}
          isConfirmingDelete={confirmDeleteId === item.id}
          editDraft={editDraft}
          disabledBefore={props.disabledBefore}
          isPending={props.isPending}
          onToggle={() => props.onToggle(item)}
          onStartEdit={() => startEdit(item)}
          onEditChange={setEditDraft}
          onSaveEdit={() => saveEdit(item)}
          onCancelEdit={cancelEdit}
          onStartDelete={() => {
            setEditingId(null);
            setConfirmDeleteId(item.id);
          }}
          onConfirmDelete={() => {
            props.onDelete(item.id);
            setConfirmDeleteId(null);
          }}
          onCancelDelete={() => setConfirmDeleteId(null)}
        />
      ))}
    </div>
  );
}
