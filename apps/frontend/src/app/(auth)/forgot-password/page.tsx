import AuthShell from "@/components/(auth)/auth-shell";
import { ForgotPasswordForm } from "@/components/(auth)/forgot-password/forgot-password-form";
import { forgotPasswordAction } from "@/lib/actions/(auth)/forgot-password/forgot-password";
import { forgotPasswordInitialState } from "@/lib/actions/(auth)/forgot-password/forgot-password-state";
import { redirectIfAuthenticated } from "@/lib/auth";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = createPrivateMetadata("Forgot Password", "Reset your AmbitiousYou password");

export default function ForgotPasswordPage() {
  return (
    <AuthShell mood="midnight" tagline="We’ll get you back in.">
      <Suspense fallback={<ForgotPasswordForm action={forgotPasswordAction} initialState={forgotPasswordInitialState} />}>
        <ForgotPasswordContent />
      </Suspense>
    </AuthShell>
  );
}

async function ForgotPasswordContent() {
  await redirectIfAuthenticated();
  return <ForgotPasswordForm action={forgotPasswordAction} initialState={forgotPasswordInitialState} />;
}
