"use server";

import { getSessionToken } from "@/lib/auth";
import type { Task } from "@ambitiousyou/shared/types";

export type CreateTaskInput = {
  ambitionId: string;
  task: string;
  taskDescription?: string;
  taskDeadline: string;
};

export async function createTaskAction(input: CreateTaskInput): Promise<{ task: Task | null; error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      ambitionId: input.ambitionId,
      task: input.task,
      taskDescription: input.taskDescription ?? "",
      taskCompleted: false,
      taskDeadline: input.taskDeadline,
    }),
  });

  if (!response.ok) {
    return { task: null, error: "Failed to create task. Please try again." };
  }

  const created: Task = await response.json();
  return { task: created, error: null };
}
