import { Bricolage_Grotesque } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  RocketIcon,
  LightningBoltIcon,
  CheckCircledIcon,
  ArrowRightIcon,
  CheckIcon,
  HeartFilledIcon,
} from "@radix-ui/react-icons";
import { createClient } from "@/utils/supabase/server";
import Testimonials from "@/features/root/Testimonials";
import Features from "@/features/root/Features";
import CTA from "@/features/root/CTA";
import Pricing from "@/features/root/Pricing";

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
              <Link prefetch={true} href="/dashboard">
                Dashboard
              </Link>
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
              <span>Organized Life</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircledIcon className="h-5 w-5 text-green-500" />
              <span>Clutter-free Goals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircledIcon className="h-5 w-5 text-green-500" />
              <span>Cumulative Progress</span>
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
      <Features />

      {/* Testimonials Section */}
      {/* <Testimonials /> */}

      {/* Pricing comparison section */}
      {/* <Pricing /> */}

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
