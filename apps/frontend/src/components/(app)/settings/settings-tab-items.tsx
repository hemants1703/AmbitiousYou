import type { ComponentType } from "react";
import { BellIcon, CreditCardIcon, DatabaseIcon, LockKeyholeIcon, Plug2Icon, SparklesIcon, UserRoundIcon } from "lucide-react";

import type { SettingsTabValue } from "./settings-shared";

export const SETTINGS_TAB_ITEMS: Array<{
  value: SettingsTabValue;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  proOnly?: boolean;
}> = [
  { value: "account", label: "Account", description: "Profile & identity", icon: UserRoundIcon },
  { value: "billing", label: "Billing", description: "Plans & payments", icon: CreditCardIcon },
  { value: "notifications", label: "Notifications", description: "Alerts & reminders", icon: BellIcon },
  { value: "security", label: "Security", description: "Password & sessions", icon: LockKeyholeIcon },
  { value: "integrations", label: "Integrations", description: "Calendar & tools", icon: Plug2Icon, proOnly: true },
  { value: "data", label: "Data", description: "Export & privacy", icon: DatabaseIcon, proOnly: true },
  { value: "ai", label: "AI", description: "Search index & models", icon: SparklesIcon, proOnly: true },
];
