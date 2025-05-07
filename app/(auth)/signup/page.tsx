import * as Card from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SignUpForm from "./SignupForm";

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
                {/* <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="block text-sm font-medium">
                      First Name
                    </Label>
                    <Input id="firstName" type="text" placeholder="First name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="block text-sm font-medium">
                      Last Name
                    </Label>
                    <Input id="lastName" type="text" placeholder="Last name" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </Label>
                  <Input id="email" type="email" placeholder="Enter your email" className="mt-1" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="password" className="block text-sm font-medium">
                      Password
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircledIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Password should contain:</p>
                          <ul className="list-disc pl-4 mt-1 text-xs">
                            <li>At least 8 characters</li>
                            <li>One uppercase letter</li>
                            <li>One lowercase letter</li>
                            <li>One number</li>
                            <li>One special character</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input id="password" type="password" placeholder="Create a password" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm Password
                  </Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your password" 
                    className="mt-1" 
                  />
                </div> */}
              </Card.CardContent>
              {/* <CardFooter className="flex flex-col items-center space-y-4 mt-4">
                <Button className="w-full">Create Account</Button>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="underline hover:text-primary">
                    Log In
                  </Link>
                </p>
              </CardFooter> */}
            </div>
          </div>
        </Card.Card>
      </div>
    </div>
  );
}
