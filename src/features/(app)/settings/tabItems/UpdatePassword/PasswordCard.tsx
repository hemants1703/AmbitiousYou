import * as Card from "@/components/ui/card";
import UpdatePasswordForm from "./UpdatePasswordForm";

export default function PasswordCard() {
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
