import { headers } from "next/headers";
import { auth } from "./auth";
import { Session, User } from "better-auth";

// This auth helper function checks if the user is authenticated and returns the session
// If the user is not authenticated, it returns null
// This is useful for pages that can be accessed both with and without authentication
export default async function getOptionalSession(): Promise<{ session: Session; user: User } | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
