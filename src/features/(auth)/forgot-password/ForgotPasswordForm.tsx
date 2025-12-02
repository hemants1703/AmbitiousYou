"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IconCheck, IconLoader2 } from "@tabler/icons-react";
import { useActionState, useState } from "react";
import { forgotPasswordAction, ForgotPasswordState } from "../actions";

export default function ForgotPasswordForm() {
  const [formState, setFormState] = useState<ForgotPasswordState>({
    email: "",
  });
  const [actionResponse, formAction, isForgotPasswordPending] = useActionState<
    ForgotPasswordState,
    FormData
  >(forgotPasswordAction, formState);

  return (
    <form action={formAction} className="space-y-4">
      {/* Email Input */}
      <div>
        <Label htmlFor="email" className="block text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          className={cn("mt-1", actionResponse?.errors?.message && "border-destructive")}
          required
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
        />
        {actionResponse?.success ? (
          <p className="text-green-500 text-sm mt-1 w-xs">
            A password reset email has been sent to your email address.
          </p>
        ) : (
          actionResponse?.errors?.message && (
            <p className="text-red-500 text-sm mt-1 w-xs">{actionResponse.errors.message}</p>
          )
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full mt-4"
        disabled={isForgotPasswordPending || formState.email.length === 0}
      >
        {isForgotPasswordPending ? (
          <div className="flex justify-center items-center gap-2">
            <IconLoader2 className="animate-spin size-5" />
            Sending reset email...
          </div>
        ) : (
          "Send Reset Email"
        )}
      </Button>
    </form>
  );
}
