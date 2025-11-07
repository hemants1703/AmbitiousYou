import * as Card from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import LoginForm from "@/features/(auth)/login/LoginForm";
import getOptionalSession from "@/lib/auth/getOptionalSession";
import { redirect, RedirectType } from "next/navigation";

export default async function Login() {
  const session = await getOptionalSession();

  if (session) {
    redirect("/dashboard", RedirectType.replace);
  }

  return (
    <div className="w-full flex items-center justify-center py-12 pb-24">
      <div className="w-full max-w-5xl">
        <Card.Card className="shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-background">
              <Card.CardHeader className="text-center lg:text-left">
                <Card.CardTitle className="text-3xl lg:text-5xl font-bold">
                  Welcome Back
                </Card.CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Log in to your account</p>
              </Card.CardHeader>
            </div>
            <Separator orientation="vertical" className="hidden lg:block" />
            <div className="lg:w-1/2 p-8 bg-background">
              <Card.CardContent className="space-y-4">
                <LoginForm />
              </Card.CardContent>
              <Card.CardFooter className="flex flex-col items-center space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link prefetch={true} href="/signup" className="underline hover:text-primary">
                    Sign Up
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
