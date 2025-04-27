"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoaderIcon } from "lucide-react";
import { signupAction } from "./actions";

export default function SignUpForm() {
  const [errors, action, isPending] = useActionState(signupAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </Label>
          <Input id="firstName" type="text" placeholder="First name" className="mt-1" required />
          {errors?.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <Label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </Label>
          <Input id="lastName" type="text" placeholder="Last name" className="mt-1" required />
          {errors?.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="email" className="block text-sm font-medium">
          Email
        </Label>
        <Input id="email" type="email" placeholder="Enter your email" className="mt-1" required />
        {errors?.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
          type="password"
          placeholder="Create a password"
          className="mt-1"
          required
        />
        {errors?.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      {/* Confirm Password Field */}
      {/* <div>
        <Label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          className="mt-1"
          required
        />
      </div> */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
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
