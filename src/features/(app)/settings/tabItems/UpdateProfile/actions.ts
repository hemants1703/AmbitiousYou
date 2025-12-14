"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateProfileValidator } from "./validators";
import { auth } from "@/lib/auth/auth";

export async function updateUserAction(name: string): Promise<{
  success: boolean;
  error?: string;
  data?: { name: string };
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

    const validatedData = updateProfileValidator.safeParse({ name });

    if (!validatedData.success) {
      return {
        success: false,
        error: z.flattenError(validatedData.error).fieldErrors.name?.[0] ?? "Invalid name",
      };
    }

    // Update profile in database
    const [updatedProfile] = await db
      .update(user)
      .set({
        name: validatedData.data.name,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))
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
        name: updatedProfile.name,
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

export async function sendVerificationEmailAction(
  email: string
): Promise<{ success?: boolean; error?: string }> {
  const baseUrl = process.env.APP_BASE_URL;

  if (!baseUrl) {
    return { success: false, error: "APP_BASE_URL not configured" };
  }

  await auth.api.sendVerificationEmail({
    body: {
      email,
      callbackURL: `${baseUrl}/dashboard`,
    },
  });

  return { success: true, error: undefined };
}
