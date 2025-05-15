import { Bricolage_Grotesque } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  RocketIcon,
  LightningBoltIcon,
  CheckCircledIcon,
  StarIcon,
  ArrowRightIcon,
  Component1Icon,
  MixerHorizontalIcon,
  TimerIcon,
  CheckIcon,
  ChevronRightIcon,
  LockClosedIcon,
  BarChartIcon,
  HeartFilledIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default async function Home() {
  // If user is logged in, redirect to dashboard
  const supabase = await createClient();
  const userLoggedIn = await supabase.auth.getUser();
  // if (!userLoggedIn.error) {
  //   redirect("/dashboard");
  // }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center w-full pt-7 pb-32 px-4">
        {/* Announcement banner */}
        <div className="z-10 mb-10 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-full px-5 py-2 flex items-center gap-2 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium">
            New: AI-powered goal recommendations now available
          </span>
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h1
            className={`${bricolage.className} tracking-tight text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70 leading-tight`}
          >
            For Those Who Dare to Dream Beyond Limits
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Reduce your mental overload and manage all your ambitions at a single and private place.
            AmbitiousYou helps you become a Superhuman.
          </p>
          {userLoggedIn.error === null ? (
            <Button className="text-xl" size={"lg"} asChild>
              <Link prefetch={true} href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                <Link prefetch={true} href="/signup" className="flex items-center gap-2">
                  Get Started <RocketIcon className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg h-12 px-8 hover:bg-primary/5 transition-all"
              >
                <Link prefetch={true} href="/features" className="flex items-center gap-2">
                  Explore Features <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircledIcon className="h-5 w-5 text-green-500" />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircledIcon className="h-5 w-5 text-green-500" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircledIcon className="h-5 w-5 text-green-500" />
              <span>Enterprise Grade Security</span>
            </div>
          </div>
        </div>

        {/* App Preview with interactive elements */}
        <div className="mt-16 w-full max-w-5xl mx-auto relative z-10">
          <div className="bg-gradient-to-tr from-primary/20 to-secondary/10 rounded-xl p-1 shadow-xl">
            <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-2xl border border-primary/10 overflow-hidden">
              {/* Browser-like mockup header */}
              <div className="bg-muted/60 border-b border-border flex items-center p-3">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-background/70 rounded-full h-6 px-3 text-xs flex items-center justify-center text-muted-foreground">
                  app.ambitiousyou.pro
                </div>
              </div>

              {/* App interface mockup */}
              <div className="w-full h-[500px] bg-background/80 backdrop-blur-sm flex">
                {/* Sidebar navigation mockup */}
                <div className="w-48 border-r border-border p-3 hidden md:block">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                    <div className="h-4 bg-muted w-24 rounded-md"></div>
                  </div>

                  <div className="space-y-3">
                    {["Dashboard", "Goals", "Tasks", "Analytics", "Settings"].map((item) => (
                      <div
                        key={item}
                        className={`h-7 rounded-md px-2 flex items-center text-xs ${item === "Goals" ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50 text-muted-foreground"}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main content mockup */}
                <div className="flex-1 p-4">
                  <div className="mb-4">
                    <div className="h-8 w-60 bg-primary/5 rounded-md mb-2"></div>
                    <div className="h-4 w-96 bg-muted/50 rounded-md"></div>
                  </div>

                  {/* Goal cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="border border-border rounded-lg p-4 bg-card/90 backdrop-blur-sm hover:border-primary/30 transition-all hover:shadow-md cursor-pointer"
                      >
                        <div className="flex justify-between mb-2">
                          <div className="h-6 w-36 bg-muted/40 rounded-md"></div>
                          <div
                            className={`h-6 w-20 rounded-full ${i === 2 ? "bg-primary/20 border border-primary/30" : "bg-muted/40"}`}
                          ></div>
                        </div>
                        <div className="h-3 w-full bg-muted/30 rounded-full mb-3">
                          <div
                            className={`h-3 rounded-full bg-primary/60`}
                            style={{ width: `${[70, 30, 100, 50][i - 1]}%` }}
                          ></div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <div className="h-3 w-full bg-muted/30 rounded-md"></div>
                          <div className="h-3 w-3/4 bg-muted/30 rounded-md"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive floating badges */}
          <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-2">
              <LightningBoltIcon className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">Increase productivity by 47%</span>
            </div>
          </div>

          <div className="absolute bottom-6 -left-6 bg-background/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full shadow-lg border border-primary/20 transform hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-2">
              <HeartFilledIcon className="h-4 w-4 text-pink-500" />
              <span className="font-medium">Loved by 98% of users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-medium text-sm">
              <BarChartIcon className="mr-2 h-4 w-4" />
              Features
            </div>
            <h2
              className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}
            >
              Transform How You Achieve Your Goals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AmbitiousYou provides the tools you need to set, track, and accomplish your most
              ambitious goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards with hover animations and consistent styling */}
            {[
              {
                icon: <Component1Icon className="h-6 w-6 text-primary" />,
                title: "Goal Hierarchy",
                description:
                  "Organize your ambitions from big dreams to daily tasks in a structured, manageable system.",
              },
              {
                icon: <MixerHorizontalIcon className="h-6 w-6 text-primary" />,
                title: "Priority Management",
                description:
                  "Focus on what matters most with our intuitive priority system that adapts to your changing needs.",
              },
              {
                icon: <TimerIcon className="h-6 w-6 text-primary" />,
                title: "Progress Tracking",
                description:
                  "Visualize your journey with beautiful charts and analytics that keep you motivated.",
              },
              {
                icon: <LockClosedIcon className="h-6 w-6 text-primary" />,
                title: "Private & Secure",
                description:
                  "Your ambitions are personal. We use enterprise-grade encryption to keep your data safe.",
              },
              {
                icon: <StarIcon className="h-6 w-6 text-primary" />,
                title: "Smart Notifications",
                description:
                  "Get personalized reminders at the right time to keep you on track with your goals.",
              },
              {
                icon: <RocketIcon className="h-6 w-6 text-primary" />,
                title: "AI Assistance",
                description:
                  "Receive intelligent suggestions to overcome obstacles and optimize your approach.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-card/80 backdrop-blur-sm rounded-xl p-7 shadow-md border border-border hover:border-primary/50 transition-all hover:shadow-xl"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <div className="mt-6 flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-medium text-sm">
              <StarFilledIcon className="mr-2 h-4 w-4 text-amber-400" />
              Testimonials
            </div>
            <h2
              className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}
            >
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of ambitious individuals who are achieving their dreams with
              AmbitiousYou.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonials with profile photos and ratings */}
            {[
              {
                quote:
                  "AmbitiousYou has been a game-changer for me. I've been able to achieve more in the past month than I did in the entire last year.",
                name: "John Doe",
                title: "Entrepreneur",
                rating: 5,
              },
              {
                quote:
                  "I've always been a dreamer, but AmbitiousYou has helped me turn my dreams into reality. The goal hierarchy system is brilliant!",
                name: "Jane Smith",
                title: "Product Designer",
                rating: 5,
              },
              {
                quote:
                  "I've tried many goal-setting apps, but none of them come close to AmbitiousYou. It's simple, yet powerful.",
                name: "Alex Johnson",
                title: "Marketing Director",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-background/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-border relative"
              >
                {/* Quote mark */}
                <div className="absolute -top-4 -left-4 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-primary text-xl font-serif">"</span>
                </div>

                <p className="text-lg text-foreground/90 mb-8 italic">"{testimonial.quote}"</p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>

                <div className="absolute top-6 right-6 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarFilledIcon key={i} className="h-4 w-4 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Brands/Companies section */}
          <div className="mt-20 text-center">
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-8">
              Trusted by ambitious individuals at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              {["Google", "Microsoft", "Amazon", "Apple", "Meta"].map((brand) => (
                <div
                  key={brand}
                  className="text-xl font-semibold opacity-50 hover:opacity-100 transition-opacity"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing comparison section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-medium text-sm">
              <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
              Simple Pricing
            </div>
            <h2 className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}>
              Choose Your Ambition Level
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start for free or unlock premium features to accelerate your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free tier */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-md h-full flex flex-col">
              <h3 className="text-xl font-bold mb-2">Explorer</h3>
              <p className="text-muted-foreground mb-6">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Button variant="outline" className="mb-8">
                <Link prefetch={true} href="/signup" className="flex justify-center items-center gap-2 w-full">
                  Start Free <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>

              <div className="space-y-3 mt-auto">
                {["3 Active Goals", "Basic Task Management", "Core Analytics", "7-Day History"].map(
                  (feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircledIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Pro tier (highlighted) */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl p-8 border-2 border-primary shadow-lg relative flex flex-col">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-sm py-1 px-4 rounded-full font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Achiever</h3>
              <p className="text-muted-foreground mb-6">For serious goal-setters</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Button className="mb-8 shadow-md shadow-primary/20">
                <Link prefetch={true} href="/pricing" className="flex justify-center items-center gap-2 w-full">
                  Get Started <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </Button>

              <div className="space-y-3 mt-auto">
                {[
                  "Unlimited Goals",
                  "Advanced Task Management",
                  "Detailed Analytics",
                  "Unlimited History",
                  "Priority Support",
                  "Custom Categories",
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircledIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise tier */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-md h-full flex flex-col">
              <h3 className="text-xl font-bold mb-2">Superhuman</h3>
              <p className="text-muted-foreground mb-6">For teams and businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Button variant="outline" className="mb-8">
                <Link prefetch={true} href="/pricing" className="flex justify-center items-center gap-2 w-full">
                  Contact Sales <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </Button>

              <div className="space-y-3 mt-auto">
                {[
                  "Everything in Achiever",
                  "Team Collaboration",
                  "AI Recommendations",
                  "Custom Integrations",
                  "Dedicated Support",
                  "Advanced Security",
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircledIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-background/30 border border-primary/20 rounded-2xl p-10 shadow-xl backdrop-blur-sm">
            <div className="text-center mb-10">
              <h2
                className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6 text-foreground`}
              >
                Ready to Achieve Your Dreams?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join AmbitiousYou today and start your journey towards becoming a Superhuman.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg h-12 px-8 shadow-lg shadow-primary/20">
                <Link prefetch={true} href="/signup" className="flex items-center gap-2">
                  Get Started <RocketIcon className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg h-12 px-8 hover:bg-primary/5">
                <Link prefetch={true} href="/pricing" className="flex items-center gap-2">
                  View Pricing <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Final social proof */}
            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Join thousands of users already achieving their dreams
              </p>
              <div className="flex justify-center">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                    >
                      {["JS", "KL", "AR", "TM", "BN"][i]}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium">
                    +3K
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
