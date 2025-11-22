"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFieldError } from "@/lib/utils";
import { IconEye, IconEyeOff, IconLoader2, IconLock } from "@tabler/icons-react";
import { useActionState, useEffect, useState } from "react";
import { updatePasswordAction, UpdatePasswordActionState } from "./actions";
import { toast } from "sonner";

export default function UpdatePasswordForm() {
  const [formState, setFormState] = useState<UpdatePasswordActionState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, formAction, isPending] = useActionState<UpdatePasswordActionState, FormData>(
    updatePasswordAction,
    formState
  );

  useEffect(() => {
    if (formErrors?.errors) {
      toast.error("Error", {
        description: formErrors.errors.general?.[0] ?? "Failed to update password",
        closeButton: true,
      });
    }
  }, [formErrors?.errors]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="space-y-1">
        <Label htmlFor="currentPassword">Current Password</Label>
        <PasswordInput
          name="currentPassword"
          value={formState.currentPassword}
          onChange={(value) => setFormState({ ...formState, currentPassword: value })}
        />
        {formErrors?.errors?.currentPassword && (
          <p className="text-sm text-red-500">
            {getFieldError(formErrors.errors, "currentPassword")}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="newPassword">New Password</Label>
        <PasswordInput
          name="newPassword"
          value={formState.newPassword}
          onChange={(value) => setFormState({ ...formState, newPassword: value })}
        />
        {formErrors?.errors?.newPassword && (
          <p className="text-sm text-red-500">{getFieldError(formErrors.errors, "newPassword")}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <PasswordInput
          name="confirmPassword"
          value={formState.confirmPassword}
          onChange={(value) => setFormState({ ...formState, confirmPassword: value })}
        />
        {formErrors?.errors?.confirmPassword && (
          <p className="text-sm text-red-500">
            {getFieldError(formErrors.errors, "confirmPassword")}
          </p>
        )}
      </div>

      <Button size="tiny" type="submit" disabled={isPending} className="self-end">
        {isPending ? (
          <span className="flex items-center gap-2">
            <IconLoader2 className="animate-spin" />
            Updating Password...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <IconLock className="size-4" />
            Update Password
          </span>
        )}
      </Button>
    </form>
  );
}

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex gap-4 items-center justify-between">
      <Input
        id={props.name}
        name={props.name}
        type={showPassword ? "text" : "password"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="font-mono font-semibold"
      />
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        tabIndex={-1}
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <IconEyeOff /> : <IconEye />}
      </Button>
    </div>
  );
}
