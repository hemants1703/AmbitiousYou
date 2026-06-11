import AuthShell from "@/components/(auth)/auth-shell";
import { SignupForm } from "@/components/(auth)/signup/signup-form";
import { redirectIfAuthenticated } from "@/lib/auth";
import { Metadata } from "next";
import { signupAction } from "@/lib/actions/(auth)/signup/signup";
import { signupInitialState } from "@/lib/actions/(auth)/signup/signup-state";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
  openGraph: {
    title: "Sign Up - AmbitiousYou",
    description: "Create a new account",
  },
  twitter: {
    title: "Sign Up - AmbitiousYou",
    description: "Create a new account",
  },
};

export default async function SignupPage() {
  await redirectIfAuthenticated();

  return (
    <AuthShell mood="dawn" tagline="Your first ambition takes about a minute." vignette="moves">
      <SignupForm action={signupAction} initialState={signupInitialState} />
    </AuthShell>
  );
}
