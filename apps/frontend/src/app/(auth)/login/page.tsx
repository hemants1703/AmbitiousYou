import { loginAction } from "@/actions/(auth)/login/login";
import { loginInitialState } from "@/actions/(auth)/login/login-state";
import AmbitiousYouLogo from "@/components/(landing)/ambitiousyou-logo";
import { LoginForm } from "@/components/(auth)/login/login-form";
import "@/styles/auth-background.css";
import Link from "next/link";

export default function LoginPage() {
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
            <LoginForm action={loginAction} initialState={loginInitialState} />
          </div>
        </div>
      </div>
      <div className="auth-background auth-background-login hidden lg:block" aria-hidden="true" />
    </div>
  );
}
