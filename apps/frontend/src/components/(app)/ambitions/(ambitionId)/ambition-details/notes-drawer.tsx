"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { deleteNoteAction } from "@/lib/actions/(app)/notes/delete-note";
import { updateNoteAction } from "@/lib/actions/(app)/notes/update-note";
import type { Note } from "@ambitiousyou/shared/types";
import { BookOpenTextIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

interface NotesDrawerProps {
  notes: Note[];
  ambitionId: string;
  ambitionName: string;
}

function formatNoteDate(dateValue: Date | string | null) {
  if (!dateValue) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateValue));
}

export default function NotesDrawer(props: NotesDrawerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localNotes, setLocalNotes] = useState<Note[]>(props.notes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editingRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    (async () => setLocalNotes(props.notes))();
  }, [props.notes]);

  useEffect(() => {
    if (editingId) editingRef.current?.focus();
  }, [editingId]);

  function handleStartEdit(note: Note) {
    setConfirmDeleteId(null);
    setEditingId(note.id);
    setEditingText(note.note);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  function handleStartDelete(noteId: string) {
    setEditingId(null);
    setConfirmDeleteId(noteId);
  }

  function handleCancelDelete() {
    setConfirmDeleteId(null);
  }

  function handleUpdate(noteId: string) {
    const text = editingText.trim();
    if (!text) return;
    setError(null);

    const snapshotNotes = localNotes;

    startTransition(async () => {
      setLocalNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, note: text, updatedAt: new Date() } : n)));
      setEditingId(null);
      setEditingText("");

      try {
        const result = await updateNoteAction(noteId, text);
        if (result.error) {
          setError(result.error);
          setLocalNotes(snapshotNotes);
        } else {
          router.refresh();
        }
      } catch {
        setError("Failed to update note. Please try again.");
        setLocalNotes(snapshotNotes);
      }
    });
  }

  function handleDelete(noteId: string) {
    setError(null);

    const snapshotNotes = localNotes;

    startTransition(async () => {
      setLocalNotes((prev) => prev.filter((n) => n.id !== noteId));
      setConfirmDeleteId(null);

      try {
        const result = await deleteNoteAction(noteId);
        if (result.error) {
          setError(result.error);
          setLocalNotes(snapshotNotes);
        } else {
          router.refresh();
        }
      } catch {
        setError("Failed to delete note. Please try again.");
        setLocalNotes(snapshotNotes);
      }
    });
  }

  const triggerLabel = localNotes.length > 5 ? `View all ${localNotes.length} notes` : "Manage notes";

  return (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full rounded-2xl">
          <BookOpenTextIcon className="size-4" />
          {triggerLabel}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex flex-row items-start justify-between gap-4 text-left">
          <div className="min-w-0">
            <DrawerTitle className="flex items-center gap-2">
              All notes
              {localNotes.length > 0 && (
                <Badge variant="outline" className="text-xs tabular-nums">
                  {localNotes.length}
                </Badge>
              )}
            </DrawerTitle>
            <DrawerDescription className="mt-0.5">
              Context and reflections for{" "}
              <span className="font-medium text-foreground" translate="no">
                {props.ambitionName}
              </span>
            </DrawerDescription>
          </div>
        </DrawerHeader>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-2">
          {error && (
            <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {localNotes.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">No notes yet for this ambition.</div>
          ) : (
            <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
              {localNotes.map((note) => {
              const isEditing = editingId === note.id;
              const isConfirmingDelete = confirmDeleteId === note.id;

              return (
                <article
                  key={note.id}
                  className={["group mb-3 break-inside-avoid rounded-2xl border p-4 transition-colors", isEditing ? "border-primary/30 dark:border-chart-1/30 bg-background/50" : isConfirmingDelete ? "border-destructive/30 bg-destructive/5" : "border-yellow-400/40 bg-yellow-100/70 dark:border-yellow-400/15 dark:bg-yellow-400/10"].join(" ")}>
                  {isEditing ? (
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Editing</p>
                      <Textarea
                        ref={editingRef}
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleUpdate(note.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Button type="button" size="sm" disabled={isPending || !editingText.trim()} onClick={() => handleUpdate(note.id)}>
                          Save
                        </Button>
                        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : isConfirmingDelete ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-destructive">Delete this note?</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground wrap-anywhere">{note.note}</p>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="destructive" size="sm" disabled={isPending} onClick={() => handleDelete(note.id)}>
                          <Trash2Icon className="size-3.5" />
                          Yes, delete
                        </Button>
                        <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleCancelDelete}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm wrap-anywhere">{note.note}</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                          {note.updatedAt && note.createdAt && new Date(note.updatedAt).getTime() !== new Date(note.createdAt).getTime() ? `Updated ${formatNoteDate(note.updatedAt)}` : note.createdAt ? `Added ${formatNoteDate(note.createdAt)}` : ""}
                        </p>
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100">
                          <Button type="button" variant="ghost" size="icon" className="size-7 rounded-lg text-muted-foreground hover:text-foreground" aria-label="Edit note" disabled={isPending} onClick={() => handleStartEdit(note)}>
                            <PencilIcon className="size-3.5" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" className="size-7 rounded-lg text-muted-foreground hover:text-destructive" aria-label="Delete note" disabled={isPending} onClick={() => handleStartDelete(note.id)}>
                            <XIcon className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
            </div>
          )}
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
