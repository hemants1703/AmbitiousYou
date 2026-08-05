import { FadeIn } from "@/components/motion-wrapper";
import { getSessions } from "@/lib/api/auth/get-sessions";
import { getUserSettings } from "@/lib/api/settings/get-user-settings";
import { requireUser } from "@/lib/auth";
import type { Metadata } from "next";
import { SettingsTabs } from "../../../components/(app)/settings/settings-tabs";
import { parseSettingsTab } from "../../../components/(app)/settings/settings-shared";

type SettingsPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage(props: SettingsPageProps) {
  const { user: userDetails, sessionToken } = await requireUser();
  const { tab } = await props.searchParams;
  const initialTab = parseSettingsTab(tab);

  const [userSettings, sessions] = await Promise.all([
    getUserSettings(sessionToken),
    getSessions(sessionToken),
  ]);

  if (!userSettings) {
    return <FailedToLoadSettings />;
  }

  return (
    <section className="w-full pb-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <FadeIn>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, billing, notifications, and security.
            </p>
          </div>
        </FadeIn>

        <FadeIn delayMs={100}>
          <SettingsTabs
            initialTab={initialTab}
            userDetails={userDetails}
            userSettings={userSettings}
            sessions={sessions}
          />
        </FadeIn>
      </div>
    </section>
  );
}

function FailedToLoadSettings() {
  return (
    <section className="w-full pb-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <FadeIn>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, billing, notifications, and security.
            </p>
          </div>
        </FadeIn>

        <FadeIn delayMs={100}>
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load your settings. Please try refreshing the page.
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
