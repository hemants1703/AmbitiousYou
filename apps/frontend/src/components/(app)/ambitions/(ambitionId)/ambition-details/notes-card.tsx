"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@ambitiousyou/shared/types";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import NotesDrawer from "./notes-drawer";
import { createNoteAction } from "@/lib/actions/(app)/notes/create-note";

interface NotesCardProps {
  notes: Note[];
  ambitionId: string;
  ambitionName: string;
}

function formatNoteDate(dateValue: Date | string | null) {
  if (!dateValue) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateValue));
}

export default function NotesCard(props: NotesCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localNotes, setLocalNotes] = useState<Note[]>(props.notes);
  const [addingNote, setAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const newNoteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    (async () => setLocalNotes(props.notes))();
  }, [props.notes]);

  useEffect(() => {
    if (addingNote) newNoteRef.current?.focus();
  }, [addingNote]);

  function handleCreate() {
    const text = newNoteText.trim();
    if (!text) return;
    setError(null);

    const optimistic: Note = {
      id: crypto.randomUUID(),
      userId: "",
      ambitionId: props.ambitionId,
      note: text,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    startTransition(async () => {
      setLocalNotes((prev) => [optimistic, ...prev]);
      setNewNoteText("");
      setAddingNote(false);

      const result = await createNoteAction(props.ambitionId, text);
      if (result.error) {
        setError(result.error);
        setLocalNotes(props.notes);
      } else if (result.note) {
        setLocalNotes((prev) => prev.map((n) => (n.id === optimistic.id ? result.note! : n)));
        router.refresh();
      }
    });
  }

  const previewNotes = localNotes.slice(0, 2);

  return (
    <div className="space-y-3">
      {addingNote ? (
        <div className="rounded-2xl border border-primary/30 bg-background/50 p-4 space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">New note</p>
          <Textarea
            ref={newNoteRef}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="What should future-you remember about this ambition?"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCreate();
              if (e.key === "Escape") {
                setAddingNote(false);
                setNewNoteText("");
              }
            }}
          />
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" disabled={isPending || !newNoteText.trim()} onClick={handleCreate}>
              Save note
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => {
                setAddingNote(false);
                setNewNoteText("");
              }}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full rounded-2xl border-dashed"
          disabled={isPending}
          onClick={() => {
            setError(null);
            setAddingNote(true);
          }}>
          <PlusIcon className="size-4" />
          Add note
        </Button>
      )}

      {error && (
        <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {localNotes.length === 0 && !addingNote ? (
        <p className="rounded-2xl border border-border/60 p-3 text-sm text-muted-foreground">
          No notes yet. Hit <span className="font-medium text-foreground">Add note</span> to create the first one.
        </p>
      ) : (
        previewNotes.map((note) => (
          <div key={note.id} className="rounded-2xl border border-border/60 bg-background/50 p-3 text-sm space-y-1">
            <p className="line-clamp-3 wrap-break-word">{note.note}</p>
            <p className="text-xs text-muted-foreground">
              {note.updatedAt && note.createdAt && new Date(note.updatedAt).getTime() !== new Date(note.createdAt).getTime() ? `Updated ${formatNoteDate(note.updatedAt)}` : note.createdAt ? `Added ${formatNoteDate(note.createdAt)}` : ""}
            </p>
          </div>
        ))
      )}

      {localNotes.length > 0 && <NotesDrawer notes={localNotes} ambitionId={props.ambitionId} ambitionName={props.ambitionName} />}
    </div>
  );
}
