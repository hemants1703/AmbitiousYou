import type { Note } from "@ambitiousyou/shared/types";
import { cache } from "react";

export const getNotes = cache(async (sessionToken: string, ambitionId: string): Promise<Note[]> => {
  const response = await fetch(`${process.env.API_URL}/notes?ambitionId=${ambitionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const text = await response.text();
  if (!text.trim()) return [];
  return JSON.parse(text) as Note[];
});
