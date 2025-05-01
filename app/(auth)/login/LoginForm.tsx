"use client";

import { useActionState, useEffect } from "react";
import { loginUserAction } from "../actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";

export type LoginState =
  | {
      errors?: {
        email?: string[] | string;
        password?: string[] | string;
        message?: string | undefined;
      };
    }
  | undefined;

export default function LoginForm() {
  const [loginErrors, loginAction, isLoginPending] = useActionState<LoginState, FormData>(
    loginUserAction,
    undefined
  );

  useEffect(() => {
    if (loginErrors?.errors?.message) {
      toast.error(loginErrors.errors.message, {
        description: "Please try again.",
        duration: 5000,
      });
    }
  }, [loginErrors?.errors?.message]);

  return (
    <form action={loginAction} className="space-y-4">
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
        />
        {loginErrors?.errors?.email && (
          <p className="text-red-500 text-sm mt-1">{loginErrors.errors.email}</p>
        )}
      </div>
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
        />
        {loginErrors?.errors?.password && (
          <p className="text-red-500 text-sm mt-1">{loginErrors.errors.password}</p>
        )}
      </div>
      <Button type="submit" className="w-full mt-4" disabled={isLoginPending}>
        {isLoginPending ? (
          <div className="flex justify-center items-center gap-2">
            <LoaderIcon className="animate-spin size-5" />
            Logging you in...
          </div>
        ) : (
          "Log In"
        )}
      </Button>
    </form>
  );
}
