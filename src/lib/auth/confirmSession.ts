import { Session, User } from "better-auth";
import { headers } from "next/headers";
import { auth } from "./auth";

// This auth helper function checks if the user is authenticated and returns the session and user
// If the user is not authenticated, it redirects to the login page
export default async function confirmSession(): Promise<{ session: Session; user: User } | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
