"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Milestone } from "@ambitiousyou/shared/types";

export type UpdateMilestoneInput = {
  milestone: string;
  milestoneDescription?: string;
  milestoneCompleted: boolean;
  milestoneTargetDate: string;
};

export async function updateMilestoneAction(milestoneId: string, input: UpdateMilestoneInput): Promise<{ milestone: Milestone | null; error: string | null }> {
  const result = await mutateApi<Milestone>({
    path: `/milestones/${milestoneId}`,
    method: "PATCH",
    body: {
      milestone: input.milestone,
      milestoneDescription: input.milestoneDescription ?? "",
      milestoneCompleted: input.milestoneCompleted,
      milestoneTargetDate: input.milestoneTargetDate,
    },
    revalidateFromResponse: (milestone) => ({ ambitionId: milestone.ambitionId, scopes: ["detail", "dashboard"] }),
    errorMessage: "Failed to update milestone. Please try again.",
  });

  return { milestone: result.data, error: result.error };
}
