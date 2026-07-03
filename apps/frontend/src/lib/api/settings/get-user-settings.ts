import { Settings } from "@ambitiousyou/shared";
import { cache } from "react";

export const getUserSettings = cache(async (sessionToken: string): Promise<Settings | null> => {
  const response = await fetch(`${process.env.API_URL}/settings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as Settings;
});
