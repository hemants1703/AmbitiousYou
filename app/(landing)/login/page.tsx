import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Login() {
  return (
    <div className="w-full flex items-center justify-center py-12 pb-24">
      <div className="w-full max-w-5xl">
        <Card className="shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Left side (Header content) */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-background">
              <CardHeader className="text-center lg:text-left">
                <CardTitle className="text-3xl lg:text-5xl font-bold">
                  Welcome Back
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Log in to your account
                </p>
              </CardHeader>
            </div>
            {/* Vertical separator only visible on desktop */}
            <Separator orientation="vertical" className="hidden lg:block" />
            {/* Right side (Form components) */}
            <div className="lg:w-1/2 p-8 bg-background">
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </Label>
                  <Input id="email" type="email" placeholder="Enter your email" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </Label>
                  <Input id="password" type="password" placeholder="Enter your password" className="mt-1" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-4 mt-4">
                <Button className="w-full">Login</Button>
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline hover:text-primary">
                    Sign Up
                  </Link>
                </p>
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}