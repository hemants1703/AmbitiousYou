"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ResetPasswordState } from "@/lib/actions/(auth)/reset-password/reset-password";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useActionState, useState } from "react";

type ResetPasswordFormProps = Omit<React.ComponentProps<"form">, "action"> & {
  action: (state: ResetPasswordState, formData: FormData) => Promise<ResetPasswordState>;
  initialState: ResetPasswordState;
  token: string;
};

export function ResetPasswordForm({ action, initialState, token, className, ...props }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form className={cn("flex flex-col gap-6", className)} action={formAction} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-balance text-sm text-muted-foreground">Choose a new password for your account.</p>
        </div>

        <input type="hidden" name="token" value={token} />

        <Field>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="border-border bg-background"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <FieldDescription>At least 8 characters, including a letter and a number.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="border-border bg-background"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </Field>

        {state.error ? (
          <p className="text-sm text-destructive" aria-live="polite">
            {state.error}
          </p>
        ) : null}

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Resetting..." : "Reset password"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            <Link href="/login" className="underline underline-offset-4 hover:text-foreground!">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
