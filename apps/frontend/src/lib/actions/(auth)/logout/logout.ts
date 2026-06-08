"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Logs the user out. A Server Action (POST, origin-checked by Next) rather than
 * a GET route, so a cross-site navigation can't force a logout. Clears the
 * session cookies even if the backend call fails, then sends the user home.
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  if (sessionToken) {
    try {
      await fetch(`${process.env.API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
      });
    } catch {
      // Best-effort: clear cookies regardless of the backend's availability.
    }
  }

  cookieStore.delete("sessionToken");
  cookieStore.delete("ay_auth");

  redirect("/");
}
