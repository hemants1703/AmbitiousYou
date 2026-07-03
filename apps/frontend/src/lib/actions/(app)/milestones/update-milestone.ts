"use server";

import { getSessionToken } from "@/lib/auth";
import type { Milestone } from "@ambitiousyou/shared/types";

export type UpdateMilestoneInput = {
  milestone: string;
  milestoneDescription?: string;
  milestoneCompleted: boolean;
  milestoneTargetDate: string;
};

export async function updateMilestoneAction(milestoneId: string, input: UpdateMilestoneInput): Promise<{ milestone: Milestone | null; error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/milestones/${milestoneId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      milestone: input.milestone,
      milestoneDescription: input.milestoneDescription ?? "",
      milestoneCompleted: input.milestoneCompleted,
      milestoneTargetDate: input.milestoneTargetDate,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`[updateMilestoneAction] ${response.status} ${response.statusText}`, body);
    return { milestone: null, error: `Failed to update milestone (${response.status}). Please try again.` };
  }

  const updated: Milestone = await response.json();
  return { milestone: updated, error: null };
}
