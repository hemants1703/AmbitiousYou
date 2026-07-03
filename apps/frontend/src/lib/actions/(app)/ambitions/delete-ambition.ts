"use server";

import { getSessionToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteAmbitionAction(ambitionId: string): Promise<{ error: string | null }> {
  const sessionToken = await getSessionToken();

  if (!ambitionId) {
    return { error: "We couldn't tell which ambition to delete. Refresh the page and try again." };
  }

  try {
    const response = await fetch(`${process.env.API_URL}/ambitions/${ambitionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      return { error: "Unable to delete this ambition. Please try again." };
    }
  } catch {
    return { error: "Unable to reach the ambitions server." };
  }

  revalidatePath("/ambitions");
  return { error: null };
}
