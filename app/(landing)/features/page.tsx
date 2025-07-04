import Link from "next/link";
import {
  Check,
  ArrowRight,
  BarChart3,
  Zap,
  Clock,
  Target,
  Filter,
  PlusCircle,
  X,
  Star,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { Button } from "@/components/ui/button";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Features() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full pt-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-2">
              Trusted by 50,000+ ambitious professionals
            </div>
            <div className="space-y-2">
              <h1
                className={`${bricolage.className} text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl`}
              >
                Features Built for the Ambitious
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Tools designed to elevate your performance, streamline your workflow, and help you
                achieve your most ambitious goals.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild variant={"default"} size="lg">
                <Link prefetch={true} href="/signup" className="h-10 px-8">
                  Get Started Free
                </Link>
              </Button>
              <Button asChild variant={"outline"}>
                <a href="#how-it-works" className="h-10 px-8">
                  See How It Works
                </a>
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
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 ">
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Ambition Dashboard"
              description="Visualize all your goals in one place with our intuitive dashboard that provides at-a-glance progress tracking and priority management."
            />
            <div className="relative">
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                MOST POPULAR
              </div>
              <FeatureCard
                icon={<Target className="h-10 w-10 text-primary" />}
                title="Dual Tracking Methods"
                description="Choose between task-based or milestone-based progress tracking for each ambition, tailored to your unique goals and working style."
              />
            </div>
            <FeatureCard
              icon={<Filter className="h-10 w-10 text-primary" />}
              title="Custom Organization"
              description="Categorize and prioritize your ambitions with flexible color-coding, and filtering options for perfect organization."
            />
            <FeatureCard
              icon={<PlusCircle className="h-10 w-10 text-primary" />}
              title="Quick Ambition Creation"
              description="Our streamlined ambition creation process gets you from idea to execution in minutes, not hours."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How AmbitiousYou Works
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our simple process helps you transform goals into achievements
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold">Create Your Ambition</h3>
              <p className="text-muted-foreground">
                Define your goal with our guided setup process, setting deadlines, priorities and
                tracking methods.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Break down your ambition into manageable milestones and track your progress
                visually.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold">Achieve & Celebrate</h3>
              <p className="text-muted-foreground">
                Reach your goals faster with data-backed insights and celebrate your accomplishments
                along the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with Screenshot */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Why ambitious people choose us
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Transform your potential into exceptional results
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Our platform is designed specifically for those who refuse to settle for mediocrity.
                See how we&apos;ve helped thousands of ambitious professionals exceed their goals.
              </p>

              <div className="space-y-4 mt-6">
                <BenefitItem>Increase productivity by up to 37% within the first month</BenefitItem>
                <BenefitItem>Reduce time spent on administrative tasks by 64%</BenefitItem>
                <BenefitItem>Achieve goals 2.5x faster with our structured approach</BenefitItem>
                <BenefitItem>Join a community of 50,000+ high-achievers</BenefitItem>
              </div>

              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Button asChild variant={"default"}>
                  <Link prefetch={true} href="/signup" className="h-10 px-8">
                    Start Your Journey
                  </Link>
                </Button>
              </div>
            </div>

            {/* App screenshot or illustration */}
            <div className="rounded-lg border bg-background p-2 shadow-lg">
              <div className="overflow-hidden rounded-md">
                {/* Replace with actual screenshot from your dashboard */}
                <div className="bg-muted aspect-video w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Comparison Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                The Ambitious Difference
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                See how your life transforms when you start using AmbitiousYou
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-background p-8 rounded-lg border shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-muted-foreground">Before AmbitiousYou</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-destructive">
                    <X className="h-5 w-5" />
                  </div>
                  <p>Goals scattered across multiple apps and notes</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-destructive">
                    <X className="h-5 w-5" />
                  </div>
                  <p>Unclear progress tracking leads to abandoned ambitions</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-destructive">
                    <X className="h-5 w-5" />
                  </div>
                  <p>Overwhelming feeling when managing multiple goals</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-destructive">
                    <X className="h-5 w-5" />
                  </div>
                  <p>No visibility into time investment across goals</p>
                </li>
              </ul>
            </div>

            <div className="bg-background p-8 rounded-lg border shadow">
              <h3 className="text-xl font-bold mb-4 text-primary">With AmbitiousYou</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-primary">
                    <Check className="h-5 w-5" color="green" />
                  </div>
                  <p>All ambitions organized in one unified system</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-primary">
                    <Check className="h-5 w-5" color="green" />
                  </div>
                  <p>Visual progress tracking keeps you motivated daily</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-primary">
                    <Check className="h-5 w-5" color="green" />
                  </div>
                  <p>Prioritization tools ensure focus on what matters most</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-primary">
                    <Check className="h-5 w-5" color="green" />
                  </div>
                  <p>Time analytics show where your efforts are yielding results</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Hear From Our Ambitious Users
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join thousands of professionals who are achieving more than ever before
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-background p-6 rounded-lg shadow border">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20">
                </div>
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Marketing Director</p>
                </div>
              </div>
              <div className="flex text-amber-500 mb-2">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <p className="italic">
                "I've managed to complete my MBA while working full-time, thanks to AmbitiousYou's
                structured approach to goal tracking. I couldn't have done it without this tool."
              </p>
              <p className="text-primary mt-2 text-sm font-medium">
                Achieved 3 major career goals in 6 months
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow border">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20"></div>
                <div>
                  <h4 className="font-bold">Alex Chen</h4>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                </div>
              </div>
              <p className="italic">
                "The milestone tracking feature completely changed how I approach my professional
                development. I'm now on track for a promotion months ahead of schedule."
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow border">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20"></div>
                <div>
                  <h4 className="font-bold">Michael Torres</h4>
                  <p className="text-sm text-muted-foreground">Entrepreneur</p>
                </div>
              </div>
              <p className="italic">
                "As someone juggling multiple businesses, AmbitiousYou helps me stay focused on what
                matters. The visual progress tracking keeps me motivated every day."
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to know about getting started with AmbitiousYou
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How is AmbitiousYou different from regular task managers?
                </AccordionTrigger>
                <AccordionContent>
                  Unlike simple task managers, AmbitiousYou is specifically designed for long-term
                  ambition tracking with dual progress methods (tasks or milestones), built-in time
                  tracking, and powerful analytics that keep you motivated and focused on your
                  biggest goals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is there a free plan available?</AccordionTrigger>
                <AccordionContent>
                  Yes! AmbitiousYou offers a comprehensive free plan that includes up to 3 active
                  ambitions, basic progress tracking, and access to our core dashboard features. No
                  credit card required to get started.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How secure is my data?</AccordionTrigger>
                <AccordionContent>
                  We take data privacy seriously. All your information is encrypted both in transit
                  and at rest. We never sell your data to third parties, and you can export or
                  delete your information at any time.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I use AmbitiousYou on all my devices?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! AmbitiousYou works seamlessly on desktop, tablet, and mobile devices
                  with a responsive web design. Native mobile apps for iOS and Android are coming
                  soon!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to achieve your most ambitious goals?
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl/relaxed">
                Start for free today and see the difference in your productivity within the first
                week. No credit card required.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button asChild variant={"default"} size="lg" className="px-8">
                  <Link prefetch={true} href="/signup">
                    Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {/* <p className="text-xs text-muted-foreground mt-2">
                Join 50,000+ ambitious professionals already achieving their goals
              </p> */}
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
}: Readonly<{
  icon: React.ReactNode;
  title: string;
  description: string;
}>) {
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
      <Check className="h-5 w-5 mt-1 -translate-y-2 text-primary" color="green" />
      <p className="text-base font-medium leading-none">{children}</p>
    </div>
  );
}
