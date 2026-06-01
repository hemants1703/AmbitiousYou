import type { Session } from "@ambitiousyou/shared";
import { cache } from "react";

export const getSessions = cache(async (sessionToken: string): Promise<Session[] | null> => {
  const response = await fetch(`${process.env.API_URL}/auth/sessions`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
  });

  if (!response.ok) {
    return null;
  }

  const data: Session[] | null = await response.json();
  return data;
});
