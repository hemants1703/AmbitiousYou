import AmbitiousYouLogo from "@/components/(landing)/ambitiousyou-logo";
import { ForgotPasswordForm } from "@/components/(auth)/forgot-password/forgot-password-form";
import { forgotPasswordAction } from "@/lib/actions/(auth)/forgot-password/forgot-password";
import { forgotPasswordInitialState } from "@/lib/actions/(auth)/forgot-password/forgot-password-state";
import { redirectIfAuthenticated } from "@/lib/auth";
import "@/styles/auth-background.css";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your AmbitiousYou password",
};

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();

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
            <ForgotPasswordForm action={forgotPasswordAction} initialState={forgotPasswordInitialState} />
          </div>
        </div>
      </div>
      <div className="auth-background auth-background-login hidden lg:block" aria-hidden="true" />
    </div>
  );
}
