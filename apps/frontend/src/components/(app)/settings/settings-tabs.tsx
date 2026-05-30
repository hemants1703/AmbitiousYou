"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Settings, User } from "@ambitiousyou/shared";
import { BellIcon, CircleCheckBigIcon, CreditCardIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react";

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

const dummySettingsByTab: Record<Exclude<SettingsTabValue, "account">, Settings> = {
  billing: {
    id: "settings-billing",
    userId: "demo-user-001",
    userTimezone: "America/New_York",
    emailAccountActivity: true,
    pushAmbitionReminders: false,
    createdAt: new Date("2026-05-01T08:00:00.000Z"),
    updatedAt: new Date("2026-05-12T14:30:00.000Z"),
  },
  notifications: {
    id: "settings-notifications",
    userId: "demo-user-002",
    userTimezone: "Europe/London",
    emailAccountActivity: false,
    pushAmbitionReminders: true,
    createdAt: new Date("2026-04-21T09:15:00.000Z"),
    updatedAt: new Date("2026-05-20T16:45:00.000Z"),
  },
  security: {
    id: "settings-security",
    userId: "demo-user-003",
    userTimezone: "Asia/Tokyo",
    emailAccountActivity: true,
    pushAmbitionReminders: true,
    createdAt: new Date("2026-03-10T12:00:00.000Z"),
    updatedAt: new Date("2026-05-25T10:20:00.000Z"),
  },
};

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

      <TabsContent value="account" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Account details</CardTitle>
            <CardDescription>Live data fetched for the signed-in user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-foreground">{props.userDetails.name}</p>
                <p className="text-sm text-muted-foreground">{props.userDetails.email}</p>
              </div>
              <Badge variant={props.userDetails.emailVerified ? "default" : "outline"} className="w-fit">
                {props.userDetails.emailVerified ? <CircleCheckBigIcon className="size-3.5" /> : null}
                {props.userDetails.emailVerified ? "Email verified" : "Email pending"}
              </Badge>
            </div>

            <Separator />

            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailItem label="User ID" value={props.userDetails.id} />
              <DetailItem label="Avatar" value={props.userDetails.image ?? "No profile image"} />
              <DetailItem label="Created" value={formatDate(props.userDetails.createdAt)} />
              <DetailItem label="Updated" value={formatDate(props.userDetails.updatedAt)} />
            </dl>
          </CardContent>
        </Card>
      </TabsContent>

      {(["billing", "notifications", "security"] as const).map((tab) => {
        const settings = dummySettingsByTab[tab];

        return (
          <TabsContent key={tab} value={tab} className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{tab.charAt(0).toUpperCase() + tab.slice(1)} settings</CardTitle>
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
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function DetailItem(props: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-3xl border border-border/60 bg-muted/30 p-4">
      <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{props.label}</dt>
      <dd className="wrap-break-word text-sm font-medium text-foreground">{props.value}</dd>
    </div>
  );
}

function SummaryBlock(props: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-background p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{props.label}</p>
      <p className="mt-2 wrap-break-word text-sm font-medium text-foreground">{props.value}</p>
    </div>
  );
}

function formatDate(value: Date | null) {
  if (!value) return "Not available";

  const date = new Date(value);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours24 = date.getUTCHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const period = hours24 >= 12 ? "PM" : "AM";

  return `${month} ${day}, ${year} at ${hours12}:${minutes} ${period}`;
}
