"use server";

import { getSessionToken } from "@/lib/auth";
import {
  getErrorMessage,
  parseDate,
  parseMilestones,
  parseNotes,
  parseTasks,
  readString,
} from "@/lib/actions/(app)/ambitions/form-data-parsers";
import { revalidatePath } from "next/cache";

export type CreateAmbitionState = {
  error: string | null;
  success?: boolean;
  ambitionId?: string;
  ambitionName?: string;
};

export async function createAmbitionAction(_: CreateAmbitionState, formData: FormData): Promise<CreateAmbitionState> {
  const sessionToken = await getSessionToken();

  const ambitionName = readString(formData, "ambitionName");
  const ambitionDefinition = readString(formData, "ambitionDefinition");
  const ambitionMotivation = readString(formData, "ambitionMotivation");
  const ambitionPriority = readString(formData, "ambitionPriority") as "low" | "medium" | "high" | "";
  const ambitionStartDate = parseDate(readString(formData, "ambitionStartDate"));
  const ambitionEndDate = parseDate(readString(formData, "ambitionEndDate"));

  if (!ambitionName || !ambitionPriority || !ambitionStartDate || !ambitionEndDate) {
    return {
      error: "Fill in the ambition name, priority, and dates before creating it.",
    };
  }

  if (ambitionEndDate.getTime() < ambitionStartDate.getTime()) {
    return {
      error: "The end date must be the same as or later than the start date.",
    };
  }

  const tasks = parseTasks(formData);
  const milestones = parseMilestones(formData);
  const notes = parseNotes(formData);

  // An ambition is tracked by "moves" — a free mix of tasks and milestones. At least one is required.
  if (tasks.length === 0 && milestones.length === 0) {
    return {
      error: "Add at least one move — a task or a milestone — to track this ambition.",
    };
  }

  const payload = {
    ambitionName,
    ambitionDefinition,
    ambitionMotivation,
    ambitionStartDate: ambitionStartDate.toISOString(),
    ambitionEndDate: ambitionEndDate.toISOString(),
    ambitionPriority,
    ...(tasks.length > 0 ? { tasks } : {}),
    ...(milestones.length > 0 ? { milestones } : {}),
    ...(notes.length > 0 ? { notes } : {}),
  };

  try {
    const response = await fetch(`${process.env.API_URL}/ambitions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = "Unable to create the ambition. Please try again.";

      try {
        const responseBody = (await response.json()) as unknown;
        errorMessage = getErrorMessage(responseBody, errorMessage);
      } catch {
        // Fall back to the default error message when the backend response is not JSON.
      }

      return {
        error: errorMessage,
      };
    }

    const created = (await response.json()) as { id: string; ambitionName: string };

    revalidatePath("/ambitions");
    revalidatePath("/dashboard");

    return {
      error: null,
      success: true,
      ambitionId: created.id,
      ambitionName: created.ambitionName,
    };
  } catch {
    return {
      error: "Unable to reach the ambitions server.",
    };
  }
}
