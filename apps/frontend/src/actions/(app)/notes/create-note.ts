"use server";

import { getSessionToken } from "@/lib/auth";
import type { Note } from "@ambitiousyou/shared/types";

export async function createNoteAction(ambitionId: string, note: string): Promise<{ note: Note | null; error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ ambitionId, note }),
  });

  if (!response.ok) {
    return { note: null, error: "Failed to create note. Please try again." };
  }

  const created: Note = await response.json();
  return { note: created, error: null };
}
