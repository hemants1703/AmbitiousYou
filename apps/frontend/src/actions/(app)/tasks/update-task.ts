"use server";

import { getSessionToken } from "@/lib/auth";
import type { Task } from "@ambitiousyou/shared/types";

export type UpdateTaskInput = {
  task: string;
  taskDescription?: string;
  taskCompleted: boolean;
  taskDeadline: string;
};

export async function updateTaskAction(taskId: string, input: UpdateTaskInput): Promise<{ task: Task | null; error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      task: input.task,
      taskDescription: input.taskDescription ?? "",
      taskCompleted: input.taskCompleted,
      taskDeadline: input.taskDeadline,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`[updateTaskAction] ${response.status} ${response.statusText}`, body);
    return { task: null, error: `Failed to update task (${response.status}). Please try again.` };
  }

  const updated: Task = await response.json();
  return { task: updated, error: null };
}
