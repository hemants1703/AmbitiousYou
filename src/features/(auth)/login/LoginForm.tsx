"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader2 } from "@tabler/icons-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { LoginState, loginUserAction } from "../actions";

export default function LoginForm() {
  const [formState, setFormState] = useState<LoginState>({
    email: "",
    password: "",
  });
  const [formErrors, loginAction, isLoginPending] = useActionState<LoginState, FormData>(
    loginUserAction,
    formState
  );

  useEffect(() => {
    if (formErrors?.errors?.message) {
      toast.error("Err!", {
        description:
          formErrors.errors.message?.[0] ?? "There was an error logging you in. Please try again.",
        duration: 5000,
      });
    }
  }, [formErrors?.errors]);

  return (
    <form action={loginAction} className="space-y-4">
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
          className="mt-1"
          required
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
        />
        {formErrors?.errors?.email && (
          <p className="text-red-500 text-sm mt-1">{formErrors.errors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <Label htmlFor="password" className="block text-sm font-medium">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          className="mt-1"
          required
          value={formState.password}
          onChange={(e) => setFormState({ ...formState, password: e.target.value })}
        />
        {formErrors?.errors?.password && (
          <p className="text-red-500 text-sm mt-1">{formErrors.errors.password}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full mt-4" disabled={isLoginPending}>
        {isLoginPending ? (
          <div className="flex justify-center items-center gap-2">
            <IconLoader2 className="animate-spin size-5" />
            Logging you in...
          </div>
        ) : (
          "Log In"
        )}
      </Button>
    </form>
  );
}
