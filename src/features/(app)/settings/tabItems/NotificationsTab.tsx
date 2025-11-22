import * as Card from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function NotificationsTab() {
  return (
    <>
      <Card.Card>
        <Card.CardHeader>
          <Card.CardTitle>Notification Preferences</Card.CardTitle>
          <Card.CardDescription>Choose how and when you want to be notified</Card.CardDescription>
        </Card.CardHeader>
        <Card.CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Project updates</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your projects
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Account activity</p>
                  <p className="text-sm text-muted-foreground">
                    Receive security alerts and account notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Marketing emails</p>
                  <p className="text-sm text-muted-foreground">
                    Receive offers, surveys and updates
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Push Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Direct messages</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you receive new messages
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="font-medium">Task assignments</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when tasks are assigned to you
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </Card.CardContent>
        <Card.CardFooter className="flex justify-end">
          <Button size="tiny">Save Preferences</Button>
        </Card.CardFooter>
      </Card.Card>

      <Card.Card>
        <Card.CardHeader>
          <Card.CardTitle>Notification Schedule</Card.CardTitle>
          <Card.CardDescription>
            Set quiet hours when you won&apos;t receive notifications
          </Card.CardDescription>
        </Card.CardHeader>
        <Card.CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quietFrom">Quiet hours start</Label>
              <Select.Select defaultValue="22:00">
                <Select.SelectTrigger id="quietFrom">
                  <Select.SelectValue placeholder="Select time" />
                </Select.SelectTrigger>
                <Select.SelectContent>
                  <Select.SelectItem value="20:00">8:00 PM</Select.SelectItem>
                  <Select.SelectItem value="21:00">9:00 PM</Select.SelectItem>
                  <Select.SelectItem value="22:00">10:00 PM</Select.SelectItem>
                  <Select.SelectItem value="23:00">11:00 PM</Select.SelectItem>
                </Select.SelectContent>
              </Select.Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quietTo">Quiet hours end</Label>
              <Select.Select defaultValue="07:00">
                <Select.SelectTrigger id="quietTo">
                  <Select.SelectValue placeholder="Select time" />
                </Select.SelectTrigger>
                <Select.SelectContent>
                  <Select.SelectItem value="06:00">6:00 AM</Select.SelectItem>
                  <Select.SelectItem value="07:00">7:00 AM</Select.SelectItem>
                  <Select.SelectItem value="08:00">8:00 AM</Select.SelectItem>
                  <Select.SelectItem value="09:00">9:00 AM</Select.SelectItem>
                </Select.SelectContent>
              </Select.Select>
            </div>
          </div>
        </Card.CardContent>
        <Card.CardFooter className="flex justify-end">
          <Button size="tiny">Save Schedule</Button>
        </Card.CardFooter>
      </Card.Card>
    </>
  );
}
