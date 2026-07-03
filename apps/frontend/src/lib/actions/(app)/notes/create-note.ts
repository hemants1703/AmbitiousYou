"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Note } from "@ambitiousyou/shared/types";

export async function createNoteAction(ambitionId: string, note: string): Promise<{ note: Note | null; error: string | null }> {
  const result = await mutateApi<Note>({
    path: "/notes",
    body: { ambitionId, note },
    ambitionId,
    revalidate: ["detail"],
    errorMessage: "Failed to create note. Please try again.",
  });

  return { note: result.data, error: result.error };
}
