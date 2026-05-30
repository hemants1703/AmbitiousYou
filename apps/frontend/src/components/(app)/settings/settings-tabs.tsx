"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BellIcon, CreditCardIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: "account", label: "Account", icon: UserRoundIcon },
  { value: "billing", label: "Billing", icon: CreditCardIcon },
  { value: "notifications", label: "Notifications", icon: BellIcon },
  { value: "security", label: "Security", icon: LockKeyholeIcon },
];

export function SettingsTabs(props: SettingsTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const nextTab = value as SettingsTabValue;
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", nextTab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs className="w-full gap-4" value={props.activeTab} onValueChange={handleTabChange}>
      <TabsList className="w-full justify-start overflow-x-auto rounded-3xl sm:w-fit" aria-label="Settings sections">
        {tabItems.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="min-w-0 sm:min-w-32">
            <tab.icon className="size-4" />
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <AccountSettingsTab userDetails={props.userDetails} />
      <BillingSettingsTab />
      <NotificationsSettingsTab />
      <SecuritySettingsTab />
    </Tabs>
  );
}
