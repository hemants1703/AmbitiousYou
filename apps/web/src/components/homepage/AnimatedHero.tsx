import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CheckCircleIcon, HeartIcon, RocketIcon, StarIcon, TargetIcon, ZapIcon } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import DashboardMockup from "./DashboardMockup";
import Image from "next/image";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function AnimatedHero() {
  return (
    <section className="relative flex flex-col justify-center items-center w-full pt-7 pb-32 px-4">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <TargetIcon className="absolute top-24 left-[10%] h-16 w-16 text-red-500" />
        <StarIcon className="absolute top-40 right-[15%] h-16 w-16 text-cyan-500" />
      </div>

      <div className="text-center max-w-4xl mx-auto relative z-10">
        {/* Animated Headline */}
        <h1 className={cn(bricolage.className, "tracking-tight text-5xl md:text-7xl font-extrabold mb-6", "bg-clip-text text-transparent bg-linear-to-r from-primary via-primary/90 to-primary/70 leading-tight")}>
          For Those Who Dare to Dream Beyond Limits
        </h1>

        {/* Animated Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">Reduce your mental overload and manage all your ambitions at a single and private place. AmbitiousYou helps you become a Superhuman.</p>

        {/* Animated CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            <Link prefetch={true} href="/signup" className="flex items-center gap-2">
              Get Started <RocketIcon className="h-6 w-6" />
            </Link>
          </Button>
          <Button asChild size="lg" className="text-lg h-12 px-8 hover:bg-primary/5 transition-all">
            <Link prefetch={true} href="/experience" className="flex items-center gap-2">
              Try It Now <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Animated Social proof */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-muted-foreground">
          {[
            { label: "Organized Life", delay: 0 },
            { label: "Clutter-free Goals", delay: 0.1 },
            { label: "Cumulative Progress", delay: 0.2 },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 w-full max-w-5xl mx-auto relative z-10 flex justify-center items-center text-center">
        <a href="https://peerlist.io/hemants1703/project/ambitiousyou" target="_blank" rel="noreferrer">
          <Image src="https://peerlist.io/api/v1/projects/embed/PRJHMQ6R6ERP8ADAR2DRGOM6RQ9RP6?showUpvote=true&theme=dark" alt="AmbitiousYou" width={100} height="72" />
        </a>
      </div>

      {/* Animated App Preview - Using the real dashboard mockup */}
      <div className="mt-16 w-full max-w-5xl mx-auto relative z-10">
        <div className="bg-linear-to-tr from-primary/20 to-secondary/10 rounded-xl p-1 shadow-xl">
          <DashboardMockup />
        </div>

        {/* Animated floating badges */}
        <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg cursor-pointer">
          <div className="flex items-center gap-2">
            <ZapIcon className="h-6 w-6 text-yellow-400" />
            <span className="font-medium">Increase productivity by 47%</span>
          </div>
        </div>

        <div className="absolute bottom-6 -left-6 bg-background/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full shadow-lg border border-primary/20 cursor-pointer">
          <div className="flex items-center gap-2">
            <HeartIcon className="h-6 w-6 text-pink-500" />
            <span className="font-medium">Loved by 98% of users</span>
          </div>
        </div>
      </div>
    </section>
  );
}
