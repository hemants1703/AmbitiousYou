import * as Card from "@/src/components/ui/card";
import ProfileCard from "./ProfileCard";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { getProfilesTableData } from "@/src/utils/supabase/tablesDataProvider";
import { createClient } from "@/src/utils/supabase/server";

export default async function ProfileTab() {
  const supabase = await createClient();
  const {
    data: { user: userData },
    error: userDoesNotExist,
  } = await supabase.auth.getUser();

  if (userDoesNotExist || !userData) {
    toast.error("User not found.");
    redirect("/login");
  }

  const profilesData = await getProfilesTableData(userData.id);

  if (!profilesData || profilesData.length === 0) {
    toast.error("No profile found.");
    redirect("/login");
  }

  return (
    <Card.Card>
      <Card.CardHeader>
        <Card.CardTitle>Profile Information</Card.CardTitle>
        <Card.CardDescription>
          Update your personal information and public profile
        </Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent className="space-y-6">
        <ProfileCard profilesData={profilesData} userData={userData} />
      </Card.CardContent>
    </Card.Card>
  );
}
