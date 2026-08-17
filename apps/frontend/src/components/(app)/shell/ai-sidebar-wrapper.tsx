import { AiSidebar } from "@/components/ui/ai-sidebar";
import { AiSidebarContent as AppAiSidebarContent } from "@/components/(app)/ai-sidebar/ai-sidebar-content";
import { getCachedUser } from "@/lib/cache/session-data";
import { getSessionToken } from "@/lib/auth";
import { isPro } from "@/lib/plan";

export async function AiSidebarWrapper() {
  const sessionToken = await getSessionToken();
  const user = await getCachedUser(sessionToken);

  if (!isPro(user)) {
    return null;
  }

  return (
    <AiSidebar variant="inset" side="right" collapsible="offcanvas">
      <AppAiSidebarContent sessionToken={sessionToken} />
    </AiSidebar>
  );
}
