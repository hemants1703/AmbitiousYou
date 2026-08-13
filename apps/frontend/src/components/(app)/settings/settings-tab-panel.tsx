import { AccountSettingsTab } from "@/components/(app)/settings/account-settings-tab";
import { BillingSettingsTab } from "@/components/(app)/settings/billing-settings-tab";
import { NotificationsSettingsPanel } from "@/components/(app)/settings/notifications-settings-panel";
import { SecuritySettingsTab } from "@/components/(app)/settings/security-settings-tab";
import { getCachedSessions, getCachedUser } from "@/lib/cache/session-data";
import type { User } from "@ambitiousyou/shared";

import type { SettingsTabValue } from "./settings-shared";

interface SettingsTabPanelProps {
  tab: SettingsTabValue;
  user?: User;
}

export async function SettingsTabPanel(props: SettingsTabPanelProps) {
  switch (props.tab) {
    case "billing":
      return <BillingSettingsTab />;
    case "account": {
      const userDetails = props.user ?? (await getCachedUser());
      return <AccountSettingsTab userDetails={userDetails} />;
    }
    case "notifications":
      return <NotificationsSettingsPanel />;
    case "security": {
      const sessions = await getCachedSessions();
      return <SecuritySettingsTab sessions={sessions} />;
    }
  }
}
