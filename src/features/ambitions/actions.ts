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
  message?: string;
  description?: string;
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
      return {
        success: false,
        error: "Ambition not found or you don't have permission to update it",
      };
    }

    revalidatePath("/ambitions");

    const message = favouriteValue
      ? "Ambition added to favorites"
      : "Ambition removed from favorites";
    const description = favouriteValue
      ? "You can now find this ambition in your favourites tab"
      : "";

    return { success: true, message, description };
  } catch (error) {
    console.error("Error updating ambition:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update ambition",
    };
  }
}
