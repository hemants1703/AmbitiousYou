import * as Tabs from "@/components/ui/tabs";
import AccountTab from "@/features/(app)/settings/tabItems/AccountTab";
import AppearanceTab from "@/features/(app)/settings/tabItems/AppearanceTab";
import NotificationsTab from "@/features/(app)/settings/tabItems/NotificationsTab";
import ProfileTab from "@/features/(app)/settings/tabItems/ProfileTab";
import confirmSession from "@/lib/auth/confirmSession";
import { SettingsService } from "@/services/settingsService";
import { Metadata } from "next";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = { title: "Settings" };

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SettingsPage(props: SettingsPageProps) {
  const session = await confirmSession();

  if (!session) {
    redirect("/login", RedirectType.replace);
  }

  const searchParams = await props.searchParams;

  if (!searchParams.tab) {
    redirect("?tab=profile", RedirectType.replace);
  }

  const settingsService = new SettingsService();
  const settings = await settingsService.getUserSettings(session.user.id);
  if (settings instanceof Error) throw settings;

  const tabs = [
    {
      label: "Profile",
      value: "profile",
      href: "/settings?tab=profile",
      component: <ProfileTab />,
    },
    {
      label: "Account",
      value: "account",
      href: "/settings?tab=account",
      component: <AccountTab userTimezone={settings.userTimezone} />,
    },
    {
      label: "Notifications",
      value: "notifications",
      href: "/settings?tab=notifications",
      component: (
        <NotificationsTab
          emailAccountActivity={settings.emailAccountActivity}
          pushAmbitionReminders={settings.pushAmbitionReminders}
        />
      ),
    },
    {
      label: "Appearance",
      value: "appearance",
      href: "/settings?tab=appearance",
      component: <AppearanceTab />,
    },
  ];

  return (
    <div className="mx-auto space-y-8 p-6 md:p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs.Tabs key={searchParams.tab} defaultValue={searchParams.tab} className="w-full">
        <Tabs.TabsList className="grid w-full md:w-[600px] grid-cols-4">
          {tabs.map((tab) => (
            <Tabs.TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link prefetch={true} href={tab.href}>
                {tab.label}
              </Link>
            </Tabs.TabsTrigger>
          ))}
        </Tabs.TabsList>

        {tabs.map((tab) => (
          <Tabs.TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {tab.component}
          </Tabs.TabsContent>
        ))}
      </Tabs.Tabs>
    </div>
  );
}
