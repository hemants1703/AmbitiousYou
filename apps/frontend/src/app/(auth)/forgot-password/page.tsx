import AuthShell from "@/components/(auth)/auth-shell";
import { ForgotPasswordForm } from "@/components/(auth)/forgot-password/forgot-password-form";
import { forgotPasswordAction } from "@/lib/actions/(auth)/forgot-password/forgot-password";
import { forgotPasswordInitialState } from "@/lib/actions/(auth)/forgot-password/forgot-password-state";
import { redirectIfAuthenticated } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your AmbitiousYou password",
};

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();

  return (
    <AuthShell mood="midnight" tagline="We’ll get you back in.">
      <ForgotPasswordForm action={forgotPasswordAction} initialState={forgotPasswordInitialState} />
    </AuthShell>
  );
}
