"use server";

import { getErrorMessage } from "@/lib/actions/(app)/ambitions/form-data-parsers";
import { getSessionToken } from "@/lib/auth";
import type { Milestone } from "@ambitiousyou/shared/types";

export type CreateMilestoneInput = {
  ambitionId: string;
  milestone: string;
  milestoneDescription?: string;
  milestoneTargetDate: string;
};

export async function createMilestoneAction(input: CreateMilestoneInput): Promise<{ milestone: Milestone | null; error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/milestones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      ambitionId: input.ambitionId,
      milestone: input.milestone,
      milestoneDescription: input.milestoneDescription ?? "",
      milestoneCompleted: false,
      milestoneTargetDate: input.milestoneTargetDate,
    }),
  });

  if (!response.ok) {
    let error = "Failed to create milestone. Please try again.";
    try {
      error = getErrorMessage(await response.json(), error);
    } catch {
      // Keep the default message when the backend response is not JSON.
    }
    return { milestone: null, error };
  }

  const created: Milestone = await response.json();
  return { milestone: created, error: null };
}
