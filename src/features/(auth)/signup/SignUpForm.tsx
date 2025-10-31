"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { signupAction, SignupActionState } from "@/features/(auth)/actions";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SignUpForm() {
  const [formState, setFormState] = useState<SignupActionState>({
    fullName: "",
    email: "",
    password: "",
  });
  const [signUpFormState, action, isSignupPending] = useActionState<SignupActionState, FormData>(
    signupAction,
    formState
  );

  useEffect(() => {
    if (signUpFormState?.errors?.message) {
      toast.error("Err!", {
        description: "There was an error creating your account. Please try again.",
        duration: 5000,
      });
    }

    if (signUpFormState?.errors?.password) {
      toast.error("Err!", {
        description: "Please enter a valid password",
        duration: 5000,
      });
    }
  }, [signUpFormState?.errors]);

  return (
    <form action={action} className="space-y-4 lg:min-w-96">
      {/* Full Name Input */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="fullName" className="block text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Full name"
            className={cn("mt-1", signUpFormState?.errors?.fullName ? "border-red-500" : "")}
            required
            value={formState.fullName}
            onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
          />
          {signUpFormState?.errors?.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {signUpFormState.errors.fullName.join(", ")}
            </p>
          )}
        </div>
      </div>

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
          className={cn("mt-1", signUpFormState?.errors?.email ? "border-red-500" : "")}
          required
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
        />
        {signUpFormState?.errors?.email && (
          <p className="text-red-500 text-sm mt-1">{signUpFormState.errors.email.join(", ")}</p>
        )}
      </div>

      {/* Password Input */}
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
          className={cn("mt-1", signUpFormState?.errors?.password ? "border-red-500" : "")}
          required
          value={formState.password}
          onChange={(e) =>
            setFormState({ ...formState, password: e.target.value, errors: undefined })
          }
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSignupPending}>
        {isSignupPending ? (
          <div className="flex justify-center items-center gap-2">
            <Loader2Icon className="animate-spin size-5" />
            Creating Account...
          </div>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
