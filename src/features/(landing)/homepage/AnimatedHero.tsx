"use client";

import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CheckCircledIcon,
  HeartFilledIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import { IconArrowRight, IconRocket, IconSparkles, IconTarget } from "@tabler/icons-react";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface AnimatedHeroProps {
  isLoggedIn: boolean;
}

export default function AnimatedHero({ isLoggedIn }: AnimatedHeroProps) {
  return (
    <section className="relative flex flex-col justify-center items-center w-full pt-7 pb-32 px-4">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <MotionWrapper
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1, y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-24 left-[10%]"
        >
          <IconTarget className="h-16 w-16 text-primary" />
        </MotionWrapper>
        <MotionWrapper
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1, y: [0, 20, 0] }}
          transition={{ duration: 7, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-40 right-[15%]"
        >
          <IconSparkles className="h-12 w-12 text-primary" />
        </MotionWrapper>
        <MotionWrapper
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1, rotate: [0, 10, 0] }}
          transition={{ duration: 8, delay: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-40 left-[20%]"
        >
          <IconRocket className="h-14 w-14 text-primary" />
        </MotionWrapper>
      </div>

      {/* Announcement banner */}
      <MotionWrapper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="z-10 mb-10"
      >
        <div className="bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-full px-5 py-2 flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium">
            New: AI-powered goal recommendations now available
          </span>
        </div>
      </MotionWrapper>

      <div className="text-center max-w-4xl mx-auto relative z-10">
        {/* Animated Headline */}
        <MotionWrapper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1
            className={cn(
              bricolage.className,
              "tracking-tight text-5xl md:text-7xl font-extrabold mb-6",
              "bg-clip-text text-transparent bg-linear-to-r from-primary via-primary/90 to-primary/70 leading-tight"
            )}
          >
            For Those Who Dare to Dream Beyond Limits
          </h1>
        </MotionWrapper>

        {/* Animated Subheading */}
        <MotionWrapper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Reduce your mental overload and manage all your ambitions at a single and private place.
            AmbitiousYou helps you become a Superhuman.
          </p>
        </MotionWrapper>

        {/* Animated CTA buttons */}
        <MotionWrapper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Button variant="ay" size="lg" className="text-lg group h-12" asChild>
                <Link prefetch={true} href="/dashboard">
                  Go to Dashboard
                  <IconArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  variant="ay"
                  className="text-lg h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  <Link prefetch={true} href="/signup" className="flex items-center gap-2">
                    Get Started <IconRocket className="size-6" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ay-secondary"
                  size="lg"
                  className="text-lg h-12 px-8 hover:bg-primary/5 transition-all"
                >
                  <Link prefetch={true} href="/experience" className="flex items-center gap-2">
                    Try It Now <ArrowRightIcon className="h-5 w-5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </MotionWrapper>

        {/* Animated Social proof */}
        <MotionWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-muted-foreground">
            {[
              { label: "Organized Life", delay: 0 },
              { label: "Clutter-free Goals", delay: 0.1 },
              { label: "Cumulative Progress", delay: 0.2 },
            ].map((item, index) => (
              <MotionWrapper
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1 + item.delay }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircledIcon className="h-5 w-5 text-green-500" />
                  <span>{item.label}</span>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </MotionWrapper>
      </div>

      {/* Animated App Preview */}
      <MotionWrapper
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 w-full max-w-5xl mx-auto relative z-10"
      >
        <div className="bg-linear-to-tr from-primary/20 to-secondary/10 rounded-xl p-1 shadow-xl">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-2xl border border-primary/10 overflow-hidden">
            {/* Browser-like mockup header */}
            <div className="bg-muted/60 border-b border-border flex items-center p-3">
              <div className="flex gap-1.5 mr-4">
                <MotionWrapper
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                </MotionWrapper>
                <MotionWrapper
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                >
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                </MotionWrapper>
                <MotionWrapper
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                >
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </MotionWrapper>
              </div>
              <div className="flex-1 bg-background/70 rounded-full h-6 px-3 text-xs flex items-center justify-center text-muted-foreground">
                ambitiousyou.pro/dashboard
              </div>
            </div>

            {/* App interface mockup */}
            <div className="w-full h-[500px] bg-background/80 backdrop-blur-sm flex">
              {/* Sidebar navigation mockup */}
              <div className="w-48 border-r border-border p-3 hidden md:block">
                <div className="flex items-center gap-2 mb-5">
                  <MotionWrapper
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                  </MotionWrapper>
                  <div className="h-4 bg-muted w-24 rounded-md"></div>
                </div>

                <div className="space-y-3">
                  {["Dashboard", "Goals", "Tasks", "Analytics", "Settings"].map((item, index) => (
                    <MotionWrapper
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                    >
                      <div
                        className={cn(
                          "h-7 rounded-md px-2 flex items-center text-xs transition-all",
                          item === "Goals"
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted/50 text-muted-foreground"
                        )}
                      >
                        {item}
                      </div>
                    </MotionWrapper>
                  ))}
                </div>
              </div>

              {/* Main content mockup */}
              <div className="flex-1 p-4">
                <MotionWrapper
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="mb-4">
                    <div className="h-8 w-60 bg-primary/5 rounded-md mb-2"></div>
                    <div className="h-4 w-96 bg-muted/50 rounded-md"></div>
                  </div>
                </MotionWrapper>

                {/* Animated Goal cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                  {[
                    { progress: 70, delay: 1.3 },
                    { progress: 30, delay: 1.4 },
                    { progress: 100, delay: 1.5 },
                    { progress: 50, delay: 1.6 },
                  ].map((card, i) => (
                    <MotionWrapper
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: card.delay }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="border border-border rounded-lg p-4 bg-card/90 backdrop-blur-sm hover:border-primary/30 transition-all hover:shadow-md cursor-pointer">
                        <div className="flex justify-between mb-2">
                          <div className="h-6 w-36 bg-muted/40 rounded-md"></div>
                          <div
                            className={cn(
                              "h-6 w-20 rounded-full",
                              i === 1 ? "bg-primary/20 border border-primary/30" : "bg-muted/40"
                            )}
                          ></div>
                        </div>
                        <div className="h-3 w-full bg-muted/30 rounded-full mb-3 overflow-hidden">
                          <MotionWrapper
                            initial={{ width: 0 }}
                            animate={{ width: `${card.progress}%` }}
                            transition={{ delay: card.delay + 0.3, duration: 0.8 }}
                            className="h-3 rounded-full bg-primary/60"
                          />
                        </div>
                        <div className="space-y-2 mt-4">
                          <div className="h-3 w-full bg-muted/30 rounded-md"></div>
                          <div className="h-3 w-3/4 bg-muted/30 rounded-md"></div>
                        </div>
                      </div>
                    </MotionWrapper>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated floating badges */}
        <MotionWrapper
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 1.8, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          className="absolute -top-6 -right-6"
        >
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg cursor-pointer">
            <div className="flex items-center gap-2">
              <LightningBoltIcon className="h-4 w-4 text-yellow-400" />
              <span className="font-medium">Increase productivity by 47%</span>
            </div>
          </div>
        </MotionWrapper>

        <MotionWrapper
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 2, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-6 -left-6"
        >
          <div className="bg-background/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full shadow-lg border border-primary/20 cursor-pointer">
            <div className="flex items-center gap-2">
              <HeartFilledIcon className="h-4 w-4 text-pink-500" />
              <span className="font-medium">Loved by 98% of users</span>
            </div>
          </div>
        </MotionWrapper>
      </MotionWrapper>
    </section>
  );
}
