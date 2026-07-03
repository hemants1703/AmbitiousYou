"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import { revalidateAmbition } from "@/lib/actions/revalidate-ambition";

export async function deleteAmbitionAction(ambitionId: string): Promise<{ error: string | null }> {
  if (!ambitionId) {
    return { error: "We couldn't tell which ambition to delete. Refresh the page and try again." };
  }

  const result = await mutateApi<null>({
    path: `/ambitions/${ambitionId}`,
    method: "DELETE",
    errorMessage: "Unable to delete this ambition. Please try again.",
  });

  if (!result.error) {
    revalidateAmbition(ambitionId, ["detail", "list", "dashboard"]);
  }

  return { error: result.error };
}
