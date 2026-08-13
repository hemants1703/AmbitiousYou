import { revalidatePath } from "next/cache";

import {
  invalidateAmbitionCaches,
  invalidateAmbitionDetailCache,
  invalidateAmbitionMovesCache,
  invalidateAmbitionsListCache,
} from "@/lib/cache/invalidate-session-data";

export function revalidateAmbition(ambitionId: string, scopes: Array<"detail" | "list" | "dashboard">, userId?: string) {
  if (userId) {
    invalidateAmbitionDetailCache(ambitionId);
    if (scopes.includes("list")) {
      invalidateAmbitionsListCache(userId);
    }
    if (scopes.includes("dashboard")) {
      invalidateAmbitionMovesCache(userId);
    }
  }

  if (scopes.includes("detail")) {
    revalidatePath(`/ambitions/${ambitionId}`);
  }
  if (scopes.includes("list")) {
    revalidatePath("/ambitions");
  }
  if (scopes.includes("dashboard")) {
    revalidatePath("/dashboard");
  }
}

export function revalidateAmbitionFull(userId: string, ambitionId: string) {
  invalidateAmbitionCaches(userId, ambitionId);
  revalidatePath(`/ambitions/${ambitionId}`);
  revalidatePath("/ambitions");
  revalidatePath("/dashboard");
}
