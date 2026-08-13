"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import { revalidateAmbition } from "@/lib/actions/revalidate-ambition";
import { getCachedUser } from "@/lib/cache/session-data";

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
    const user = await getCachedUser();
    revalidateAmbition(ambitionId, ["detail", "list", "dashboard"], user.id);
  }

  return { error: result.error };
}
