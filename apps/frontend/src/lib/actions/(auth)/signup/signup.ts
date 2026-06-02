"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SignupState = {
  error: string | null;
};

export async function signupAction(_: SignupState, formData: FormData): Promise<SignupState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return {
      error: "All fields are required.",
    };
  }

  const response = await fetch(`${process.env.API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    let error = "Unable to create your account. Please try again.";

    const errorBody = (await response.json()) as { message: string | string[] };
    if (Array.isArray(errorBody.message)) {
      error = errorBody.message[0] ?? error;
    } else if (typeof errorBody.message === "string") {
      error = errorBody.message;
    }

    return { error };
  }

  const payload = (await response.json()) as { sessionToken: string };

  if (!payload.sessionToken) {
    return {
      error: "The backend did not return a session token.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("sessionToken", payload.sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}
