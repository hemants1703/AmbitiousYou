import { DashboardClient } from "./DashboardClient";
import { createClient } from "@/src/utils/supabase/server";
import {
  getAmbitionsTableData,
  getMilestonesTableData,
  getPlansTableData,
  getProfilesTableData,
  getTasksTableData,
} from "@/src/utils/supabase/tablesDataProvider";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error: userDoesNotExist } = await supabase.auth.getUser();

  // Check if the user is logged in
  if (userDoesNotExist) {
    redirect("/login");
  }

  const userData = data.user;
  const { id } = userData;

  const profileData = await getProfilesTableData(id);

  const ambitions = await getAmbitionsTableData(id);
  const tasks = await getTasksTableData(id);
  const milestones = await getMilestonesTableData(id);

  const plans = await getPlansTableData(id);

  const isProUser = plans[0].planMonthlyPrice > 0;

  return (
    <DashboardClient
      profileData={profileData}
      ambitions={ambitions}
      tasks={tasks}
      milestones={milestones}
      isProUser={isProUser}
    />
  );
}
