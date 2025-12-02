"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";
import { resetPasswordAction, type ResetPasswordState } from "../actions";
import { IconLoader2 } from "@tabler/icons-react";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm(props: ResetPasswordFormProps) {
  const { token } = props;

  const [formState, setFormState] = useState<ResetPasswordState>({
    token: token,
    password: "",
    confirmPassword: "",
  });
  const [actionResponse, formAction, isResetPasswordPending] = useActionState<
    ResetPasswordState,
    FormData
  >(resetPasswordAction, formState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      {actionResponse?.errors?.message && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {actionResponse.errors.message[0]}
        </div>
      )}

      {actionResponse?.success && (
        <div className="p-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm">
          Password reset successfully! Redirecting to login...
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter new password"
          required
          disabled={isResetPasswordPending}
          value={formState.password}
          onChange={(e) => setFormState({ ...formState, password: e.target.value })}
        />
        {actionResponse?.errors?.password && (
          <p className="text-sm text-red-600">{actionResponse.errors.password[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          required
          disabled={isResetPasswordPending}
          value={formState.confirmPassword}
          onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })}
        />
        {actionResponse?.errors?.confirmPassword && (
          <p className="text-sm text-red-600">{actionResponse.errors.confirmPassword[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={
          isResetPasswordPending ||
          formState.password.length === 0 ||
          formState.confirmPassword.length === 0
        }
      >
        {isResetPasswordPending ? (
          <div className="flex justify-center items-center gap-2">
            <IconLoader2 className="animate-spin size-5" />
            Resetting...
          </div>
        ) : actionResponse?.errors?.confirmPassword ? (
          <p className="text-sm text-red-600">{actionResponse.errors.confirmPassword[0]}</p>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}
