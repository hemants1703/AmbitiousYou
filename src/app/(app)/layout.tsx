import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Metadata } from "next";
import { SidebarController } from "@/src/components/dashboard/SidebarController";

export const metadata: Metadata = {
  title: {
    template: "%s | AmbitiousYou",
    default: "Dashboard | AmbitiousYou",
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: Get user data from AuthProvider context
  // For now, using placeholder data
  const userData = { id: "placeholder-user-id", email: "user@example.com" };
  const profileData = [{ firstName: "User", lastName: "" }];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarController userData={userData} profileData={profileData}>
        <ScrollArea className="flex-1 overflow-hidden">
          <main className="flex-1 max-w-7xl mx-auto w-full">{children}</main>
        </ScrollArea>
      </SidebarController>
    </div>
  );
}
