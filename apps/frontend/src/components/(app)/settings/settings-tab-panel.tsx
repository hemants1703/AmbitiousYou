import { AccountSettingsTab } from "@/components/(app)/settings/account-settings-tab";
import { BillingSettingsTab } from "@/components/(app)/settings/billing-settings-tab";
import { NotificationsSettingsPanel } from "@/components/(app)/settings/notifications-settings-panel";
import { SecuritySettingsTab } from "@/components/(app)/settings/security-settings-tab";
import { getCachedSessions, getCachedUser } from "@/lib/cache/session-data";
import { getSessionToken } from "@/lib/auth";
import type { User } from "@/types";
import { IntegrationsSettingsTab } from "@/components/(app)/settings/integrations-settings-tab";
import { DataSettingsTab } from "@/components/(app)/settings/data-settings-tab";
import { AiSettingsTab } from "@/components/(app)/settings/ai-settings-tab";

import type { SettingsTabValue } from "./settings-shared";

interface SettingsTabPanelProps {
  tab: SettingsTabValue;
  user?: User;
}

export async function SettingsTabPanel(props: SettingsTabPanelProps) {
  const sessionToken = await getSessionToken();
  switch (props.tab) {
    case "billing":
      return <BillingSettingsTab />;
    case "account": {
      const userDetails = props.user ?? (await getCachedUser(sessionToken));
      return <AccountSettingsTab userDetails={userDetails} />;
    }
    case "notifications":
      return <NotificationsSettingsPanel />;
    case "security": {
      const sessions = await getCachedSessions(sessionToken);
      return <SecuritySettingsTab sessions={sessions} />;
    }
    case "integrations":
      return <IntegrationsSettingsTab />;
    case "data":
      return <DataSettingsTab />;
    case "ai":
      return <AiSettingsTab />;
  }
}
