"use client";

import * as Avatar from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { SupabaseProfileData } from "@/src/types";
import { User } from "@supabase/supabase-js";
import updateProfileAction from "./actions";
import { toast } from "sonner";

export default function ProfileTab({
  profilesData,
  userData,
}: {
  profilesData: SupabaseProfileData[];
  userData: User;
}) {
  let { firstName, lastName } = profilesData[0];
  const { id: userId, email } = userData;
  let initialsOfUsersName = firstName.charAt(0) + lastName.charAt(0); // Placeholder for initials

  const handleProfileUpdate = async () => {
    const { success, error, data } = await updateProfileAction(userId, firstName, lastName);

    if (!success && error) {
      toast.error("Error updating profile", {
        description: error,
      });
      // console.error("Error updating profile: ", error);
    }

    if (success) {
      toast.success("Profile updated successfully");
      console.log("Profile updated successfully: ", data);
    }
  };

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="flex flex-col items-center gap-4">
        <Avatar.Avatar className="h-24 w-24">
          <Avatar.AvatarImage src="/avatar-placeholder.jpg" alt="Profile picture" />
          <Avatar.AvatarFallback>{initialsOfUsersName}</Avatar.AvatarFallback>
        </Avatar.Avatar>
        <Button variant="outline" size="sm">
          Change Avatar
        </Button>
      </div>

      <div className="flex-1 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="John"
              defaultValue={firstName}
              onChange={(e) => {
                firstName = e.target.value;
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              defaultValue={lastName}
              onChange={(e) => {
                lastName = e.target.value;
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            defaultValue={email}
            disabled
          />
        </div>

        <div className="flex justify-end space-x-2 mt-10">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleProfileUpdate}>Save Changes</Button>
        </div>

        {/* <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Write a short bio about yourself"
                      defaultValue="Software developer with 5+ years experience in web technologies."
                      className="min-h-[120px]"
                    />
                  </div> */}
      </div>
    </div>
  );
}
