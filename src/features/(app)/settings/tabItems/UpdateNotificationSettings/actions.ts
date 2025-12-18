"use server";

import { db } from "@/db";
import { settings, UserNotificationSettings } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateNotificationSettings(
  userId: string,
  userNotificationSettings: UserNotificationSettings
) {
  const session = await confirmSession();

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const updateNotificationSettingsResult = await db
      .update(settings)
      .set({
        userNotificationSettings: userNotificationSettings,
      })
      .where(eq(settings.userId, userId))
      .returning();

    if (!updateNotificationSettingsResult) {
      throw new Error("Failed to update notification settings");
    }

    revalidatePath("/settings", "page");

    return {
      success: true,
      data: updateNotificationSettingsResult[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update notification settings",
    };
  }
}
