"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Note } from "@ambitiousyou/shared/types";

export async function updateNoteAction(noteId: string, noteText: string): Promise<{ note: Note | null; error: string | null }> {
  const result = await mutateApi<Note>({
    path: `/notes/${noteId}`,
    method: "PATCH",
    body: { note: noteText },
    revalidateFromResponse: (note) => ({ ambitionId: note.ambitionId, scopes: ["detail"] }),
    errorMessage: "Failed to update note. Please try again.",
  });

  return { note: result.data, error: result.error };
}
