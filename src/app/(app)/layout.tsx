import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Metadata } from "next";
import { SidebarController } from "@/src/components/dashboard/SidebarController";
import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import { getProfilesTableData } from "@/src/utils/supabase/tablesDataProvider";
import { User } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: {
    template: "%s | AmbitiousYou",
    default: "Dashboard | AmbitiousYou",
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data, error: userDoesNotExist } = await supabase.auth.getUser();

  // console.log("Logged In user: ", userData);

  // Check if the user is logged in
  if (userDoesNotExist) {
    redirect("/login");
  }

  const userData: User = data.user;
  const { id } = userData;

  const profileData = await getProfilesTableData(id);

  return (
    // <AuthProvider>
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarController userData={userData} profileData={profileData}>
        <ScrollArea className="flex-1 overflow-hidden">
          <main className="flex-1 max-w-7xl mx-auto w-full">{children}</main>
        </ScrollArea>
      </SidebarController>
    </div>
    // </AuthProvider>
  );
}
