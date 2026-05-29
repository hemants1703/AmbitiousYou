import { User } from "@ambitiousyou/shared";
import { cache } from "react";

export const getUser = cache(async (sessionToken: string): Promise<User | null> => {
  const getUser = await fetch(`${process.env.API_URL}/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
  });

  if (!getUser.ok) return null;

  const user: User | null = await getUser.json();
  return user;
});
