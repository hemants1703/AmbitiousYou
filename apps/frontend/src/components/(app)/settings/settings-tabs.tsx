import type { Settings, User } from "@ambitiousyou/shared";
import { BellIcon, CreditCardIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { AccountSettingsTab } from "./account-settings-tab";
import { BillingSettingsTab } from "./billing-settings-tab";
import { NotificationsSettingsTab } from "./notifications-settings-tab";
import { SecuritySettingsTab } from "./security-settings-tab";

export type SettingsTabValue = "account" | "billing" | "notifications" | "security";

interface SettingsTabsProps {
  activeTab: SettingsTabValue;
  userDetails: User;
  userSettings: Settings;
  sessionToken: string;
}

const tabItems: Array<{
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

export function SettingsTabs(props: SettingsTabsProps) {
  const activePanels = {
    account: <AccountSettingsTab userDetails={props.userDetails} />,
    billing: <BillingSettingsTab />,
    notifications: <NotificationsSettingsTab userSettings={props.userSettings} />,
    security: <SecuritySettingsTab sessionToken={props.sessionToken} />,
  } satisfies Record<SettingsTabValue, React.ReactNode>;

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-8">
      <nav aria-label="Settings sections" className="lg:w-52 lg:shrink-0">
        <div
          className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0"
          role="tablist"
        >
          {tabItems.map((tab) => {
            const isActive = props.activeTab === tab.value;
            return (
              <Link
                key={tab.value}
                href={tab.value === "account" ? "/settings" : `/settings?tab=${tab.value}`}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "group flex min-w-fit items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:w-full",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                ].join(" ")}
              >
                <tab.icon className="size-4 shrink-0" />
                <div className="hidden lg:block">
                  <p className="leading-tight">{tab.label}</p>
                  <p
                    className={[
                      "text-xs leading-tight",
                      isActive
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60 group-hover:text-muted-foreground/80",
                    ].join(" ")}
                  >
                    {tab.description}
                  </p>
                </div>
                <span className="lg:hidden">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="min-w-0 flex-1">{activePanels[props.activeTab]}</div>
    </div>
  );
}
