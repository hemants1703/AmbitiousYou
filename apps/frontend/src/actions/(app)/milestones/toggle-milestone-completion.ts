"use server";

import { getSessionToken } from "@/lib/auth";

export async function toggleMilestoneCompletionAction(milestoneId: string): Promise<{ error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/milestones/${milestoneId}/toggle-completion`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    return { error: "Couldn't update that milestone. Please try again." };
  }

  return { error: null };
}
