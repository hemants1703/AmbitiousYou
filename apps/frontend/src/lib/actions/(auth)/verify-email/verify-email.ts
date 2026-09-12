"use server";

import { invalidateUserCache } from "@/lib/cache/invalidate-session-data";
import { getCachedUser } from "@/lib/cache/session-data";
import { getSessionToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function verifyEmailAction(token: string): Promise<{ error: string | null }> {
  if (!token) {
    return { error: "This verification link is invalid." };
  }

  const response = await fetch(`${process.env.API_URL}/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    let error = "We couldn't verify your email. The link may have expired.";

    try {
      const errorBody = (await response.json()) as { message: string | string[] };
      if (Array.isArray(errorBody.message)) {
        error = errorBody.message[0] ?? error;
      } else if (typeof errorBody.message === "string") {
        error = errorBody.message;
      }
    } catch {
      // keep the default error
    }

    return { error };
  }

  try {
    const sessionToken = await getSessionToken();
    const user = await getCachedUser(sessionToken);
    invalidateUserCache(user.id);
  } catch {
    // Visitor may verify while logged out — path revalidation still updates UI on next login.
  }

  revalidatePath("/settings");
  return { error: null };
}
