"use server";

import { getSessionToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export type UpdateAmbitionState = {
  error: string | null;
};

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getErrorMessage(responseBody: unknown, fallbackMessage: string): string {
  if (!responseBody || typeof responseBody !== "object") {
    return fallbackMessage;
  }

  const message = (responseBody as { message?: string | string[] }).message;

  if (Array.isArray(message)) {
    return message[0] ?? fallbackMessage;
  }

  if (typeof message === "string") {
    return message;
  }

  return fallbackMessage;
}

export async function updateAmbitionAction(_: UpdateAmbitionState, formData: FormData): Promise<UpdateAmbitionState> {
  const sessionToken = await getSessionToken();

  const ambitionId = readString(formData, "ambitionId");
  const ambitionName = readString(formData, "ambitionName");
  const ambitionDefinition = readString(formData, "ambitionDefinition");
  const ambitionPriority = readString(formData, "ambitionPriority") as "low" | "medium" | "high" | "";
  const isFavourited = readString(formData, "isFavourited") === "true";

  // The tracking method and date window can't change after creation, but the backend DTO still
  // validates them, so we round-trip the original values straight from the hidden form fields.
  const ambitionTrackingMethod = readString(formData, "ambitionTrackingMethod") as "task" | "milestone" | "";
  const ambitionStartDate = parseDate(readString(formData, "ambitionStartDate"));
  const ambitionEndDate = parseDate(readString(formData, "ambitionEndDate"));

  if (!ambitionId) {
    return { error: "We couldn't tell which ambition to update. Refresh the page and try again." };
  }

  if (!ambitionName) {
    return { error: "Give your ambition a name before saving." };
  }

  if (!ambitionPriority) {
    return { error: "Choose a priority before saving." };
  }

  if (!ambitionTrackingMethod || !ambitionStartDate || !ambitionEndDate) {
    return { error: "Something went wrong reading this ambition. Refresh the page and try again." };
  }

  const payload = {
    ambitionName,
    ambitionDefinition,
    ambitionTrackingMethod,
    ambitionStartDate: ambitionStartDate.toISOString(),
    ambitionEndDate: ambitionEndDate.toISOString(),
    ambitionPriority,
    isFavourited,
  };

  try {
    const response = await fetch(`${process.env.API_URL}/ambitions/${ambitionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = "Unable to save your changes. Please try again.";

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
  } catch {
    return {
      error: "Unable to reach the ambitions server.",
    };
  }

  redirect(`/ambitions/${ambitionId}`);
}
