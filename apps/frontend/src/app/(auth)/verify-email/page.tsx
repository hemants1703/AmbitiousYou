import AmbitiousYouLogo from "@/components/(landing)/ambitiousyou-logo";
import { VerifyEmailClient } from "@/components/(auth)/verify-email/verify-email-client";
import "@/styles/auth-background.css";
import { Metadata } from "next";
import Link from "next/link";

// Verification mutates state, so never serve a cached render.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your AmbitiousYou email address",
};

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage(props: VerifyEmailPageProps) {
  const { token } = await props.searchParams;

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
            {token ? (
              <VerifyEmailClient token={token} />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="text-2xl font-bold">Invalid verification link</h1>
                <p className="text-sm text-muted-foreground">
                  This verification link is missing or invalid. Open your account settings to request a new one.
                </p>
                <Link href="/login" className="text-sm underline underline-offset-4 hover:text-foreground!">
                  Back to login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="auth-background auth-background-signup hidden lg:block" aria-hidden="true" />
    </div>
  );
}
