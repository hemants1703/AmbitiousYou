"use client";

import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconBoltFilled,
  IconCircleCheckFilled,
  IconHeartFilled,
  IconRocket,
  IconSparkles,
  IconTarget,
} from "@tabler/icons-react";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import DashboardMockup from "./DashboardMockup";

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
          <IconTarget className="size-16 text-red-500" />
        </MotionWrapper>
        <MotionWrapper
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1, y: [0, 20, 0] }}
          transition={{ duration: 7, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-40 right-[15%]"
        >
          <IconSparkles className="size-16 text-cyan-500" />
        </MotionWrapper>
      </div>

      {/* Announcement banner */}
      {/* <MotionWrapper
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
          <span className="text-sm font-medium">New: AI-powered goal recommendations now available</span>
        </div>
      </MotionWrapper> */}

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
            Reduce your mental overload and manage all your ambitions at a single and private place. AmbitiousYou helps
            you become a Superhuman.
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
                    Try It Now <IconArrowRight className="size-5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </MotionWrapper>

        {/* Animated Social proof */}
        <MotionWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.9 }}>
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-muted-foreground">
            {[
              { label: "Organized Life", delay: 0 },
              { label: "Clutter-free Goals", delay: 0.1 },
              { label: "Cumulative Progress", delay: 0.2 },
            ].map((item) => (
              <MotionWrapper
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1 + item.delay }}
              >
                <div className="flex items-center gap-2">
                  <IconCircleCheckFilled className="size-6 text-green-500" />
                  <span>{item.label}</span>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </MotionWrapper>
      </div>

      <MotionWrapper
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 w-full max-w-5xl mx-auto relative z-10 flex justify-center items-center text-center"
      >
        <a href="https://peerlist.io/hemants1703/project/ambitiousyou" target="_blank" rel="noreferrer">
          <img
            src="https://peerlist.io/api/v1/projects/embed/PRJHMQ6R6ERP8ADAR2DRGOM6RQ9RP6?showUpvote=true&theme=dark"
            alt="AmbitiousYou"
            style={{
              width: "auto",
              height: "72px",
            }}
          />
        </a>
      </MotionWrapper>

      {/* Animated App Preview - Using the real dashboard mockup */}
      <MotionWrapper
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 w-full max-w-5xl mx-auto relative z-10"
      >
        <div className="bg-linear-to-tr from-primary/20 to-secondary/10 rounded-xl p-1 shadow-xl">
          <DashboardMockup />
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
              <IconBoltFilled className="size-6 text-yellow-400" />
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
              <IconHeartFilled className="size-6 text-pink-500" />
              <span className="font-medium">Loved by 98% of users</span>
            </div>
          </div>
        </MotionWrapper>
      </MotionWrapper>
    </section>
  );
}
