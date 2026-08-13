"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import type { ProfileAvatarSelection, User } from "@ambitiousyou/shared";
import { serializeProfileAvatar } from "@ambitiousyou/shared";
import { revalidatePath } from "next/cache";

/**
 * Persists mix-and-match profile avatar (`icon:<mark>:<tone>` or null).
 * Revalidates the app layout (sidebar chip) and settings page only.
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

  if (!result.error) {
    revalidatePath("/", "layout");
    revalidatePath("/settings");
  }

  return result;
}
