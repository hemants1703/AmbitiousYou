import { FadeIn } from "@/components/motion-wrapper";
import { getSessions } from "@/lib/api/auth/get-sessions";
import { getUserSettings } from "@/lib/api/settings/get-user-settings";
import { requireUser } from "@/lib/auth";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsBodySkeletonFallback } from "../../../components/(app)/settings/settings-body-skeleton";
import { SettingsPageHeader } from "../../../components/(app)/settings/settings-page-header";
import { SettingsTabs } from "../../../components/(app)/settings/settings-tabs";
import { parseSettingsTab } from "../../../components/(app)/settings/settings-shared";

type SettingsPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage(props: SettingsPageProps) {
  return (
    <section className="w-full pb-8">
      <div className="app-page flex flex-col gap-6">
        <SettingsPageHeader />
        <Suspense fallback={<SettingsBodySkeletonFallback />}>
          <SettingsContent searchParams={props.searchParams} />
        </Suspense>
      </div>
    </section>
  );
}

async function SettingsContent(props: { searchParams: Promise<{ tab?: string }> }) {
  // Overlap session validation with searchParams resolution — both are needed
  // before the settings panel can render, and neither depends on the other.
  const [auth, { tab }] = await Promise.all([requireUser(), props.searchParams]);
  const { user: userDetails, sessionToken } = auth;
  const initialTab = parseSettingsTab(tab);

  const [userSettings, sessions] = await Promise.all([
    getUserSettings(sessionToken),
    getSessions(sessionToken),
  ]);

  if (!userSettings) {
    return <FailedToLoadSettings />;
  }

  return (
    <FadeIn delayMs={100}>
      <SettingsTabs
        initialTab={initialTab}
        userDetails={userDetails}
        userSettings={userSettings}
        sessions={sessions}
      />
    </FadeIn>
  );
}

function FailedToLoadSettings() {
  return (
    <FadeIn delayMs={100}>
      <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load your settings. Please try refreshing the page.
      </div>
    </FadeIn>
  );
}
