import { User } from "@ambitiousyou/shared";
import { cookies } from "next/headers";
import { cache } from "react";

export const getUser = cache(async (): Promise<User | null> => {
  const sessionCookie = (await cookies()).get("sessionToken");
  if (!sessionCookie) return null;

  const sessionToken = sessionCookie.value;
  if (!sessionToken) return null;

  const getUser = await fetch(`${process.env.API_URL}/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
  });

  if (!getUser.ok) {
    return null;
  }

  const user: User | null = await getUser.json();
  return user;
});
