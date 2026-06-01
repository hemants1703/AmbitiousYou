"use server";

import { getSessionToken } from "@/lib/auth";

export async function deleteNoteAction(noteId: string): Promise<{ error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    return { error: "Failed to delete note. Please try again." };
  }

  return { error: null };
}
