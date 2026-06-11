import AuthShell from "@/components/(auth)/auth-shell";
import { ResetPasswordForm } from "@/components/(auth)/reset-password/reset-password-form";
import { resetPasswordWithTokenAction } from "@/lib/actions/(auth)/reset-password/reset-password";
import { resetPasswordInitialState } from "@/lib/actions/(auth)/reset-password/reset-password-state";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new AmbitiousYou password",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage(props: ResetPasswordPageProps) {
  const { token } = await props.searchParams;

  return (
    <AuthShell mood="midnight" tagline="Choose a new password.">
      {token ? (
        <ResetPasswordForm action={resetPasswordWithTokenAction} initialState={resetPasswordInitialState} token={token} />
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Invalid reset link</h1>
          <p className="text-sm text-muted-foreground">This password reset link is missing or invalid. Request a new one to continue.</p>
          <Link href="/forgot-password" className="text-sm underline underline-offset-4 hover:text-foreground!">
            Request a new reset link
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
