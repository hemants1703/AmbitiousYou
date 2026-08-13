import { Suspense } from "react";

import { NotificationsSettingsTab } from "@/components/(app)/settings/notifications-settings-tab";
import { NotificationsSettingsControlsSkeleton } from "@/components/(app)/settings/notifications-settings-controls-skeleton";
import { NotificationsSettingsStaticShell } from "@/components/(app)/settings/notifications-settings-static-shell";
import { getCachedUserSettings } from "@/lib/cache/session-data";

async function NotificationsSettingsData() {
  const userSettings = await getCachedUserSettings();

  if (!userSettings) {
    return (
      <div className="px-6 pb-6 text-sm text-destructive">
        Failed to load notification settings. Please try refreshing the page.
      </div>
    );
  }

  return <NotificationsSettingsTab userSettings={userSettings} />;
}

export function NotificationsSettingsPanel() {
  return (
    <NotificationsSettingsStaticShell>
      <Suspense fallback={<NotificationsSettingsControlsSkeleton />}>
        <NotificationsSettingsData />
      </Suspense>
    </NotificationsSettingsStaticShell>
  );
}
