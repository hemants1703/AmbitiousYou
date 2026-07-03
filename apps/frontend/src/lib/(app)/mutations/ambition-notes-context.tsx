"use client";

import { createNoteAction } from "@/lib/actions/(app)/notes/create-note";
import { deleteNoteAction } from "@/lib/actions/(app)/notes/delete-note";
import { updateNoteAction } from "@/lib/actions/(app)/notes/update-note";
import { usePendingMap } from "@/lib/(app)/mutations/use-pending-map";
import type { Note } from "@ambitiousyou/shared/types";
import { createContext, useCallback, useContext, useMemo, useState, useTransition, type ReactNode } from "react";

function notesKey(notes: Note[]): string {
  return notes.map((note) => `${note.id}:${note.updatedAt}`).join(",");
}

interface AmbitionNotesContextValue {
  notes: Note[];
  isPending: (noteId: string) => boolean;
  isAnyPending: boolean;
  error: string | null;
  clearError: () => void;
  create: (text: string) => void;
  update: (noteId: string, text: string) => void;
  remove: (noteId: string) => void;
}

const AmbitionNotesContext = createContext<AmbitionNotesContextValue | null>(null);

interface AmbitionNotesProviderProps {
  ambitionId: string;
  initialNotes: Note[];
  children: ReactNode;
}

export function AmbitionNotesProvider(props: AmbitionNotesProviderProps) {
  const initialNotesKey = notesKey(props.initialNotes);
  const [notes, setNotes] = useState<Note[]>(props.initialNotes);
  const [prevInitialNotesKey, setPrevInitialNotesKey] = useState(initialNotesKey);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const pending = usePendingMap();

  if (initialNotesKey !== prevInitialNotesKey) {
    setPrevInitialNotesKey(initialNotesKey);
    setNotes(props.initialNotes);
  }

  const create = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setError(null);

      const tempId = crypto.randomUUID();
      const optimistic: Note = {
        id: tempId,
        userId: "",
        ambitionId: props.ambitionId,
        note: trimmed,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const snapshot = notes;

      startTransition(async () => {
        pending.setPending(tempId, "creating");
        setNotes((prev) => [optimistic, ...prev]);

        const result = await createNoteAction(props.ambitionId, trimmed);
        pending.clearPending(tempId);

        if (result.error || !result.note) {
          setError(result.error ?? "Failed to create note. Please try again.");
          setNotes(snapshot);
        } else {
          setNotes((prev) => prev.map((note) => (note.id === tempId ? result.note! : note)));
        }
      });
    },
    [notes, pending, props.ambitionId],
  );

  const update = useCallback(
    (noteId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setError(null);
      const snapshot = notes;

      startTransition(async () => {
        pending.setPending(noteId, "updating");
        setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, note: trimmed, updatedAt: new Date() } : note)));

        const result = await updateNoteAction(noteId, trimmed);
        pending.clearPending(noteId);

        if (result.error) {
          setError(result.error);
          setNotes(snapshot);
        } else if (result.note) {
          setNotes((prev) => prev.map((note) => (note.id === noteId ? result.note! : note)));
        }
      });
    },
    [notes, pending],
  );

  const remove = useCallback(
    (noteId: string) => {
      setError(null);
      const snapshot = notes;

      startTransition(async () => {
        pending.setPending(noteId, "deleting");
        setNotes((prev) => prev.filter((note) => note.id !== noteId));

        const result = await deleteNoteAction(noteId);
        pending.clearPending(noteId);

        if (result.error) {
          setError(result.error);
          setNotes(snapshot);
        }
      });
    },
    [notes, pending],
  );

  const value = useMemo(
    () => ({
      notes,
      isPending: pending.isPending,
      isAnyPending: pending.isAnyPending,
      error,
      clearError: () => setError(null),
      create,
      update,
      remove,
    }),
    [notes, pending.isPending, pending.isAnyPending, error, create, update, remove],
  );

  return <AmbitionNotesContext.Provider value={value}>{props.children}</AmbitionNotesContext.Provider>;
}

export function useAmbitionNotes() {
  const context = useContext(AmbitionNotesContext);
  if (!context) {
    throw new Error("useAmbitionNotes must be used within AmbitionNotesProvider");
  }
  return context;
}
