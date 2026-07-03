"use client";

import { PendingButton } from "@/components/(app)/mutations/pending-button";
import { OptimisticRow } from "@/components/(app)/mutations/optimistic-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { useAmbitionNotes } from "@/lib/(app)/mutations/ambition-notes-context";
import { BookOpenTextIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface NotesDrawerProps {
  ambitionName: string;
}

function formatNoteDate(dateValue: Date | string | null) {
  if (!dateValue) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateValue));
}

export default function NotesDrawer(props: NotesDrawerProps) {
  const notes = useAmbitionNotes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const editingRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingId) editingRef.current?.focus();
  }, [editingId]);

  function handleStartEdit(noteId: string, text: string) {
    setConfirmDeleteId(null);
    setEditingId(noteId);
    setEditingText(text);
  }

  function handleUpdate(noteId: string) {
    const text = editingText.trim();
    if (!text) return;
    notes.clearError();
    notes.update(noteId, text);
    setEditingId(null);
    setEditingText("");
  }

  const triggerLabel = notes.notes.length > 5 ? `View all ${notes.notes.length} notes` : "Manage notes";

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
              {notes.notes.length > 0 ? (
                <Badge variant="outline" className="text-xs tabular-nums">
                  {notes.notes.length}
                </Badge>
              ) : null}
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
          {notes.error ? (
            <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {notes.error}
            </div>
          ) : null}

          {notes.notes.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">No notes yet for this ambition.</div>
          ) : (
            <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
              {notes.notes.map((note) => {
                const isEditing = editingId === note.id;
                const isConfirmingDelete = confirmDeleteId === note.id;
                const isPending = notes.isPending(note.id);

                return (
                  <OptimisticRow
                    key={note.id}
                    isPending={isPending}
                    className={[
                      "group mb-3 break-inside-avoid rounded-2xl border p-4 transition-colors",
                      isEditing ? "border-primary/30 dark:border-chart-1/30 bg-background/50" : isConfirmingDelete ? "border-destructive/30 bg-destructive/5" : "border-yellow-400/40 bg-yellow-100/70 dark:border-yellow-400/15 dark:bg-yellow-400/10",
                    ].join(" ")}>
                    {isEditing ? (
                      <div className="space-y-3">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Editing</p>
                        <Textarea
                          ref={editingRef}
                          value={editingText}
                          onChange={(event) => setEditingText(event.target.value)}
                          rows={3}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) handleUpdate(note.id);
                            if (event.key === "Escape") {
                              setEditingId(null);
                              setEditingText("");
                            }
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <PendingButton type="button" size="sm" isPending={isPending} disabled={!editingText.trim()} onClick={() => handleUpdate(note.id)}>
                            Save
                          </PendingButton>
                          <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => { setEditingId(null); setEditingText(""); }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : isConfirmingDelete ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-destructive">Delete this note?</p>
                        <p className="line-clamp-2 text-sm text-muted-foreground wrap-anywhere">{note.note}</p>
                        <div className="flex items-center gap-2">
                          <PendingButton type="button" variant="destructive" size="sm" isPending={isPending} onClick={() => notes.remove(note.id)}>
                            <Trash2Icon className="size-3.5" />
                            Yes, delete
                          </PendingButton>
                          <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => setConfirmDeleteId(null)}>
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
                            <Button type="button" variant="ghost" size="icon" className="size-7 rounded-lg text-muted-foreground hover:text-foreground" aria-label="Edit note" disabled={isPending} onClick={() => handleStartEdit(note.id, note.note)}>
                              <PencilIcon className="size-3.5" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="size-7 rounded-lg text-muted-foreground hover:text-destructive" aria-label="Delete note" disabled={isPending} onClick={() => { setEditingId(null); setConfirmDeleteId(note.id); }}>
                              <XIcon className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </OptimisticRow>
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
