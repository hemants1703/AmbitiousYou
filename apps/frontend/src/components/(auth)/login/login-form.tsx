"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { LoginState } from "@/lib/actions/(auth)/login/login";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

type LoginFormProps = Omit<React.ComponentProps<"form">, "action"> & {
  action: (state: LoginState, formData: FormData) => Promise<LoginState>;
  initialState: LoginState;
};

export function LoginForm({ action, initialState, className, ...props }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className={cn("flex flex-col gap-6", className)} action={formAction} {...props}>
      <FieldGroup>
        <div className="flex flex-col gap-1">
          <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">Enter your email below to login to your account</p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required className="border-border bg-background" autoComplete="email" spellCheck={false} autoFocus value={email} onChange={(event) => setEmail(event.target.value)} />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required className="border-border bg-background" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Field>

        {state.error ? (
          <p className="flex items-start gap-2 text-sm text-destructive" aria-live="polite">
            <TriangleAlertIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </p>
        ) : null}

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircleIcon aria-hidden="true" className="size-4 animate-spin" />
                Logging in…
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4 hover:text-foreground!">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
