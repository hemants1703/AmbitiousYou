"use server";

import { getSessionToken } from "@/lib/auth";

export async function deleteMilestoneAction(milestoneId: string): Promise<{ error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/milestones/${milestoneId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    return { error: "Failed to delete milestone. Please try again." };
  }

  return { error: null };
}
