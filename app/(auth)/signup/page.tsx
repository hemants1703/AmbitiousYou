import * as Card from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SignUpForm from "./SignUpForm";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Signup({ searchParams }: { searchParams: SearchParams }) {
  // Extract the plan from the search parameters
  let { plan } = await searchParams;

  if (!plan) {
    plan = "free"; // Default to "free" if no plan is provided
  }

  return (
    <div className="w-full flex items-center justify-center pt-12 pb-24">
      <div className="w-full max-w-5xl">
        <Card.Card className="shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Left side (Header content) */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-background">
              <Card.CardHeader className="text-center lg:text-left">
                <Card.CardTitle className="text-5xl lg:text-6xl font-bold">
                  Join <br />
                  <span className="font-light">Ambitious</span>You
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
                <SignUpForm signupPlan={plan} />
              </Card.CardContent>
            </div>
          </div>
        </Card.Card>
      </div>
    </div>
  );
}
