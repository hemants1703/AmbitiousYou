import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { DetailItem, SummaryBlock, dummySettingsByTab, formatDate } from "./settings-shared";

export function NotificationsSettingsTab() {
  const settings = dummySettingsByTab.notifications;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications settings</CardTitle>
        <CardDescription>Dummy data shaped from the shared Settings type.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryBlock label="Settings ID" value={settings.id} />
          <SummaryBlock label="User ID" value={settings.userId} />
          <SummaryBlock label="Timezone" value={settings.userTimezone} />
        </div>

        <Separator />

        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DetailItem label="Email account activity" value={settings.emailAccountActivity ? "Enabled" : "Disabled"} />
          <DetailItem label="Push ambition reminders" value={settings.pushAmbitionReminders ? "Enabled" : "Disabled"} />
          <DetailItem label="Created" value={formatDate(settings.createdAt)} />
          <DetailItem label="Updated" value={formatDate(settings.updatedAt)} />
        </dl>
      </CardContent>
    </Card>
  );
}
