import { Session, User } from "better-auth";
import { cookies, headers } from "next/headers";
import { auth } from "./auth";

// This auth helper function checks if the user is authenticated and returns the session and user
// If the user is not authenticated, it redirects to the login page
export default async function confirmSession(): Promise<{ session: Session; user: User } | null> {
  const session: { session: Session; user: User } | null = await auth.api.getSession({
    headers: await headers(),
  });

  const cookieExists = (await cookies()).has("better-auth.session_token");

  if (session === null && cookieExists) {
    (await cookies()).delete("better-auth.session_token");
  }

  return session;
}
