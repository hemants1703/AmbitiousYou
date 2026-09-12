"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import { fetchWeeklyReviewCurrent, getWeeklyReviewStatus } from "@/lib/api/loop/get-weekly-review-status";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { ContractPayload, WeeklyReviewPayload, WeeklyReviewStatusPayload } from "@/types";

async function readSessionToken(): Promise<string | null> {
  return (await cookies()).get("sessionToken")?.value ?? null;
}

export async function loadWeeklyReviewStatus(): Promise<WeeklyReviewStatusPayload | null> {
  const sessionToken = await readSessionToken();
  if (!sessionToken) return null;

  try {
    return await getWeeklyReviewStatus(sessionToken);
  } catch {
    return null;
  }
}

export async function loadWeeklyReviewCurrent(): Promise<WeeklyReviewPayload | null> {
  const sessionToken = await readSessionToken();
  if (!sessionToken) return null;

  try {
    return await fetchWeeklyReviewCurrent(sessionToken);
  } catch {
    return null;
  }
}

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
