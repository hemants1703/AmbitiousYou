"use server";

import { getErrorMessage, parseDate, readString } from "@/lib/actions/(app)/ambitions/form-data-parsers";
import { revalidateAmbitionFull } from "@/lib/actions/revalidate-ambition";
import { getCachedUser } from "@/lib/cache/session-data";
import { getSessionToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export type UpdateAmbitionState = {
  error: string | null;
};

export async function updateAmbitionAction(_: UpdateAmbitionState, formData: FormData): Promise<UpdateAmbitionState> {
  const sessionToken = await getSessionToken();

  const ambitionId = readString(formData, "ambitionId");
  const ambitionName = readString(formData, "ambitionName");
  const ambitionDefinition = readString(formData, "ambitionDefinition");
  const ambitionMotivation = readString(formData, "ambitionMotivation");
  const ambitionPriority = readString(formData, "ambitionPriority") as "low" | "medium" | "high" | "";
  const isFavourited = readString(formData, "isFavourited") === "true";

  // Start date is immutable; end date may only move later. Round-trip start and
  // validate the new end against the original so a forged earlier date never ships.
  const ambitionStartDate = parseDate(readString(formData, "ambitionStartDate"));
  const ambitionEndDate = parseDate(readString(formData, "ambitionEndDate"));
  const originalAmbitionEndDate = parseDate(readString(formData, "originalAmbitionEndDate"));

  if (!ambitionId) {
    return { error: "We couldn't tell which ambition to update. Refresh the page and try again." };
  }

  if (!ambitionName) {
    return { error: "Give your ambition a name before saving." };
  }

  if (!ambitionPriority) {
    return { error: "Choose a priority before saving." };
  }

  if (!ambitionStartDate || !ambitionEndDate || !originalAmbitionEndDate) {
    return { error: "Something went wrong reading this ambition. Refresh the page and try again." };
  }

  const nextEndDay = new Date(ambitionEndDate);
  nextEndDay.setHours(0, 0, 0, 0);
  const originalEndDay = new Date(originalAmbitionEndDate);
  originalEndDay.setHours(0, 0, 0, 0);

  if (nextEndDay.getTime() < originalEndDay.getTime()) {
    return { error: "The end date can only be moved later — you can't go back to an earlier date." };
  }

  const payload = {
    ambitionName,
    ambitionDefinition,
    ambitionMotivation,
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

  const user = await getCachedUser();
  revalidateAmbitionFull(user.id, ambitionId);

  redirect(`/ambitions/${ambitionId}`);
}
