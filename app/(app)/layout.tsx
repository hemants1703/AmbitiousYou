import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";
import { SidebarController } from "@/components/dashboard/SidebarController";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getProfilesTableData } from "@/utils/supabase/tablesDataProvider";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: {
    template: "%s | AmbitiousYou",
    default: "Dashboard",
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data, error: userDoesNotExist } = await supabase.auth.getUser();

  // console.log("Logged In user: ", userData);

  // Check if the user is logged in
  if (userDoesNotExist) {
    toast.error("You are not logged in. Please log in to access the dashboard.");
    redirect("/login");
  }

  const userData: User = data.user;
  const { id } = userData;

  const profileData = await getProfilesTableData(id);

  return (
    // <AuthProvider>
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarController userData={userData} profileData={profileData}>
        <ScrollArea className="flex-1 overflow-auto">
          <main className="flex-1 p-6 md:p-8 pt-6 max-w-7xl mx-auto w-full">{children}</main>
        </ScrollArea>
      </SidebarController>
    </div>
    // </AuthProvider>
  );
}
