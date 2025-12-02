import * as Card from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ForgotPasswordForm from "@/features/(auth)/forgot-password/ForgotPasswordForm";
import confirmSession from "@/lib/auth/confirmSession";
import { redirect, RedirectType } from "next/navigation";

export default async function ForgotPassword() {
  let session;
  try {
    session = await confirmSession();
  } catch (error) {
    console.log(error);
    session = null;
  }

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
                  Forgot Password
                </Card.CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your email to reset your password
                </p>
              </Card.CardHeader>
            </div>
            <Separator orientation="vertical" className="hidden lg:block" />
            <div className="lg:w-1/2 p-8 bg-background">
              <Card.CardContent className="space-y-4">
                <ForgotPasswordForm />
              </Card.CardContent>
            </div>
          </div>
        </Card.Card>
      </div>
    </div>
  );
}
