"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SignupState = {
  error: string | null;
};

function getBackendUrl() {
  return process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
}

export async function signupAction(_: SignupState, formData: FormData): Promise<SignupState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name || !email || !password || !confirmPassword) {
    return {
      error: "All fields are required.",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match.",
    };
  }

  try {
    const response = await fetch(`${getBackendUrl()}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      let errorMessage = "Unable to create your account. Please try again.";

      try {
        const errorBody = (await response.json()) as { message?: string | string[] };
        if (Array.isArray(errorBody.message)) {
          errorMessage = errorBody.message[0] ?? errorMessage;
        } else if (typeof errorBody.message === "string") {
          errorMessage = errorBody.message;
        }
      } catch {
        // Fall back to the default message when the backend response is not JSON.
      }

      return {
        error: errorMessage,
      };
    }

    const payload = (await response.json()) as { sessionToken?: string };

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
  } catch {
    return {
      error: "Unable to reach the authentication server.",
    };
  }
}
