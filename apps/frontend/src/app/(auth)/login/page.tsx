import AuthShell from "@/components/(auth)/auth-shell";
import { LoginForm } from "@/components/(auth)/login/login-form";
import { redirectIfAuthenticated } from "@/lib/auth";
import { Metadata } from "next";
import { loginAction } from "@/lib/actions/(auth)/login/login";
import { loginInitialState } from "@/lib/actions/(auth)/login/login-state";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
  openGraph: {
    title: "Login - AmbitiousYou",
    description: "Login to your account",
  },
  twitter: {
    title: "Login - AmbitiousYou",
    description: "Login to your account",
  },
};

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <AuthShell mood="midnight" tagline="Pick up where you left off." vignette="stats">
      <LoginForm action={loginAction} initialState={loginInitialState} />
    </AuthShell>
  );
}
