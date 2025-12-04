import * as Card from "@/components/ui/card";
import confirmSession from "@/lib/auth/confirmSession";
import { UserService } from "@/services/userService";
import { redirect, RedirectType } from "next/navigation";
import ProfileCardForm from "@/features/(app)/settings/tabItems/UpdateProfile/ProfileCardForm";

export default async function ProfileTab() {
  const session = await confirmSession();

  if (!session) {
    redirect("/login", RedirectType.replace);
  }

  const userService = new UserService();

  const userData = await userService.fetchUserById(session.user.id);
  if (userData instanceof Error) throw userData;

  return (
    <Card.Card>
      <Card.CardHeader>
        <Card.CardTitle>Profile Information</Card.CardTitle>
        <Card.CardDescription>
          Update your personal information and public profile
        </Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent className="space-y-6">
        <ProfileCardForm userData={userData} />
      </Card.CardContent>
    </Card.Card>
  );
}
