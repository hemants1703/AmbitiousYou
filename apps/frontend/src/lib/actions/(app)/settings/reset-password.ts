"use server";

import { getSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export type ResetPasswordResult = {
  error: string | null;
  signedOut: boolean;
};

export async function resetPasswordAction(newPassword: string, signOutAllDevices: boolean): Promise<ResetPasswordResult> {
  const sessionToken = await getSessionToken();

  const response = await fetch(`${process.env.API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ newPassword, signOutAllDevices }),
  });

  if (!response.ok) {
    let error = "Unable to update your password. Please try again.";

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

    return { error, signedOut: false };
  }

  if (signOutAllDevices) {
    // The backend dropped every session; clear our now-stale cookies so the
    // client lands on /login cleanly.
    const cookieStore = await cookies();
    cookieStore.delete("sessionToken");
    cookieStore.delete("ay_auth");
  }

  return { error: null, signedOut: signOutAllDevices };
}
