import AuthShell from "@/components/(auth)/auth-shell";
import { ResetPasswordForm } from "@/components/(auth)/reset-password/reset-password-form";
import { resetPasswordWithTokenAction } from "@/lib/actions/(auth)/reset-password/reset-password";
import { resetPasswordInitialState } from "@/lib/actions/(auth)/reset-password/reset-password-state";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = createPrivateMetadata("Reset Password", "Choose a new AmbitiousYou password");

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default function ResetPasswordPage(props: ResetPasswordPageProps) {
  return (
    <AuthShell mood="midnight" tagline="Choose a new password.">
      <Suspense fallback={<ResetPasswordPending />}>
        <ResetPasswordContent searchParams={props.searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function ResetPasswordContent(props: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await props.searchParams;

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Invalid reset link</h1>
        <p className="text-sm text-muted-foreground">This password reset link is missing or invalid. Request a new one to continue.</p>
        <Link href="/forgot-password" className="text-sm underline underline-offset-4 hover:text-foreground!">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm action={resetPasswordWithTokenAction} initialState={resetPasswordInitialState} token={token} />;
}

function ResetPasswordPending() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Loading…</h1>
      <p className="text-sm text-muted-foreground">Checking your reset link.</p>
    </div>
  );
}
