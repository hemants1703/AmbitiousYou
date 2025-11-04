import * as Card from "@/components/ui/card";
import ProfileCard from "../../settings/ProfileCard";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import confirmSession from "@/lib/auth/confirmSession";
import { UserService } from "@/services/userService";

export default async function ProfileTab() {
  const session = await confirmSession();

  const userData = await UserService.fetchUserById(session.user.id);
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
        <ProfileCard userData={userData} />
      </Card.CardContent>
    </Card.Card>
  );
}
