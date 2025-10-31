"use client";

import * as Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/db/schema";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

interface ProfileCardProps {
  userData: User;
}

export default function ProfileCard(props: ProfileCardProps) {
  const { userData } = props;
  const [userProfile, setUserProfile] = useState<User>(userData);
  const [isPending, setIsPending] = useState<boolean>(false);

  const initialsOfUsersName = userProfile.name.charAt(0) + userProfile.name.charAt(0); // Placeholder for initials

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
              defaultValue={userProfile.name}
              onChange={(e) => {
                setUserProfile({
                  ...userProfile,
                  name: e.target.value,
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
            defaultValue={props.userData.email}
            disabled
          />
        </div>

        <div className="flex justify-end space-x-2 mt-10">
          <Button onClick={() => {}} disabled={isPending}>
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
