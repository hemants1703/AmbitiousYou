import type { Task } from "@ambitiousyou/shared/types";

export async function getTasks(sessionToken: string, ambitionId: string): Promise<Task[]> {
  const response = await fetch(`${process.env.API_URL}/tasks?ambitionId=${ambitionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const text = await response.text();
  if (!text.trim()) return [];
  return JSON.parse(text) as Task[];
}
