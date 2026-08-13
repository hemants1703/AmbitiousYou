"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import { invalidateUserCache } from "@/lib/cache/invalidate-session-data";
import type { User } from "@/types";
import { serializeProfileAvatar, type ProfileAvatarSelection } from "@/lib/profile-icons";
import { revalidatePath } from "next/cache";

/**
 * Persists mix-and-match profile avatar (`icon:<mark>:<tone>` or null).
 * Invalidates the cached user snapshot for sidebar + account tab.
 */
export async function updateProfileAvatarAction(
  selection: ProfileAvatarSelection | null,
): Promise<{ data: User | null; error: string | null }> {
  const image = selection === null ? null : serializeProfileAvatar(selection);

  const result = await mutateApi<User>({
    path: "/users",
    method: "PATCH",
    body: { image },
    errorMessage: "Could not update your profile avatar. Please try again.",
  });

  if (!result.error && result.data) {
    invalidateUserCache(result.data.id);
    revalidatePath("/settings");
  }

  return result;
}
