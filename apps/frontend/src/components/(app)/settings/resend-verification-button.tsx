"use client";

import { Button } from "@/components/ui/button";
import { resendVerificationAction } from "@/lib/actions/(app)/settings/resend-verification";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import { useState } from "react";

export function ResendVerificationButton() {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);
    await toastMutation(
      async () => {
        try {
          return await resendVerificationAction();
        } catch {
          return { error: "Unable to resend the verification email. Please try again." };
        }
      },
      {
        loading: "Sending verification email…",
        success: "Verification email sent. Check your inbox.",
        error: (msg) => msg,
      },
      { getError: (r) => r.error },
    );
    setIsPending(false);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={isPending}>
      {isPending ? "Sending…" : "Resend verification email"}
    </Button>
  );
}
