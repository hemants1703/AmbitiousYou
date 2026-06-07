"use server";

import { redirect } from "next/navigation";

export type ResetPasswordState = {
  error: string | null;
};

export async function resetPasswordWithTokenAction(_: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { error: "This reset link is invalid or has expired." };
  }
  if (!password) {
    return { error: "Please enter a new password." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const response = await fetch(`${process.env.API_URL}/auth/forgot-password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });

  if (!response.ok) {
    let error = "Unable to reset your password. The link may have expired.";

    const errorBody = (await response.json()) as { message: string | string[] };
    if (Array.isArray(errorBody.message)) {
      error = errorBody.message[0] ?? error;
    } else if (typeof errorBody.message === "string") {
      error = errorBody.message;
    }

    return { error };
  }

  // Sessions were invalidated by the backend — send the user to log in fresh.
  redirect("/login");
}
