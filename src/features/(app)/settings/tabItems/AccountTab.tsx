import * as Card from "@/components/ui/card";
import UpdatePasswordForm from "./UpdatePassword/UpdatePasswordForm";
import TimezoneSelector from "./UpdateTimezone/TimezoneSelector";

interface AccountTabProps {
  userTimezone: string;
}

export default function AccountTab(props: AccountTabProps) {
  return (
    <>
      <PasswordCard />
      <TimezoneCard userTimezone={props.userTimezone} />
    </>
  );
}

function PasswordCard() {
  return (
    <Card.Card>
      <Card.CardHeader>
        <Card.CardTitle>Account Security</Card.CardTitle>
        <Card.CardDescription>Manage your password and security settings</Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent className="space-y-4">
        <UpdatePasswordForm />
      </Card.CardContent>
    </Card.Card>
  );
}

function TimezoneCard(props: Pick<AccountTabProps, "userTimezone">) {
  return (
    <Card.Card>
      <Card.CardHeader>
        <Card.CardTitle>Timezone</Card.CardTitle>
        <Card.CardDescription>
          Choose your timezone to ensure all your Ambitions are managed in the correct timezone
        </Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent>
        <TimezoneSelector currentTimezone={props.userTimezone} />
      </Card.CardContent>
    </Card.Card>
  );
}
