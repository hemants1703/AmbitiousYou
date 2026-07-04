"use client";

import { PendingButton } from "@/components/(app)/mutations/pending-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { resetPasswordAction } from "@/lib/actions/(app)/settings/reset-password";
import { KeyRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ChangePasswordStep = 1 | 2;

export function ResetPasswordCard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ChangePasswordStep>(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signOutAllDevices, setSignOutAllDevices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  function resetForm() {
    setStep(1);
    setNewPassword("");
    setConfirmPassword("");
    setSignOutAllDevices(false);
    setError(null);
    setIsPending(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  }

  function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStep(2);
  }

  async function handleSubmit() {
    setError(null);
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
        setOpen(false);
        resetForm();
        router.push("/login");
        return;
      }

      toast.success("Your password has been updated.");
      setOpen(false);
      resetForm();
    } catch {
      toast.error("Unable to update your password. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRoundIcon className="size-4 text-accent-brand" />
            Password
          </CardTitle>
          <CardDescription>Update the password you use to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" onClick={() => setOpen(true)}>
            Change password
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              {step === 1 ? "Step 1 of 2 — choose a new password." : "Step 2 of 2 — confirm how to apply the change."}
            </DialogDescription>
          </DialogHeader>

          {step === 1 ? (
            <form onSubmit={handleContinue} className="space-y-4">
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

              {error ? (
                <p className="text-sm text-destructive" aria-live="polite">
                  {error}
                </p>
              ) : null}

              <DialogFooter>
                <Button type="submit">Continue</Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your new password will take effect immediately. You can stay signed in on this device or end every active session.
              </p>

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
                  disabled={isPending}
                  aria-label="Sign out of all devices"
                  className="mt-0.5 shrink-0"
                />
              </div>

              {error ? (
                <p className="text-sm text-destructive" aria-live="polite">
                  {error}
                </p>
              ) : null}

              <DialogFooter className="gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => {
                    setError(null);
                    setStep(1);
                  }}
                >
                  Back
                </Button>
                <PendingButton type="button" isPending={isPending} onClick={handleSubmit}>
                  Update password
                </PendingButton>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
