import "server-only";

import type { ProofLog } from "@/types";
import { cache } from "react";

async function fetchProofLogs(sessionToken: string): Promise<ProofLog[]> {
  const response = await fetch(`${process.env.API_URL}/proof-logs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 403) return [];
  if (!response.ok) return [];
  return (await response.json()) as ProofLog[];
}

export const getProofLogs = cache(fetchProofLogs);
