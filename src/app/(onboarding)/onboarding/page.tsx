import Link from "next/link";

export default function OnboardingPage() {
  return (
    <Link prefetch={true} href="/dashboard">
      Dashboard
    </Link>
  );
}
