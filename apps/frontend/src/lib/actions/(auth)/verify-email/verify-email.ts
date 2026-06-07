"use server";

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

  // Refresh the settings page so the "Unverified" badge updates for a logged-in user.
  revalidatePath("/settings");
  return { error: null };
}
