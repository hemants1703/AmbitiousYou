import { MotionWrapper } from "@/components/motion-wrapper";
import { getUser } from "@/lib/api/sidebar/get-user";
import { getSessionToken } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";
import { SettingsTabs, type SettingsTabValue } from "../../../components/(app)/settings/settings-tabs";

type SettingsPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const validTabs: SettingsTabValue[] = ["account", "billing", "notifications", "security"];

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage(props: SettingsPageProps) {
  const sessionToken = await getSessionToken();
  const userDetails = await getUser(sessionToken);

  if (!userDetails) {
    return redirect("/login", RedirectType.replace);
  }

  const { tab } = await props.searchParams;
  const activeTab = validTabs.includes(tab as SettingsTabValue)
    ? (tab as SettingsTabValue)
    : "account";

  return (
    <section className="w-full pb-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <MotionWrapper
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, billing, notifications, and security.
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SettingsTabs
            activeTab={activeTab}
            userDetails={userDetails}
            sessionToken={sessionToken}
          />
        </MotionWrapper>
      </div>
    </section>
  );
}
