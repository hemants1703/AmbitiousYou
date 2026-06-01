"use server";

import { getSessionToken } from "@/lib/auth";

export async function updateNoteAction(noteId: string, noteText: string, ambitionId: string): Promise<{ error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ note: noteText, ambitionId }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`[updateNoteAction] ${response.status} ${response.statusText}`, body);
    return { error: `Failed to update note (${response.status}). Please try again.` };
  }

  return { error: null };
}
