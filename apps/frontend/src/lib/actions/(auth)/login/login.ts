"use server";

import { getAmbitions } from "@/lib/api/ambitions/get-ambitions";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
  error: string | null;
};

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

  let sessionToken: string | null = null;

  try {
    const response = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        ...(await getClientMetadata()),
      }),
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

    const payload = (await response.json()) as { sessionToken: string };

    if (!payload.sessionToken) {
      return {
        error: "The backend did not return a session token.",
      };
    }

    sessionToken = payload.sessionToken;
  } catch {
    return {
      error: "Unable to reach the authentication server.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("sessionToken", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Readable (non-httpOnly) hint so client components can show a logged-in
  // affordance without reading the httpOnly token. Carries no secret — see useAuthHint.
  cookieStore.set("ay_auth", "1", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const ambitions = await getAmbitions(sessionToken);
  if (!ambitions || ambitions.length === 0) {
    redirect("/ambitions/create?initiation=1");
  }

  redirect("/dashboard");
}
