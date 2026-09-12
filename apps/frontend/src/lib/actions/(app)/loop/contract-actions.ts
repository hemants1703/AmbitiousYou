"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import { revalidatePath } from "next/cache";
import type { ContractPayload } from "@/types";

export async function upsertLoopContract(input: {
  moveKind: "task" | "milestone";
  moveId: string;
  ifTrigger?: string;
  thenAction?: string;
}) {
  const result = await mutateApi<ContractPayload>({
    path: "/loop/contract",
    method: "POST",
    body: input,
    errorMessage: "Couldn't set today's move. Try again.",
  });

  if (!result.error) {
    revalidatePath("/dashboard");
  }

  return result;
}

export async function completeLoopContract(contractId: string) {
  const result = await mutateApi<ContractPayload>({
    path: `/loop/contract/${contractId}/complete`,
    method: "PATCH",
    errorMessage: "Couldn't mark this move complete. Try again.",
  });

  if (!result.error) {
    revalidatePath("/dashboard");
  }

  return result;
}

export async function snoozeLoopContract(contractId: string) {
  const result = await mutateApi<ContractPayload>({
    path: `/loop/contract/${contractId}/snooze`,
    method: "PATCH",
    errorMessage: "Couldn't snooze this move. Try again.",
  });

  if (!result.error) {
    revalidatePath("/dashboard");
  }

  return result;
}
