import { Ambition } from "@ambitiousyou/shared";
import { cache } from "react";

export const getAmbitions = cache(async (sessionToken: string): Promise<Ambition[] | null> => {
  const ambitions = await fetch(`${process.env.API_URL}/ambitions`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
  });

  if (!ambitions.ok) {
    return null;
  }

  const responseText = await ambitions.text();

  if(!responseText.trim()) {
    return null;
  }

  const ambitionsData: Ambition[] = JSON.parse(responseText);
  return ambitionsData;
});
