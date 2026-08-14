"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import { revalidatePath } from "next/cache";
import type { ContractPayload, WeeklyReviewPayload } from "@/types";

export async function saveWeeklyReview(input: {
  moved: string;
  stalled: string;
  skipReason?: string;
  nextWeekContract: string;
}) {
  const result = await mutateApi<WeeklyReviewPayload>({
    path: "/loop/reviews",
    method: "POST",
    body: input,
    errorMessage: "Couldn't save your weekly review. Try again.",
  });

  if (!result.error) {
    revalidatePath("/dashboard");
  }

  return result;
}

export async function scheduleRestartTomorrow() {
  const result = await mutateApi<ContractPayload>({
    path: "/loop/restart",
    method: "POST",
    errorMessage: "Couldn't schedule your restart. Try again.",
  });

  if (!result.error) {
    revalidatePath("/dashboard");
  }

  return result;
}
