import "server-only";

import type { ContractPayload } from "@/types";
import { cache } from "react";

async function fetchContractPayload(sessionToken: string): Promise<ContractPayload | null> {
  const response = await fetch(`${process.env.API_URL}/loop/contract`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 403) return null;
  if (!response.ok) return null;
  return (await response.json()) as ContractPayload;
}

export const getLoopContract = cache(fetchContractPayload);
