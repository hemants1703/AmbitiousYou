import * as Card from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SignUpForm from "@/features/(auth)/signup/SignUpForm";
import confirmSession from "@/lib/auth/confirmSession";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

export default async function Signup() {
  const session = await confirmSession();

  if (session) {
    redirect("/dashboard", RedirectType.replace);
  }

  return (
    <div className="w-full flex items-center justify-center pt-12 pb-24">
      <div className="w-full max-w-5xl">
        <Card.Card className="shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Left side (Header content) */}
            <div className="w-fit p-8 flex flex-col justify-center bg-background">
              <Card.CardHeader className="text-center lg:text-left">
                <Card.CardTitle className="text-5xl lg:text-6xl font-bold">
                  Join <br />
                  <span className="font-light">Ambitious</span>
                  <span>You</span>
                </Card.CardTitle>
                <p className="text-lg text-muted-foreground mt-2">
                  Create an account to get started
                </p>
              </Card.CardHeader>
            </div>
            {/* Vertical separator only visible on desktop */}
            <Separator orientation="vertical" className="hidden lg:block" />
            {/* Right side (Form components) */}
            <div className="lg:w-1/2 p-8 bg-background">
              <Card.CardContent className="space-y-4">
                <SignUpForm />
              </Card.CardContent>
              <Card.CardFooter className="flex flex-col items-center space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link prefetch={true} href="/login" className="underline hover:text-primary">
                    Log In
                  </Link>
                </p>
              </Card.CardFooter>
            </div>
          </div>
        </Card.Card>
      </div>
    </div>
  );
}
