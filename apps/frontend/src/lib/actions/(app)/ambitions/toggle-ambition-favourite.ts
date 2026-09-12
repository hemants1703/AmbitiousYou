"use server";

import { getAmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import { revalidateAmbitionFull } from "@/lib/actions/revalidate-ambition";
import { getCachedUser } from "@/lib/cache/session-data";
import { getSessionToken } from "@/lib/auth";

export async function toggleAmbitionFavouriteAction(ambitionId: string): Promise<{ error: string | null; isFavourited: boolean }> {
  const sessionToken = await getSessionToken();

  if (!ambitionId) {
    return { error: "We couldn't tell which ambition to update. Refresh the page and try again.", isFavourited: false };
  }

  let ambition;
  try {
    ambition = await getAmbitionDetails(sessionToken, ambitionId);
  } catch {
    return { error: "Unable to reach the ambitions server.", isFavourited: false };
  }

  if (!ambition) {
    return { error: "We couldn't find this ambition. Refresh the page and try again.", isFavourited: false };
  }

  const nextIsFavourited = !(ambition.isFavourited ?? false);

  // The PATCH endpoint validates the full ambition DTO, so we round-trip the existing values
  // and only flip the favourite flag.
  const payload = {
    ambitionName: ambition.ambitionName,
    ambitionDefinition: ambition.ambitionDefinition ?? "",
    ambitionStartDate: new Date(ambition.ambitionStartDate).toISOString(),
    ambitionEndDate: new Date(ambition.ambitionEndDate).toISOString(),
    ambitionPriority: ambition.ambitionPriority,
    isFavourited: nextIsFavourited,
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
      return { error: "Unable to update this ambition. Please try again.", isFavourited: !nextIsFavourited };
    }
  } catch {
    return { error: "Unable to reach the ambitions server.", isFavourited: !nextIsFavourited };
  }

  const user = await getCachedUser(sessionToken);
  revalidateAmbitionFull(user.id, ambitionId);

  return { error: null, isFavourited: nextIsFavourited };
}
