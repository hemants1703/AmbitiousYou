import { signupAction } from "@/actions/(auth)/signup/signup";
import { signupInitialState } from "@/actions/(auth)/signup/signup-state";
import AmbitiousYouLogo from "@/components/(landing)/ambitiousyou-logo";
import { SignupForm } from "@/components/(auth)/signup/signup-form";
import { redirectIfAuthenticated } from "@/lib/auth";
import "@/styles/auth-background.css";
import Link from "next/link";
import { Metadata } from "next";

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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <AmbitiousYouLogo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm action={signupAction} initialState={signupInitialState} />
          </div>
        </div>
      </div>
      <div className="auth-background auth-background-signup hidden lg:block" aria-hidden="true" />
    </div>
  );
}
