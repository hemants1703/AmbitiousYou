import AuthShell from "@/components/(auth)/auth-shell";
import { brandCopy } from "@/lib/brand";
import { SignupForm } from "@/components/(auth)/signup/signup-form";
import { redirectIfAuthenticated } from "@/lib/auth";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { signupAction } from "@/lib/actions/(auth)/signup/signup";
import { signupInitialState } from "@/lib/actions/(auth)/signup/signup-state";
import { Suspense } from "react";

export const metadata: Metadata = createPrivateMetadata("Sign Up", "Create your free AmbitiousYou account");

export default function SignupPage() {
  return (
    <AuthShell mood="dawn" tagline={brandCopy.signup.tagline} vignette="moves">
      <Suspense fallback={<SignupForm action={signupAction} initialState={signupInitialState} />}>
        <SignupContent />
      </Suspense>
    </AuthShell>
  );
}

async function SignupContent() {
  await redirectIfAuthenticated();
  return <SignupForm action={signupAction} initialState={signupInitialState} />;
}
