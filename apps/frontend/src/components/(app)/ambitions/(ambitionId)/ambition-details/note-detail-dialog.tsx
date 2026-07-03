"use client";

import { DetailActionsMenu } from "@/components/(app)/detail-actions-menu";
import { PendingButton } from "@/components/(app)/mutations/pending-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAmbitionNotes } from "@/lib/(app)/mutations/ambition-notes-context";
import type { Note } from "@ambitiousyou/shared/types";
import { cn } from "@/lib/utils";
import { NotebookPenIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NOTE_SURFACE, noteTimestamp, splitNoteHeadline } from "./note-display";

interface NoteDetailDialogProps {
  note: Note | null;
  ambitionName: string;
  onOpenChange: (open: boolean) => void;
}

type DialogMode = "read" | "edit" | "delete";

export function NoteDetailDialog(props: NoteDetailDialogProps) {
  const notes = useAmbitionNotes();
  const [mode, setMode] = useState<DialogMode>("read");
  const [editingText, setEditingText] = useState("");
  const editingRef = useRef<HTMLTextAreaElement>(null);
  const note = props.note;
  const isPending = note ? notes.isPending(note.id) : false;

  useEffect(() => {
    if (!props.note) {
      setMode("read");
      setEditingText("");
      return;
    }
    setMode("read");
    setEditingText(props.note.note);
  }, [props.note]);

  useEffect(() => {
    if (mode === "edit") editingRef.current?.focus();
  }, [mode]);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setMode("read");
      setEditingText("");
    }
    props.onOpenChange(open);
  }

  function handleStartEdit() {
    if (!note) return;
    setEditingText(note.note);
    setMode("edit");
  }

  function handleSave() {
    if (!note) return;
    const text = editingText.trim();
    if (!text) return;
    notes.clearError();
    notes.update(note.id, text);
    setMode("read");
  }

  function handleDelete() {
    if (!note) return;
    notes.clearError();
    notes.remove(note.id);
    handleOpenChange(false);
  }

  if (!note) {
    return <Dialog open={false} onOpenChange={handleOpenChange} />;
  }

  const { headline, body } = splitNoteHeadline(note.note);
  const timestamp = noteTimestamp(note);

  return (
    <Dialog open={note !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg" showCloseButton={false}>
        <div className={cn("relative border-b px-6 pt-6 pb-4", NOTE_SURFACE)}>
          <div className="absolute top-4 right-4">
            <DetailActionsMenu disabled={isPending} onEdit={handleStartEdit} onDelete={() => setMode("delete")} editLabel="Edit note" deleteLabel="Delete note" />
          </div>

          <DialogHeader className="border-l-4 border-yellow-500/70 pr-10 pl-3 dark:border-yellow-400/50">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <NotebookPenIcon className="size-3.5" aria-hidden="true" />
              Note
            </div>
            {mode === "read" ? (
              <>
                {headline ? <DialogTitle className="wrap-anywhere">{headline}</DialogTitle> : <DialogTitle className="sr-only">Note</DialogTitle>}
                <DialogDescription>
                  Context for{" "}
                  <Link
                    prefetch
                    href={`/ambitions/${note.ambitionId}`}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                    translate="no"
                    onClick={() => handleOpenChange(false)}>
                    {props.ambitionName}
                  </Link>
                </DialogDescription>
              </>
            ) : mode === "edit" ? (
              <>
                <DialogTitle>Editing note</DialogTitle>
                <DialogDescription>Changes save to this ambition&apos;s notes.</DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle className="text-destructive">Delete this note?</DialogTitle>
                <DialogDescription>This cannot be undone.</DialogDescription>
              </>
            )}
          </DialogHeader>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 py-4">
          {notes.error ? (
            <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {notes.error}
            </div>
          ) : null}

          {mode === "read" ? (
            <div className="max-h-[min(50vh,24rem)] overflow-y-auto overscroll-contain pr-1">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground wrap-anywhere">{headline ? body : note.note}</p>
            </div>
          ) : null}

          {mode === "edit" ? (
            <Textarea
              ref={editingRef}
              value={editingText}
              onChange={(event) => setEditingText(event.target.value)}
              rows={8}
              className="min-h-[12rem] resize-y text-base"
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) handleSave();
                if (event.key === "Escape") setMode("read");
              }}
            />
          ) : null}

          {mode === "delete" ? (
            <div className={cn("rounded-2xl border p-4", NOTE_SURFACE)}>
              <p className="text-sm whitespace-pre-wrap wrap-anywhere">{note.note}</p>
            </div>
          ) : null}

          {mode === "read" && timestamp ? <p className="text-xs text-muted-foreground">{timestamp}</p> : null}
        </div>

        <DialogFooter className="border-t bg-muted/20 px-6 py-4">
          {mode === "edit" ? (
            <>
              <PendingButton type="button" size="sm" isPending={isPending} disabled={!editingText.trim()} onClick={handleSave}>
                Save
              </PendingButton>
              <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => setMode("read")}>
                Cancel
              </Button>
            </>
          ) : mode === "delete" ? (
            <>
              <PendingButton type="button" variant="destructive" size="sm" isPending={isPending} onClick={handleDelete}>
                <Trash2Icon className="size-3.5" />
                Yes, delete
              </PendingButton>
              <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => setMode("read")}>
                Cancel
              </Button>
            </>
          ) : (
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Close
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
