"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Task } from "@ambitiousyou/shared/types";

export async function deleteTaskAction(taskId: string): Promise<{ error: string | null }> {
  const result = await mutateApi<Task>({
    path: `/tasks/${taskId}`,
    method: "DELETE",
    revalidateFromResponse: (task) => ({ ambitionId: task.ambitionId, scopes: ["detail", "dashboard"] }),
    errorMessage: "Failed to delete task. Please try again.",
  });

  return { error: result.error };
}
