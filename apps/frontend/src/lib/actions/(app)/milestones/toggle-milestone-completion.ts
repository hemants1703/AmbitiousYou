"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Milestone } from "@ambitiousyou/shared/types";

export async function toggleMilestoneCompletionAction(milestoneId: string): Promise<{ milestone: Milestone | null; error: string | null }> {
  const result = await mutateApi<Milestone>({
    path: `/milestones/${milestoneId}/toggle-completion`,
    method: "PATCH",
    revalidateFromResponse: (milestone) => ({ ambitionId: milestone.ambitionId, scopes: ["detail", "dashboard"] }),
    errorMessage: "Couldn't update that milestone. Please try again.",
  });

  return { milestone: result.data, error: result.error };
}
