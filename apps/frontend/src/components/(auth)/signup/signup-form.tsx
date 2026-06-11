"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { SignupState } from "@/lib/actions/(auth)/signup/signup";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

type SignupFormProps = Omit<React.ComponentProps<"form">, "action"> & {
  action: (state: SignupState, formData: FormData) => Promise<SignupState>;
  initialState: SignupState;
};

export function SignupForm({ action, initialState, className, ...props }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className={cn("flex flex-col gap-6", className)} action={formAction} {...props}>
      <FieldGroup>
        <div className="flex flex-col gap-1">
          <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Create your account</h1>
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
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-foreground!">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
