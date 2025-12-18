import { SidebarController } from "@/components/SidebarController";
import { ScrollArea } from "@/components/ui/scroll-area";
import confirmSession from "@/lib/auth/confirmSession";
import { User } from "better-auth";
import { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | AmbitiousYou",
    default: "AmbitiousYou",
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await confirmSession();

  if (!session) {
    redirect("/login", RedirectType.replace);
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      <SidebarController userData={session.user as User}>
        <ScrollArea className="flex-1 overflow-hidden">
          <main className="flex-1 max-w-7xl mx-auto w-full">{children}</main>
        </ScrollArea>
      </SidebarController>
    </div>
  );
}
