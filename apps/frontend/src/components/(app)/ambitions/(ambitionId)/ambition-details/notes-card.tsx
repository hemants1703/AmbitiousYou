"use client";

import { PendingButton } from "@/components/(app)/mutations/pending-button";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAmbitionNotes } from "@/lib/(app)/mutations/ambition-notes-context";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { HoverExpandButton } from "./hover-expand-button";

const NotesDrawer = dynamic(() => import("./notes-drawer"), {
  loading: () => <Skeleton className="h-10 w-full rounded-2xl" />,
});

interface NotesCardProps {
  ambitionName: string;
}

const NOTE_TINT = "border-yellow-400/40 bg-yellow-100/70 dark:border-yellow-400/15 dark:bg-yellow-400/10";

function formatNoteDate(dateValue: Date | string | null) {
  if (!dateValue) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateValue));
}

export default function NotesCard(props: NotesCardProps) {
  const notes = useAmbitionNotes();
  const [addingNote, setAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const newNoteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (addingNote) newNoteRef.current?.focus();
  }, [addingNote]);

  function handleCreate() {
    const text = newNoteText.trim();
    if (!text) return;
    notes.clearError();
    notes.create(text);
    setNewNoteText("");
    setAddingNote(false);
  }

  const previewNotes = notes.notes.slice(0, 5);

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Notes</CardTitle>
          <HoverExpandButton
            label="Add note"
            disabled={notes.isAnyPending}
            className="border border-yellow-400/40 bg-yellow-200 text-yellow-900 hover:bg-yellow-300 dark:border-yellow-400/20 dark:bg-yellow-400/20 dark:text-yellow-100 dark:hover:bg-yellow-400/30"
            onClick={() => {
              notes.clearError();
              setAddingNote(true);
            }}
          />
        </div>
        <CardDescription>Keep detailed context available without crowding the main execution view.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {addingNote ? (
          <div className="space-y-3 rounded-2xl border border-primary/30 dark:border-chart-1/30 bg-background/50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">New note</p>
            <Textarea
              ref={newNoteRef}
              value={newNoteText}
              onChange={(event) => setNewNoteText(event.target.value)}
              placeholder="Capture context, reflections, or reminders…"
              rows={3}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) handleCreate();
                if (event.key === "Escape") {
                  setAddingNote(false);
                  setNewNoteText("");
                }
              }}
            />
            <div className="flex items-center gap-2">
              <PendingButton type="button" size="sm" isPending={notes.isAnyPending} disabled={!newNoteText.trim()} onClick={handleCreate}>
                Save
              </PendingButton>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={notes.isAnyPending}
                onClick={() => {
                  setAddingNote(false);
                  setNewNoteText("");
                }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        {notes.error ? (
          <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {notes.error}
          </div>
        ) : null}

        {previewNotes.length > 0 ? (
          <div className="space-y-2">
            {previewNotes.map((note) => (
              <article key={note.id} className={`rounded-2xl border p-3 ${NOTE_TINT}`}>
                <p className="line-clamp-3 text-sm whitespace-pre-wrap wrap-anywhere">{note.note}</p>
                {note.createdAt ? <p className="mt-1 text-xs text-muted-foreground">Added {formatNoteDate(note.createdAt)}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border/60 p-3 text-sm text-muted-foreground">No notes yet. Add one when you need to capture extra context.</p>
        )}

        <NotesDrawer ambitionName={props.ambitionName} />
      </CardContent>
    </>
  );
}
