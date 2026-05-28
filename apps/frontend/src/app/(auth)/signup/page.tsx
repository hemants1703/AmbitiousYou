import { signupAction } from "@/actions/(auth)/signup/signup";
import { signupInitialState } from "@/actions/(auth)/signup/signup-state";
import AmbitiousYouLogo from "@/components/(landing)/ambitiousyou-logo";
import { SignupForm } from "@/components/(auth)/signup/signup-form";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
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
      <div className="relative hidden bg-muted lg:block">
        <Image src="/auth.svg" alt="Image" fill className="object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
  );
}
