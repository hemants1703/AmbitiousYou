"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { resetPasswordAction } from "@/lib/actions/(app)/settings/reset-password";
import { KeyRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ResetPasswordCard() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signOutAllDevices, setSignOutAllDevices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsPending(true);
    try {
      const result = await resetPasswordAction(newPassword, signOutAllDevices);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      if (result.signedOut) {
        toast.success("Password updated. Signing you out of all devices…");
        router.push("/login");
        return;
      }

      toast.success("Your password has been updated.");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Unable to update your password. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRoundIcon className="size-4 text-primary dark:text-chart-1" />
          Reset password
        </CardTitle>
        <CardDescription>Set a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              required
              autoComplete="new-password"
              className="border-border bg-background"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <FieldDescription>At least 8 characters, including a letter and a number.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              className="border-border bg-background"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </Field>

          <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/50 p-4">
            <div className="min-w-0 space-y-0.5">
              <Label htmlFor="sign-out-all" className="cursor-pointer text-sm font-medium text-foreground">
                Sign out of all devices
              </Label>
              <p className="text-xs text-muted-foreground">
                End every active session, including this one. You&apos;ll need to log in again.
              </p>
            </div>
            <Switch
              id="sign-out-all"
              checked={signOutAllDevices}
              onCheckedChange={setSignOutAllDevices}
              aria-label="Sign out of all devices"
              className="mt-0.5 shrink-0"
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" aria-live="polite">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
