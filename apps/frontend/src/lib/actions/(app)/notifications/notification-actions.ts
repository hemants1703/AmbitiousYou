"use server";

import { mutateApi } from "@/lib/actions/mutate-api";
import { getCachedUser } from "@/lib/cache/session-data";
import {
  invalidateInboxCache,
  invalidateSettingsCache,
} from "@/lib/cache/invalidate-session-data";
import type { Notification, Settings } from "@/types";
import { revalidatePath } from "next/cache";

export async function markNotificationReadAction(notificationId: string) {
  const result = await mutateApi<Notification>({
    path: `/notifications/${notificationId}/read`,
    method: "PATCH",
    errorMessage: "Could not mark notification as read.",
  });
  if (!result.error) {
    const user = await getCachedUser();
    invalidateInboxCache(user.id);
    revalidatePath("/dashboard");
    revalidatePath("/settings");
  }
  return result;
}

export async function markAllNotificationsReadAction() {
  const result = await mutateApi<{ updated: number }>({
    path: "/notifications/read-all",
    method: "PATCH",
    errorMessage: "Could not mark notifications as read.",
  });
  if (!result.error) {
    const user = await getCachedUser();
    invalidateInboxCache(user.id);
    revalidatePath("/dashboard");
    revalidatePath("/settings");
  }
  return result;
}

export async function togglePushAmbitionRemindersSetting(updatedValue: boolean, userTimezone?: string) {
  const result = await mutateApi<Settings>({
    path: "/settings",
    method: "PATCH",
    body: {
      pushAmbitionReminders: updatedValue,
      ...(userTimezone ? { userTimezone } : {}),
    },
    errorMessage: "Failed to update notification settings. Please try again.",
  });
  if (!result.error && result.data) {
    invalidateSettingsCache(result.data.userId);
    revalidatePath("/settings");
  }
  return result;
}

export async function savePushSubscriptionAction(subscription: {
  endpoint: string;
  expirationTime: number | null;
  keys: { p256dh: string; auth: string };
}) {
  return mutateApi<{ ok: true }>({
    path: "/notifications/push/subscribe",
    method: "POST",
    body: subscription,
    errorMessage: "Could not enable device notifications.",
  });
}

export async function removePushSubscriptionAction(endpoint: string) {
  return mutateApi<{ ok: true }>({
    path: "/notifications/push/unsubscribe",
    method: "POST",
    body: { endpoint },
    errorMessage: "Could not disable device notifications.",
  });
}

export async function syncDueTodayRemindersAction() {
  const result = await mutateApi<{ notificationsCreated: number; pushesAttempted: number }>({
    path: "/notifications/reminders/sync",
    method: "POST",
    errorMessage: "Could not sync due-today reminders.",
  });
  if (!result.error) {
    const user = await getCachedUser();
    invalidateInboxCache(user.id);
    revalidatePath("/dashboard");
    revalidatePath("/settings");
    revalidatePath("/ambitions");
  }
  return result;
}
