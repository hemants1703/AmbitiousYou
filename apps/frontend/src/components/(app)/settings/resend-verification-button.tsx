"use client";

import { Button } from "@/components/ui/button";
import { resendVerificationAction } from "@/lib/actions/(app)/settings/resend-verification";
import { useState } from "react";
import { toast } from "sonner";

export function ResendVerificationButton() {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);
    try {
      const result = await resendVerificationAction();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Verification email sent. Check your inbox.");
      }
    } catch {
      toast.error("Unable to resend the verification email. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={isPending}>
      {isPending ? "Sending..." : "Resend verification email"}
    </Button>
  );
}
