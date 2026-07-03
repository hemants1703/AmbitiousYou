"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { Task } from "@ambitiousyou/shared/types";

export type CreateTaskInput = {
  ambitionId: string;
  task: string;
  taskDescription?: string;
  taskDeadline: string;
};

export async function createTaskAction(input: CreateTaskInput): Promise<{ task: Task | null; error: string | null }> {
  const result = await mutateApi<Task>({
    path: "/tasks",
    body: {
      ambitionId: input.ambitionId,
      task: input.task,
      taskDescription: input.taskDescription ?? "",
      taskCompleted: false,
      taskDeadline: input.taskDeadline,
    },
    ambitionId: input.ambitionId,
    revalidate: ["detail", "dashboard"],
    errorMessage: "Failed to create task. Please try again.",
  });

  return { task: result.data, error: result.error };
}
