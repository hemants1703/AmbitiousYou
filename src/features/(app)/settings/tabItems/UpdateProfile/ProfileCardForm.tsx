"use client";

import * as Avatar from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/db/schema";
import { IconLoader2, IconMail } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateUserAction, sendVerificationEmailAction } from "./actions";

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

  const handleEmailVerification = async () => {
    const result = await sendVerificationEmailAction(props.userData.email);
    if (!result.success) {
      toast.error(result.error ?? "Failed to send verification email");
    } else {
      toast.success("Verification email sent!");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between gap-8 items-center">
        <div className="flex flex-col items-center gap-4">
          <Avatar.Avatar className="h-24 w-24">
            <Avatar.AvatarImage src="/avatar-placeholder.jpg" alt="Profile picture" />
            <Avatar.AvatarFallback>{initialsOfUsersName}</Avatar.AvatarFallback>
          </Avatar.Avatar>
          {/* <Button variant="outline" size="sm">
          Change Avatar
        </Button> */}
        </div>

        <div className="w-full space-y-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="John"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </div>

        <div className="w-full space-y-2">
          <div className="flex items-center gap-2 ">
            <Label htmlFor="email">Email</Label>
            {!props.userData.emailVerified ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500 text-white text-xs">Email not verified</Badge>
                <Button
                  size="tiny"
                  onClick={handleEmailVerification}
                  type="button"
                  variant="outline"
                >
                  <IconMail className="size-4" />
                  Send verification email
                </Button>
              </div>
            ) : (
              <Badge className="bg-green-500 text-white text-xs">Email verified</Badge>
            )}
          </div>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={props.userData.email}
            disabled
          />
        </div>
      </div>

      <Button size="tiny" onClick={handleProfileUpdate} disabled={isPending} className="self-end">
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
  );
}
