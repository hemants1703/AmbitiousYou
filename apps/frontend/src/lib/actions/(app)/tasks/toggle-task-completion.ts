"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Task } from "@ambitiousyou/shared/types";

export async function toggleTaskCompletionAction(taskId: string): Promise<{ task: Task | null; error: string | null }> {
  const result = await mutateApi<Task>({
    path: `/tasks/${taskId}/toggle-completion`,
    method: "PATCH",
    revalidateFromResponse: (task) => ({ ambitionId: task.ambitionId, scopes: ["detail", "dashboard"] }),
    errorMessage: "Couldn't update that task. Please try again.",
  });

  return { task: result.data, error: result.error };
}
