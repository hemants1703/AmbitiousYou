"use server";

import { getSessionToken } from "@/lib/auth";

export async function deleteTaskAction(taskId: string): Promise<{ error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    return { error: "Failed to delete task. Please try again." };
  }

  return { error: null };
}
