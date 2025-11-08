"use server";

import { db } from "@/db";
import { ambitions } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

export async function favouriteAmbitionAction(
  ambitionId: string,
  favouriteValue: boolean
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Get current authenticated user
    const { user } = await confirmSession();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Update ambition's favourite status
    const [updatedAmbition] = await db
      .update(ambitions)
      .set({ isFavourited: favouriteValue })
      .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, user.id)))
      .returning();

    if (!updatedAmbition) {
      throw new Error("Ambition not found or you don't have permission to update it");
    }

    revalidatePath("/ambitions");

    return { success: true };
  } catch (error) {
    console.error("Error updating ambition:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update ambition",
    };
  }
}
