import type { ComponentType } from "react";
import Link from "next/link";
import { BellIcon, CreditCardIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react";

import type { User } from "@ambitiousyou/shared";

import { AccountSettingsTab } from "./account-settings-tab";
import { BillingSettingsTab } from "./billing-settings-tab";
import { NotificationsSettingsTab } from "./notifications-settings-tab";
import { SecuritySettingsTab } from "./security-settings-tab";

export type SettingsTabValue = "account" | "billing" | "notifications" | "security";

interface SettingsTabsProps {
  activeTab: SettingsTabValue;
  userDetails: User;
}

const tabItems: Array<{
  value: SettingsTabValue;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { value: "account", label: "Account", icon: UserRoundIcon },
  { value: "billing", label: "Billing", icon: CreditCardIcon },
  { value: "notifications", label: "Notifications", icon: BellIcon },
  { value: "security", label: "Security", icon: LockKeyholeIcon },
];

export function SettingsTabs(props: SettingsTabsProps) {
  const activePanels = {
    account: <AccountSettingsTab userDetails={props.userDetails} />,
    billing: <BillingSettingsTab />,
    notifications: <NotificationsSettingsTab />,
    security: <SecuritySettingsTab />,
  } satisfies Record<SettingsTabValue, React.ReactNode>;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-fit items-center gap-2 overflow-x-auto rounded-3xl bg-muted p-1 sm:w-fit" role="tablist" aria-label="Settings sections">
        {tabItems.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "account" ? "/settings" : `/settings?tab=${tab.value}`}
            role="tab"
            aria-selected={props.activeTab === tab.value}
            aria-current={props.activeTab === tab.value ? "page" : undefined}
            className={[
              "inline-flex min-w-0 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-32",
              props.activeTab === tab.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            ].join(" ")}>
            <tab.icon className="size-4" />
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>

      {activePanels[props.activeTab]}
    </div>
  );
}
