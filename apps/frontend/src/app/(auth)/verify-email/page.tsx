import AuthShell from "@/components/(auth)/auth-shell";
import { VerifyEmailClient } from "@/components/(auth)/verify-email/verify-email-client";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";

// Verification mutates state, so never serve a cached render.
export const dynamic = "force-dynamic";

export const metadata: Metadata = createPrivateMetadata("Verify Email", "Verify your AmbitiousYou email address");

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage(props: VerifyEmailPageProps) {
  const { token } = await props.searchParams;

  return (
    <AuthShell mood="dawn" tagline="Almost there.">
      {token ? (
        <VerifyEmailClient token={token} />
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Invalid verification link</h1>
          <p className="text-sm text-muted-foreground">This verification link is missing or invalid. Open your account settings to request a new one.</p>
          <Link href="/login" className="text-sm underline underline-offset-4 hover:text-foreground!">
            Back to login
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
