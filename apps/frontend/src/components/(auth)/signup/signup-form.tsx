"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useActionState, useState } from "react";
import type { SignupState } from "@/actions/(auth)/signup/signup";
import Link from "next/link";

type SignupFormProps = Omit<React.ComponentProps<"form">, "action"> & {
  action: (state: SignupState, formData: FormData) => Promise<SignupState>;
  initialState: SignupState;
};

export function SignupForm({ action, initialState, className, ...props }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form className={cn("flex flex-col gap-6", className)} action={formAction} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-balance text-sm text-muted-foreground">Fill in the form below to create your account</p>
        </div>

        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" name="name" type="text" placeholder="John Doe" required className="border-border bg-background" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required className="border-border bg-background" autoComplete="email" spellCheck={false} value={email} onChange={(event) => setEmail(event.target.value)} />
          <FieldDescription>We&apos;ll use this to contact you. We will not share your email with anyone else.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required className="border-border bg-background" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <FieldDescription>Must be at least 8 characters long.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input id="confirmPassword" name="confirmPassword" type="password" required className="border-border bg-background" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>

        {state.error ? (
          <p className="text-sm text-destructive" aria-live="polite">
            {state.error}
          </p>
        ) : null}

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
