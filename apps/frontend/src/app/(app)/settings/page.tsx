import { FadeIn } from "@/components/motion-wrapper";
import { SettingsBodySkeletonFallback } from "@/components/(app)/settings/settings-body-skeleton";
import { SettingsPageHeader } from "@/components/(app)/settings/settings-page-header";
import { SettingsTabPanel } from "@/components/(app)/settings/settings-tab-panel";
import { SettingsTabs } from "@/components/(app)/settings/settings-tabs";
import { parseSettingsTab } from "@/components/(app)/settings/settings-shared";
import { requireUser } from "@/lib/auth";
import type { Metadata } from "next";
import { Suspense } from "react";

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
  const [{ tab }, auth] = await Promise.all([props.searchParams, requireUser()]);
  const initialTab = parseSettingsTab(tab);
  const pro = auth.user?.plan === "pro";

  return (
    <FadeIn delayMs={100}>
      <SettingsTabs initialTab={initialTab} isPro={pro}>
        <SettingsTabPanel tab={initialTab} user={auth.user} />
      </SettingsTabs>
    </FadeIn>
  );
}
