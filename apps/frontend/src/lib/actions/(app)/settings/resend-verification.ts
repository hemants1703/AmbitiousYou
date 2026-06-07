"use server";

import { getSessionToken } from "@/lib/auth";

export async function resendVerificationAction(): Promise<{ error: string | null }> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/auth/verify-email/resend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    let error = "Unable to resend the verification email. Please try again.";

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

  return { error: null };
}
