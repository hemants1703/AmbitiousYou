"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Milestone } from "@ambitiousyou/shared/types";

export type CreateMilestoneInput = {
  ambitionId: string;
  milestone: string;
  milestoneDescription?: string;
  milestoneTargetDate: string;
};

export async function createMilestoneAction(input: CreateMilestoneInput): Promise<{ milestone: Milestone | null; error: string | null }> {
  const result = await mutateApi<Milestone>({
    path: "/milestones",
    body: {
      ambitionId: input.ambitionId,
      milestone: input.milestone,
      milestoneDescription: input.milestoneDescription ?? "",
      milestoneCompleted: false,
      milestoneTargetDate: input.milestoneTargetDate,
    },
    ambitionId: input.ambitionId,
    revalidate: ["detail", "dashboard"],
    errorMessage: "Failed to create milestone. Please try again.",
  });

  return { milestone: result.data, error: result.error };
}
