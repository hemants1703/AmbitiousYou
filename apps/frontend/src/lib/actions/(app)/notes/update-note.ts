"use server";

import { getSessionToken } from "@/lib/auth";

export async function updateNoteAction(noteId: string, noteText: string): Promise<{ error: string | null }> {
  const sessionToken = await getSessionToken();

  // Only `note` is whitelisted by the backend UpdateNoteDto; sending `ambitionId`
  // trips the global forbidNonWhitelisted ValidationPipe and 400s every edit.
  const response = await fetch(`${process.env.API_URL}/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ note: noteText }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`[updateNoteAction] ${response.status} ${response.statusText}`, body);
    return { error: `Failed to update note (${response.status}). Please try again.` };
  }

  return { error: null };
}
