"use server";

import { getErrorMessage, parseDate, readString } from "@/lib/actions/(app)/ambitions/form-data-parsers";
import { getSessionToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";
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

  // The date window can't change after creation, but the backend DTO still validates it,
  // so we round-trip the original values straight from the hidden form fields.
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

  if (!ambitionStartDate || !ambitionEndDate) {
    return { error: "Something went wrong reading this ambition. Refresh the page and try again." };
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

  revalidatePath(`/ambitions/${ambitionId}`);
  revalidatePath("/ambitions");
  revalidatePath("/dashboard");

  redirect(`/ambitions/${ambitionId}`);
}
