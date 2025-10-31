"use server";

import { db } from "@/db";
import { ambitions } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { and, eq } from "drizzle-orm";

export async function deleteAmbitionAction(ambitionId: string): Promise<{
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

    // Delete ambition (cascade will automatically delete associated tasks/milestones)
    const [deletedAmbition] = await db
      .delete(ambitions)
      .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, user.id)))
      .returning();

    if (!deletedAmbition) {
      return {
        success: false,
        error: "Ambition not found or you don't have permission to delete it",
      };
    }

    console.log("[SERVER ACTION] Ambition deleted successfully:", ambitionId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting ambition:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete ambition",
    };
  }
}
