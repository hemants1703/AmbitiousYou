"use client";

import type { Session, Settings, User } from "@ambitiousyou/shared";
import { BellIcon, CreditCardIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentType, MouseEvent } from "react";
import { useEffect, useState } from "react";
import { AccountSettingsTab } from "./account-settings-tab";
import { BillingSettingsTab } from "./billing-settings-tab";
import { NotificationsSettingsTab } from "./notifications-settings-tab";
import { SecuritySettingsTab } from "./security-settings-tab";
import {
  hrefForSettingsTab,
  parseSettingsTab,
  type SettingsTabValue,
} from "./settings-shared";

export type { SettingsTabValue };

interface SettingsTabsProps {
  initialTab: SettingsTabValue;
  userDetails: User;
  userSettings: Settings;
  sessions: Session[] | null;
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
  const [activeTab, setActiveTab] = useState<SettingsTabValue>(props.initialTab);

  // Re-sync when the server-resolved tab changes, adjusting during render rather
  // than in an effect so the panel never paints the stale tab first.
  const [lastInitialTab, setLastInitialTab] = useState(props.initialTab);
  if (props.initialTab !== lastInitialTab) {
    setLastInitialTab(props.initialTab);
    setActiveTab(props.initialTab);
  }

  useEffect(() => {
    function onPopState() {
      const tab = new URLSearchParams(window.location.search).get("tab");
      setActiveTab(parseSettingsTab(tab));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function selectTab(tab: SettingsTabValue) {
    setActiveTab(tab);
    window.history.pushState(null, "", hrefForSettingsTab(tab));
  }

  function handleTabClick(event: MouseEvent<HTMLAnchorElement>, tab: SettingsTabValue) {
    // Keep real <Link> hrefs for middle-click / modifier open-in-new-tab.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    if (tab !== activeTab) selectTab(tab);
  }

  const activePanels = {
    account: <AccountSettingsTab userDetails={props.userDetails} />,
    billing: <BillingSettingsTab />,
    notifications: <NotificationsSettingsTab userSettings={props.userSettings} />,
    security: <SecuritySettingsTab sessions={props.sessions} />,
  } satisfies Record<SettingsTabValue, React.ReactNode>;

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-8">
      <nav aria-label="Settings sections" className="lg:w-52 lg:shrink-0">
        <div
          className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0"
          role="tablist"
        >
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <Link
                key={tab.value}
                href={hrefForSettingsTab(tab.value)}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "page" : undefined}
                scroll={false}
                onClick={(event) => handleTabClick(event, tab.value)}
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

      <div className="min-w-0 flex-1">{activePanels[activeTab]}</div>
    </div>
  );
}
