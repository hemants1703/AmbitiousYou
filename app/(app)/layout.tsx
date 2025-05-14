import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";
import { SidebarController } from "@/components/dashboard/SidebarController";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getAmbitionsTableData, getMilestonesTableData, getPlansTableData, getProfilesTableData, getTasksTableData } from "@/utils/supabase/tablesDataProvider";
import { User } from "@supabase/supabase-js";
import { Ambition, Milestone, SupabasePlansData, SupabaseProfileData, Task } from "@/types";

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

  const profileData: SupabaseProfileData[] = await getProfilesTableData(id);
  const plansData: SupabasePlansData[] = await getPlansTableData(id);
  const ambitionsData: Ambition[] = await getAmbitionsTableData(id);
  const tasksData: Task[] = await getTasksTableData(id);
  const milestonesData: Milestone[] = await getMilestonesTableData(id);

  return (
    // <AuthProvider>
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarController userData={userData} profileData={profileData} plansData={plansData} ambitionsData={ambitionsData} tasksData={tasksData} milestonesData={milestonesData}>
        <ScrollArea className="flex-1 overflow-hidden">
          <main className="flex-1 p-6 md:p-8 pt-6 max-w-7xl mx-auto w-full">{children}</main>
        </ScrollArea>
      </SidebarController>
    </div>
    // </AuthProvider>
  );
}
