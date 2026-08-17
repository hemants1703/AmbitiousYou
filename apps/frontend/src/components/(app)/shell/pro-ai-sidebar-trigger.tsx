import { AiSidebarTrigger } from "@/components/ui/ai-sidebar";
import { getSessionToken } from "@/lib/auth";
import { getCachedUser } from "@/lib/cache/session-data";
import { isPro } from "@/lib/plan";

export async function ProAiSidebarTrigger() {
  const sessionToken = await getSessionToken();
  const user = await getCachedUser(sessionToken);

  return isPro(user) ? <AiSidebarTrigger /> : null;
}
