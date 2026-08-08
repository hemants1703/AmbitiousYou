import { Suspense } from "react";

import {
  SettingsBodySkeleton,
  SettingsBodySkeletonFallback,
} from "@/components/(app)/settings/settings-body-skeleton";
import { SettingsPageHeader } from "@/components/(app)/settings/settings-page-header";

/**
 * Instant-navigation fallback for /settings. Title and tab labels are real;
 * only API-backed panel fields skeletonize. Inner Suspense satisfies
 * useSearchParams so Soft Nav to ?tab= keeps the correct active tab.
 */
export default function SettingsLoading() {
  return (
    <section className="w-full pb-8">
      <div className="app-page flex flex-col gap-6">
        <SettingsPageHeader />
        <Suspense fallback={<SettingsBodySkeletonFallback />}>
          <SettingsBodySkeleton />
        </Suspense>
      </div>
    </section>
  );
}
