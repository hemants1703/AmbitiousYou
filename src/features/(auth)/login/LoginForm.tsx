"use client";

import { useActionState, useEffect, useState } from "react";
import { LoginState, loginUserAction } from "../actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function LoginForm() {
  const [formState, setFormState] = useState<LoginState>({
    email: "",
    password: "",
  });
  const [loginFormState, loginAction, isLoginPending] = useActionState<LoginState, FormData>(
    loginUserAction,
    formState
  );

  useEffect(() => {
    if (loginFormState?.errors?.message) {
      toast.error("Err!", {
        description: "There was an error logging you in. Please try again.",
        duration: 5000,
      });
    }
  }, [loginFormState?.errors]);

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
        {loginFormState?.errors?.email && (
          <p className="text-red-500 text-sm mt-1">{loginFormState.errors.email}</p>
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
        {loginFormState?.errors?.password && (
          <p className="text-red-500 text-sm mt-1">{loginFormState.errors.password}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full mt-4" disabled={isLoginPending}>
        {isLoginPending ? (
          <div className="flex justify-center items-center gap-2">
            <Loader2Icon className="animate-spin size-5" />
            Logging you in...
          </div>
        ) : (
          "Log In"
        )}
      </Button>
    </form>
  );
}
