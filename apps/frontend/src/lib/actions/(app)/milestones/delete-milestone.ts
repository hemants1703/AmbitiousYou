"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Milestone } from "@ambitiousyou/shared/types";

export async function deleteMilestoneAction(milestoneId: string): Promise<{ error: string | null }> {
  const result = await mutateApi<Milestone>({
    path: `/milestones/${milestoneId}`,
    method: "DELETE",
    revalidateFromResponse: (milestone) => ({ ambitionId: milestone.ambitionId, scopes: ["detail", "dashboard"] }),
    errorMessage: "Failed to delete milestone. Please try again.",
  });

  return { error: result.error };
}
