"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoaderIcon } from "lucide-react";
import { signupAction } from "../actions";
import { toast } from "sonner";

export type SignupState =
  | {
      errors?: {
        plan?: string[] | undefined;
        firstName?: string[] | undefined;
        lastName?: string[] | undefined;
        email?: string[] | string;
        password?: string[] | undefined;
        message?: string | undefined;
      };
    }
  | undefined;

export default function SignupForm({ signupPlan }: { signupPlan: string | string[] }) {
  const [signupErrors, action, isSignupPending] = useActionState<SignupState, FormData>(
    signupAction,
    undefined
  );

  useEffect(() => {
    if (signupErrors?.errors?.message) {
      toast.error(signupErrors.errors.message, {
        description: "Please try again.",
        duration: 5000,
      });
    }

    if (signupErrors?.errors?.plan) {
      toast.error(signupErrors.errors.plan, {
        description: "Please select a plan.",
        duration: 5000,
      });
    }
  }, [signupErrors?.errors?.message]);

  return (
    <form action={action} className="space-y-4">
      <Input type="hidden" name="plan" value={signupPlan} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First name"
            className="mt-1"
            required
          />
          {signupErrors?.errors?.firstName && (
            <p className="text-red-500 text-sm mt-1">{signupErrors.errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last name"
            className="mt-1"
            required
          />
          {signupErrors?.errors?.lastName && (
            <p className="text-red-500 text-sm mt-1">{signupErrors.errors.lastName}</p>
          )}
        </div>
      </div>
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
        {signupErrors?.errors?.email && (
          <p className="text-red-500 text-sm mt-1">{signupErrors.errors.email}</p>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <Label htmlFor="password" className="block text-sm font-medium">
            Password
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Password should contain:</p>
                <ul className="list-disc pl-4 mt-1 text-xs">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          className="mt-1"
          required
        />
        {signupErrors?.errors?.password && (
          <p className="text-red-500 text-sm mt-1">{signupErrors.errors.password}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSignupPending}>
        {isSignupPending ? (
          <div className="flex justify-center items-center gap-2">
            <LoaderIcon className="animate-spin size-5" />
            Creating Account...
          </div>
        ) : (
          "Create Account"
        )}
      </Button>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline hover:text-primary">
          Log In
        </Link>
      </p>
    </form>
  );
}
