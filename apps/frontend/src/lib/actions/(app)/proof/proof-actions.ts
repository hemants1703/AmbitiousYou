"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import { revalidatePath } from "next/cache";
import type { ProofLog } from "@/types";

export async function createProofLog(input: { proofTitle: string; proofNote?: string; ambitionId?: string }) {
  const result = await mutateApi<ProofLog>({
    path: "/proof-logs",
    method: "POST",
    body: input,
    errorMessage: "Couldn't save that win. Try again.",
  });

  if (!result.error) {
    revalidatePath("/dashboard");
  }

  return result;
}

export async function deleteProofLog(proofLogId: string) {
  const result = await mutateApi<void>({
    path: `/proof-logs/${proofLogId}`,
    method: "DELETE",
    errorMessage: "Couldn't remove that entry. Try again.",
  });

  if (!result.error) {
    revalidatePath("/dashboard");
  }

  return result;
}
