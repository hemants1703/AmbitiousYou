import { HeaderInbox, HeaderInboxSkeleton } from "@/components/(app)/shell/header-inbox";
import { SiteHeader } from "@/components/site-header";
import type { SiteHeaderProps } from "@/components/site-header-props";
import { getSessionToken } from "@/lib/auth";
import { getCachedUser } from "@/lib/cache/session-data";
import { isPro } from "@/lib/plan";
import { Suspense } from "react";

const headerFallbackProps: SiteHeaderProps = {
  inboxSlot: <HeaderInboxSkeleton />,
  showAiSidebar: false,
};

export function SiteHeaderWithPro() {
  return (
    <Suspense fallback={<SiteHeader {...headerFallbackProps} />}>
      <SiteHeaderContent />
    </Suspense>
  );
}

async function SiteHeaderContent() {
  const sessionToken = await getSessionToken();
  const user = await getCachedUser(sessionToken);

  const headerProps: SiteHeaderProps = {
    showAiSidebar: isPro(user),
    inboxSlot: (
      <Suspense fallback={<HeaderInboxSkeleton />}>
        <HeaderInbox />
      </Suspense>
    ),
  };

  return <SiteHeader {...headerProps} />;
}
