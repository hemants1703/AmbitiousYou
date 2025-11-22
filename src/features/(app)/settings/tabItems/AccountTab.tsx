import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import PasswordCard from "./UpdatePassword/PasswordCard";

export default function AccountTab() {
  return (
    <>
      <PasswordCard />

      <Card.Card>
        <Card.CardHeader>
          <Card.CardTitle>Two-Factor Authentication</Card.CardTitle>
          <Card.CardDescription>
            Add an extra layer of security to your account
          </Card.CardDescription>
        </Card.CardHeader>
        <Card.CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="font-medium">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app to generate verification codes
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div>
              <p className="font-medium">Recovery codes</p>
              <p className="text-sm text-muted-foreground">View or generate new recovery codes</p>
            </div>
            <Button variant="outline" size="tiny">
              Manage Codes
            </Button>
          </div>
        </Card.CardContent>
      </Card.Card>
    </>
  );
}
