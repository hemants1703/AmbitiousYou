"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Task } from "@ambitiousyou/shared/types";

export type UpdateTaskInput = {
  task: string;
  taskDescription?: string;
  taskCompleted: boolean;
  taskDeadline: string;
};

export async function updateTaskAction(taskId: string, input: UpdateTaskInput): Promise<{ task: Task | null; error: string | null }> {
  const result = await mutateApi<Task>({
    path: `/tasks/${taskId}`,
    method: "PATCH",
    body: {
      task: input.task,
      taskDescription: input.taskDescription ?? "",
      taskCompleted: input.taskCompleted,
      taskDeadline: input.taskDeadline,
    },
    revalidateFromResponse: (task) => ({ ambitionId: task.ambitionId, scopes: ["detail", "dashboard"] }),
    errorMessage: "Failed to update task. Please try again.",
  });

  return { task: result.data, error: result.error };
}
