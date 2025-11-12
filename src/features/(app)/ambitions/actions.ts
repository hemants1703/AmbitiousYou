"use server";

import { db } from "@/db";
import { ambitions, milestones } from "@/db/schema";
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
    const session = await confirmSession();

    if (!session) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Update ambition's favourite status
    const [updatedAmbition] = await db
      .update(ambitions)
      .set({ isFavourited: favouriteValue })
      .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, session.user.id)))
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

export async function markMilestoneAsCompletedAction(milestoneId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await confirmSession();

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    }
  }

  const updateMilestoneResponse = await db.update(milestones).set({ milestoneCompleted: true }).where(and(eq(milestones.id, milestoneId), eq(milestones.userId, session.user.id))).returning();

  if (!updateMilestoneResponse) {
    return {
      success: false,
      error: "Milestone not found or you don't have permission to update it",
    }
  }

  revalidatePath(`/ambitions/${updateMilestoneResponse[0].ambitionId}`);
  return {
    success: true,
  }
}