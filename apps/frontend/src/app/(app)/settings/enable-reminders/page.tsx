import { EnableRemindersScreen } from "@/components/(app)/settings/enable-reminders-screen";
import { FadeIn } from "@/components/motion-wrapper";
import { getUserSettings } from "@/lib/api/settings/get-user-settings";
import { requireUser } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Enable ambition reminders",
};

export default async function EnableRemindersPage() {
  const { sessionToken } = await requireUser();
  const userSettings = await getUserSettings(sessionToken);

  if (userSettings?.pushAmbitionReminders) {
    redirect("/settings?tab=notifications");
  }

  return (
    <FadeIn>
      <EnableRemindersScreen />
    </FadeIn>
  );
}
