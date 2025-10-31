import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import * as Tabs from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import * as Select from "@/components/ui/select";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Metadata } from "next";
import ProfileTab from "@/features/settings/ProfileTab";
import confirmSession from "@/lib/auth/confirmSession";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Settings() {
  const session = await confirmSession();

  return (
    <div className="mx-auto space-y-8 p-6 md:p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs.Tabs defaultValue="profile" className="w-full">
        <Tabs.TabsList className="grid w-full md:w-[600px] grid-cols-4">
          <Tabs.TabsTrigger value="profile">Profile</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="account">Account</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="notifications">Notifications</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="appearance">Appearance</Tabs.TabsTrigger>
        </Tabs.TabsList>

        <Tabs.TabsContent value="profile" className="space-y-6">
          <ProfileTab />
        </Tabs.TabsContent>

        {/* Account settings */}
        <Tabs.TabsContent value="account" className="space-y-6">
          <Card.Card>
            <Card.CardHeader>
              <Card.CardTitle>Account Security</Card.CardTitle>
              <Card.CardDescription>
                Manage your password and security settings
              </Card.CardDescription>
            </Card.CardHeader>
            <Card.CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={"**************"} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </Card.CardContent>
            <Card.CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Update Password</Button>
            </Card.CardFooter>
          </Card.Card>

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
                  <p className="text-sm text-muted-foreground">
                    View or generate new recovery codes
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Codes
                </Button>
              </div>
            </Card.CardContent>
          </Card.Card>
        </Tabs.TabsContent>

        {/* Notifications settings */}
        <Tabs.TabsContent value="notifications" className="space-y-6">
          <Card.Card>
            <Card.CardHeader>
              <Card.CardTitle>Notification Preferences</Card.CardTitle>
              <Card.CardDescription>
                Choose how and when you want to be notified
              </Card.CardDescription>
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
              <Button>Save Preferences</Button>
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
              <Button>Save Schedule</Button>
            </Card.CardFooter>
          </Card.Card>
        </Tabs.TabsContent>

        {/* Appearance settings */}
        <Tabs.TabsContent value="appearance" className="space-y-6">
          <Card.Card>
            <Card.CardHeader>
              <Card.CardTitle>Theme</Card.CardTitle>
              <Card.CardDescription>Customize how the application looks</Card.CardDescription>
            </Card.CardHeader>
            <Card.CardContent className="space-y-6">
              <ThemeSelector />
            </Card.CardContent>
          </Card.Card>
        </Tabs.TabsContent>
      </Tabs.Tabs>
    </div>
  );
}
