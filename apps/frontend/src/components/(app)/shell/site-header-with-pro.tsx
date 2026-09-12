import { HeaderInbox, HeaderInboxSkeleton } from "@/components/(app)/shell/header-inbox";
import { SiteHeader } from "@/components/site-header";
import { getSessionToken } from "@/lib/auth";
import { getCachedUser } from "@/lib/cache/session-data";
import { isPro } from "@/lib/plan";
import { Suspense } from "react";

export function SiteHeaderWithPro() {
  return (
    <Suspense fallback={<SiteHeader inboxSlot={<HeaderInboxSkeleton />} showAiSidebar={false} />}>
      <SiteHeaderContent />
    </Suspense>
  );
}

async function SiteHeaderContent() {
  const sessionToken = await getSessionToken();
  const user = await getCachedUser(sessionToken);

  return (
    <SiteHeader
      showAiSidebar={isPro(user)}
      inboxSlot={
        <Suspense fallback={<HeaderInboxSkeleton />}>
          <HeaderInbox />
        </Suspense>
      }
    />
  );
}
