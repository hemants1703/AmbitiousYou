import AuthShell from "@/components/(auth)/auth-shell";
import { LoginForm } from "@/components/(auth)/login/login-form";
import { redirectIfAuthenticated } from "@/lib/auth";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { loginAction } from "@/lib/actions/(auth)/login/login";
import { loginInitialState } from "@/lib/actions/(auth)/login/login-state";
import { Suspense } from "react";

export const metadata: Metadata = createPrivateMetadata("Login", "Login to your AmbitiousYou account");

export default function LoginPage() {
  return (
    <AuthShell mood="midnight" tagline="Pick up where you left off." vignette="stats">
      <Suspense fallback={<LoginForm action={loginAction} initialState={loginInitialState} />}>
        <LoginContent />
      </Suspense>
    </AuthShell>
  );
}

async function LoginContent() {
  await redirectIfAuthenticated();
  return <LoginForm action={loginAction} initialState={loginInitialState} />;
}
