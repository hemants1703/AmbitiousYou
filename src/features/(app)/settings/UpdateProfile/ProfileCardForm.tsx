"use client";

import * as Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/db/schema";
import { IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import updateUserAction from "./actions";
import { toast } from "sonner";

interface ProfileCardFormProps {
  userData: User;
}

export default function ProfileCardForm(props: ProfileCardFormProps) {
  const [userData, setUserData] = useState<User>(props.userData);
  const [isPending, setIsPending] = useState<boolean>(false);

  const initialsOfUsersName = userData.name.charAt(0);

  const handleProfileUpdate = async () => {
    setIsPending(true);

    toast.promise(updateUserAction(userData.name), {
      loading: "Updating profile...",
      success: (data) => {
        setUserData({
          ...userData,
          name: data.data?.name ?? userData.name,
        });

        setIsPending(false);

        return "Profile updated successfully";
      },
      error: (error) => {
        setIsPending(false);
        return error.error;
      },
    });
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={props.userData.email}
            disabled
          />
        </div>

        <div className="flex justify-end space-x-2 mt-10">
          <Button size="tiny" onClick={handleProfileUpdate} disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <IconLoader2 className="animate-spin" />
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
