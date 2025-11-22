"use client";

import * as Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile, User } from "@/db/schema";
import updateProfileAction from "@/features/(app)/settings/actions";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

export default function ProfileCard({
  profileData,
  userData,
}: {
  profileData: Profile;
  userData: User;
}) {
  const { id: userId, email } = userData;
  const [userProfile, setUserProfile] = useState<Profile>(profileData);
  const [isPending, setIsPending] = useState<boolean>(false);

  const initialsOfUsersName = userProfile.firstName.charAt(0) + userProfile.lastName.charAt(0); // Placeholder for initials

  const handleProfileUpdate = async (): Promise<void> => {
    setIsPending(true);

    const { success, error, data } = await updateProfileAction(
      userProfile.firstName,
      userProfile.lastName
    );

    if (!success && error) {
      toast.error("Error updating profile", {
        description: error,
      });
      console.error("Error updating profile: ", error);
    }

    if (success) {
      toast.success("Profile updated successfully");
      console.log("Profile updated successfully: ", data);
    }

    setIsPending(false);
  };

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <div className="flex flex-col items-center gap-4">
        <Avatar.Avatar className="h-24 w-24">
          <Avatar.AvatarImage src="/avatar-placeholder.jpg" alt="Profile picture" />
          <Avatar.AvatarFallback>{initialsOfUsersName}</Avatar.AvatarFallback>
        </Avatar.Avatar>
        {/* <Button variant="outline" size="sm">
          Change Avatar
        </Button> */}
      </div>

      <div className="flex-1 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="John"
              defaultValue={userProfile.firstName}
              onChange={(e) => {
                setUserProfile({
                  ...userProfile,
                  firstName: e.target.value,
                });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              defaultValue={userProfile.lastName}
              onChange={(e) => {
                setUserProfile({
                  ...userProfile,
                  lastName: e.target.value,
                });
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
          <Button size="tiny" onClick={handleProfileUpdate} disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2Icon />
                Saving...
              </span>
            ) : (
              <span>Save Changes</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
