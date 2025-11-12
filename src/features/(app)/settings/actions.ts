"use server";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export default async function updateProfileAction(
  firstName: string,
  lastName: string
): Promise<{
  success: boolean;
  error?: string;
  data?: { firstName: string; lastName: string };
}> {
  try {
    // Get current authenticated user
    const session = await confirmSession();

    if (!session) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    // Validate inputs
    if (!firstName || !lastName) {
      return {
        success: false,
        error: "Both first name and last name are required to update profile",
      };
    }

    if (firstName.length < 2 || lastName.length < 2) {
      return {
        success: false,
        error: "First name and last name must be at least 2 characters long",
      };
    }

    // Update profile in database
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        firstName,
        lastName,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, session.user.id))
      .returning();

    if (!updatedProfile) {
      return {
        success: false,
        error: "Failed to update profile",
      };
    }

    console.log("[SERVER ACTIONS] Profile updated successfully for user:", session.user.id);

    revalidatePath("/settings", "page");
    return {
      success: true,
      data: {
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
      },
    };
  } catch (error) {
    console.error("[SERVER ACTIONS] Error updating profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
