"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BellIcon,
  KeyRoundIcon,
  LockKeyholeIcon,
  MailIcon,
  MonitorIcon,
  UserRoundIcon,
} from "lucide-react";

import { BillingSettingsTab } from "@/components/(app)/settings/billing-settings-tab";
import { ResetPasswordCard } from "@/components/(app)/settings/reset-password-card";
import { SETTINGS_TAB_ITEMS } from "@/components/(app)/settings/settings-tab-items";
import {
  hrefForSettingsTab,
  parseSettingsTab,
  type SettingsTabValue,
} from "@/components/(app)/settings/settings-shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SettingsTabNavSkeletonProps {
  activeTab: SettingsTabValue;
}

/** Real tab links — URL stays the source of truth while settings data streams. */
function SettingsTabNavSkeleton(props: SettingsTabNavSkeletonProps) {
  return (
    <nav aria-label="Settings sections" className="lg:w-52 lg:shrink-0">
      <div className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:pb-0" role="tablist">
        {SETTINGS_TAB_ITEMS.map((tab) => {
          const isActive = props.activeTab === tab.value;
          return (
            <Link
              key={tab.value}
              href={hrefForSettingsTab(tab.value)}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? "page" : undefined}
              scroll={false}
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
                    isActive ? "text-muted-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground/80",
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
  );
}

function SettingsAccountPanelSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading account settings">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRoundIcon className="size-4 text-accent-brand" />
            Profile
          </CardTitle>
          <CardDescription>Your identity on AmbitiousYou.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="size-16 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-6 w-40 max-w-full" />
              <Skeleton className="h-4 w-56 max-w-full" />
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Member since</p>
            <Skeleton className="mt-2 h-4 w-48 max-w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsNotificationsPanelSkeleton() {
  const rows = [
    {
      icon: MailIcon,
      label: "Email account activity",
      description: "Receive emails about sign-ins, profile changes, and security events.",
    },
    {
      icon: BellIcon,
      label: "Ambition reminders",
      description:
        "Account preference: twice-a-day nudges for due or overdue work — enough to keep ambitions in check, not enough to nag. Each device still needs its own permission.",
    },
  ] as const;

  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading notification settings">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="size-4 text-accent-brand" />
            Notification preferences
          </CardTitle>
          <CardDescription>Control how and when AmbitiousYou reaches you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4"
            >
              <row.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">{row.label}</p>
                <p className="text-xs text-muted-foreground text-pretty">{row.description}</p>
              </div>
              <Skeleton className="mt-0.5 h-5 w-9 shrink-0 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsSecurityPanelSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading security settings">
      {/* Authentication card is static — show the real chrome */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockKeyholeIcon className="size-4 text-accent-brand" />
            Authentication
          </CardTitle>
          <CardDescription>Manage how you sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/50 p-4">
            <div className="flex items-center gap-3">
              <KeyRoundIcon className="size-4 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">Standard email&nbsp;+&nbsp;password login</p>
              </div>
            </div>
            <Badge variant="outline">Active</Badge>
          </div>
        </CardContent>
      </Card>

      <ResetPasswordCard />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MonitorIcon className="size-4 text-accent-brand" />
            Active sessions
          </CardTitle>
          <CardDescription>Devices currently signed in. Expired sessions stay collapsed below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-2xl" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPanelSkeleton(props: { activeTab: SettingsTabValue }) {
  switch (props.activeTab) {
    case "billing":
      return <BillingSettingsTab />;
    case "notifications":
      return <SettingsNotificationsPanelSkeleton />;
    case "security":
      return <SettingsSecurityPanelSkeleton />;
    case "account":
    default:
      return <SettingsAccountPanelSkeleton />;
  }
}

function SettingsBodyShell(props: { activeTab: SettingsTabValue }) {
  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-8">
      <SettingsTabNavSkeleton activeTab={props.activeTab} />
      <div className="min-w-0 flex-1">
        <SettingsPanelSkeleton activeTab={props.activeTab} />
      </div>
    </div>
  );
}

/** Static account-tab shell — safe Suspense fallback without useSearchParams. */
export function SettingsBodySkeletonFallback() {
  return <SettingsBodyShell activeTab="account" />;
}

/**
 * Settings body loading shell. Tab chrome is real Links (URL-driven active state);
 * only API-backed panel fields skeletonize. Billing paints fully (no personal data).
 * Must sit under a Suspense boundary (uses useSearchParams).
 */
export function SettingsBodySkeleton() {
  const searchParams = useSearchParams();
  const activeTab = parseSettingsTab(searchParams.get("tab"));

  return <SettingsBodyShell activeTab={activeTab} />;
}
