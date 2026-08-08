import type { ComponentType } from "react";
import { BellIcon, CreditCardIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react";

import type { SettingsTabValue } from "./settings-shared";

export const SETTINGS_TAB_ITEMS: Array<{
  value: SettingsTabValue;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { value: "account", label: "Account", description: "Profile & identity", icon: UserRoundIcon },
  { value: "billing", label: "Billing", description: "Plans & payments", icon: CreditCardIcon },
  { value: "notifications", label: "Notifications", description: "Alerts & reminders", icon: BellIcon },
  { value: "security", label: "Security", description: "Password & sessions", icon: LockKeyholeIcon },
];
