import AmbitiousYouLogo from "@/components/(landing)/ambitiousyou-logo";
import { ResetPasswordForm } from "@/components/(auth)/reset-password/reset-password-form";
import { resetPasswordWithTokenAction } from "@/lib/actions/(auth)/reset-password/reset-password";
import { resetPasswordInitialState } from "@/lib/actions/(auth)/reset-password/reset-password-state";
import "@/styles/auth-background.css";
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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <AmbitiousYouLogo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {token ? (
              <ResetPasswordForm
                action={resetPasswordWithTokenAction}
                initialState={resetPasswordInitialState}
                token={token}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="text-2xl font-bold">Invalid reset link</h1>
                <p className="text-sm text-muted-foreground">
                  This password reset link is missing or invalid. Request a new one to continue.
                </p>
                <Link href="/forgot-password" className="text-sm underline underline-offset-4 hover:text-foreground!">
                  Request a new reset link
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="auth-background auth-background-login hidden lg:block" aria-hidden="true" />
    </div>
  );
}
