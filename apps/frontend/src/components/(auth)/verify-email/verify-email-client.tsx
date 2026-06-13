"use client";

import { Button } from "@/components/ui/button";
import { verifyEmailAction } from "@/lib/actions/(auth)/verify-email/verify-email";
import { CircleCheckBigIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type VerifyStatus = "loading" | "success" | "error";

export function VerifyEmailClient(props: { token: string }) {
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Guard against React Strict Mode double-invoking the effect (the token is
  // single-use, so a second call would fail after the first succeeds).
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let active = true;
    verifyEmailAction(props.token)
      .then((result) => {
        if (!active) return;
        if (result.error) {
          setErrorMessage(result.error);
          setStatus("error");
        } else {
          setStatus("success");
        }
      })
      .catch(() => {
        if (!active) return;
        setErrorMessage("Something went wrong. Please try again.");
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [props.token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
        <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Verifying your email…</h1>
        <p className="text-sm text-muted-foreground">This will only take a moment.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CircleCheckBigIcon className="size-6 text-primary dark:text-chart-1" />
        <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Email verified</h1>
        <p className="text-sm text-muted-foreground">Your email address has been confirmed. Welcome aboard!</p>
        <Button asChild className="mt-2">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <TriangleAlertIcon className="size-6 text-destructive" />
      <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Verification failed</h1>
      <p className="text-sm text-muted-foreground">{errorMessage}</p>
      <p className="text-sm text-muted-foreground">
        Open your account settings to request a new verification email.
      </p>
      <Button asChild variant="outline" className="mt-2">
        <Link href="/login">Back to login</Link>
      </Button>
    </div>
  );
}
