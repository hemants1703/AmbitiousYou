import Link from "next/link";
import {
  Check,
  ArrowRight,
  BarChart3,
  Zap,
  Shield,
  Rocket,
  Clock,
  Users,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

export default function Features() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Features Built for the Ambitious
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Tools designed to elevate your performance, streamline your
                workflow, and help you achieve your most ambitious goals.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild variant={"default"}>
                <Link href="/signup" className="h-10 px-8">
                  Get Started Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Core Features
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to take your productivity to the next level.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Performance Analytics"
              description="Track your progress with detailed metrics and visualizations to identify your strengths and areas for improvement."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Smart Automations"
              description="Save time with intelligent workflows that handle repetitive tasks so you can focus on what matters most."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Secure Environment"
              description="Enterprise-grade security ensures your data and progress are protected at all times."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Time Management"
              description="Optimize your schedule with AI-powered time blocking and priority management tools."
            />
            <FeatureCard
              icon={<Rocket className="h-10 w-10 text-primary" />}
              title="Goal Acceleration"
              description="Set ambitious targets and leverage our goal acceleration framework to achieve them faster."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Collaboration Tools"
              description="Work effectively with your team through seamless integrations and real-time collaborative features."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Why ambitious people choose us
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Transform your potential into exceptional results
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Our platform is designed specifically for those who refuse to
                settle for mediocrity. See how we&apos;ve helped thousands of
                ambitious professionals exceed their goals.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild variant={"default"}>
                  <Link href="/testimonials" className="h-10 px-8">
                    See Success Stories
                  </Link>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <BenefitItem>
                Increase productivity by up to 37% within the first month
              </BenefitItem>
              <BenefitItem>
                Reduce time spent on administrative tasks by 64%
              </BenefitItem>
              <BenefitItem>
                Achieve goals 2.5x faster with our structured approach
              </BenefitItem>
              <BenefitItem>
                Join a community of 50,000+ high-achievers
              </BenefitItem>
              <BenefitItem>
                Access to premium resources valued at over $5,000
              </BenefitItem>
              <BenefitItem>
                30-day money-back guarantee - no questions asked
              </BenefitItem>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 ">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to elevate your ambitions?
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl/relaxed">
                Start achieving you ambitions faster today! No credit card required.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button asChild variant={"default"}>
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: Readonly<{ icon: React.ReactNode; title: string; description: string }>) {
  return (
    <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 bg-background shadow-sm transition-all hover:shadow-md">
      <div className="p-3 rounded-full bg-muted">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
}

function BenefitItem({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex items-start gap-2">
      <Check className="h-5 w-5 mt-1 text-primary" />
      <p className="text-base font-medium leading-none">{children}</p>
    </div>
  );
}
