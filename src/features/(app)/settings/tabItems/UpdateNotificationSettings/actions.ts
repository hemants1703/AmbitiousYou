"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notificationSettingsSchema, UpdateNotificationSettingsInput } from "./validators";

export async function updateNotificationSettings(notificationSettings: UpdateNotificationSettingsInput) {
  const session = await confirmSession();

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  // Only parse the notification settings that are provided stripping out the ones that are not provided
  const parsedNotificationSettings = notificationSettingsSchema.parse(notificationSettings);

  try {
    const updateNotificationSettingsResult = await db
      .update(settings)
      .set(parsedNotificationSettings)
      .where(eq(settings.userId, session.user.id))
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
