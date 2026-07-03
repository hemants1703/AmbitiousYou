"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Note } from "@ambitiousyou/shared/types";

export async function deleteNoteAction(noteId: string): Promise<{ error: string | null }> {
  const result = await mutateApi<Note>({
    path: `/notes/${noteId}`,
    method: "DELETE",
    revalidateFromResponse: (note) => ({ ambitionId: note.ambitionId, scopes: ["detail"] }),
    errorMessage: "Failed to delete note. Please try again.",
  });

  return { error: result.error };
}
