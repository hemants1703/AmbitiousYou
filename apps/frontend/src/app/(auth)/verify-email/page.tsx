import AuthShell from "@/components/(auth)/auth-shell";
import { VerifyEmailClient } from "@/components/(auth)/verify-email/verify-email-client";
import { createPrivateMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = createPrivateMetadata("Verify Email", "Verify your AmbitiousYou email address");

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default function VerifyEmailPage(props: VerifyEmailPageProps) {
  return (
    <AuthShell mood="dawn" tagline="Almost there.">
      <Suspense fallback={<VerifyEmailPending />}>
        <VerifyEmailContent searchParams={props.searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function VerifyEmailContent(props: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await props.searchParams;

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Invalid verification link</h1>
        <p className="text-sm text-muted-foreground">This verification link is missing or invalid. Open your account settings to request a new one.</p>
        <Link href="/login" className="text-sm underline underline-offset-4 hover:text-foreground!">
          Back to login
        </Link>
      </div>
    );
  }

  return <VerifyEmailClient token={token} />;
}

function VerifyEmailPending() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <h1 className="font-brand text-2xl font-semibold tracking-[-0.02em]">Loading…</h1>
      <p className="text-sm text-muted-foreground">Checking your verification link.</p>
    </div>
  );
}
