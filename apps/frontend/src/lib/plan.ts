import type { User } from "@/types";

export function isPro(user: User | null | undefined): boolean {
  return user?.plan === "pro";
}
