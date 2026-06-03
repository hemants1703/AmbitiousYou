import { MotionWrapper } from "@/components/motion-wrapper";
import { requireUser } from "@/lib/auth";
import type { Metadata } from "next";
import { SettingsTabs, type SettingsTabValue } from "../../../components/(app)/settings/settings-tabs";
import { getUserSettings } from "@/lib/api/settings/get-user-settings";

type SettingsPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const validTabs: SettingsTabValue[] = ["account", "billing", "notifications", "security"];

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage(props: SettingsPageProps) {
  const { user: userDetails, sessionToken } = await requireUser();

  const userSettings = await getUserSettings(sessionToken);

  if (!userSettings) {
    return <FailedToLoadSettings />;
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
            userSettings={userSettings}
            sessionToken={sessionToken}
          />
        </MotionWrapper>
      </div>
    </section>
  );
}

function FailedToLoadSettings() {
  return <section className="w-full pb-8">
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
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              Failed to load your settings. Please try refreshing the page.
            </div>
          </MotionWrapper>
        </div>
      </section>
}
