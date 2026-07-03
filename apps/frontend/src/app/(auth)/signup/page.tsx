import AuthShell from "@/components/(auth)/auth-shell";
import { brandCopy } from "@/lib/brand";
import { SignupForm } from "@/components/(auth)/signup/signup-form";
import { redirectIfAuthenticated } from "@/lib/auth";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { signupAction } from "@/lib/actions/(auth)/signup/signup";
import { signupInitialState } from "@/lib/actions/(auth)/signup/signup-state";

export const metadata: Metadata = createPrivateMetadata("Sign Up", "Create your free AmbitiousYou account");

export default async function SignupPage() {
  await redirectIfAuthenticated();

  return (
    <AuthShell mood="dawn" tagline={brandCopy.signup.tagline} vignette="moves">
      <SignupForm action={signupAction} initialState={signupInitialState} />
    </AuthShell>
  );
}
