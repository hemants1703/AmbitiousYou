import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Retrieves the session token from cookies.
 * If the token is not found, it redirects the user to the login page.
 */
export async function getSessionToken(): Promise<string> {
  const cookie = (await cookies()).get("sessionToken");

  if (!cookie) redirect("/login");
  if (!cookie.value) redirect("/login");

  return cookie.value;
}
