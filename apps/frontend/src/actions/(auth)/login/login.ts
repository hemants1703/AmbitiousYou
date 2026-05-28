"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
  error: string | null;
};

function getBackendUrl() {
  return process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
}

async function getClientMetadata() {
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? "";
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? "";

  return {
    userAgent,
    ipAddress,
  };
}

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  try {
    const response = await fetch(`${getBackendUrl()}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        ...(await getClientMetadata()),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      let errorMessage = "Unable to sign in. Please try again.";

      try {
        const errorBody = (await response.json()) as { message?: string | string[] };
        if (Array.isArray(errorBody.message)) {
          errorMessage = errorBody.message[0] ?? errorMessage;
        } else if (typeof errorBody.message === "string") {
          errorMessage = errorBody.message;
        }
      } catch {
        // Use the default message when the backend does not return JSON.
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
