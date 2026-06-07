"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ForgotPasswordState } from "@/lib/actions/(auth)/forgot-password/forgot-password";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useActionState, useState } from "react";

type ForgotPasswordFormProps = Omit<React.ComponentProps<"form">, "action"> & {
  action: (state: ForgotPasswordState, formData: FormData) => Promise<ForgotPasswordState>;
  initialState: ForgotPasswordState;
};

export function ForgotPasswordForm({ action, initialState, className, ...props }: ForgotPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [email, setEmail] = useState("");

  return (
    <form className={cn("flex flex-col gap-6", className)} action={formAction} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a link to reset it.
          </p>
        </div>

        {state.success ? (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            If an account exists for that email, we&apos;ve sent a password reset link. Check your inbox and spam folder.
          </p>
        ) : (
          <>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="border-border bg-background"
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>

            {state.error ? (
              <p className="text-sm text-destructive" aria-live="polite">
                {state.error}
              </p>
            ) : null}

            <Field>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Sending..." : "Send reset link"}
              </Button>
            </Field>
          </>
        )}

        <Field>
          <FieldDescription className="text-center">
            Remembered your password?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-foreground!">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
